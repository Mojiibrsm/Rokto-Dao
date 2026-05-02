'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import { Droplet, ArrowLeft, ArrowRight, Loader2, Hospital, WifiOff, CloudUpload, AlertCircle, MapPin, Navigation, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { createBloodRequest } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { getDistricts, getUpazillas, type LocationEntry } from '@/lib/bangladesh-api';
import { HOSPITALS, type HospitalEntry } from '@/lib/hospital-data';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LocationPicker = dynamic(() => import('@/components/location-picker'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-2xl" />
});

const formSchema = z.object({
  patientName: z.string().optional().or(z.literal('')),
  bloodType: z.string().min(1, 'রক্তের গ্রুপ নির্বাচন করুন'),
  hospitalName: z.string().min(2, 'হাসপাতালের নাম দিন'),
  district: z.string().min(1, 'জেলা নির্বাচন করুন'),
  area: z.string().optional(),
  union: z.string().optional(),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  neededWhen: z.string().min(2, 'কখন প্রয়োজন তা লিখুন'),
  bagsNeeded: z.string().min(1, 'ব্যাগ সংখ্যা দিন'),
  isUrgent: z.boolean().default(false),
  disease: z.string().optional(),
  diseaseInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function getDist(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function NewRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [districts, setDistricts] = useState<LocationEntry[]>([]);
  const [upazilas, setUpazilas] = useState<LocationEntry[]>([]);
  const [loadingLocations, setLoadingLocations] = useState({ districts: false, upazilas: false });
  const [suggestedHospitals, setSuggestedHospitals] = useState<HospitalEntry[]>([]);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem('roktodao_offline_request');
    if (saved) setHasOfflineData(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      bloodType: '',
      hospitalName: '',
      district: '',
      area: '',
      union: '',
      phone: '',
      neededWhen: '',
      bagsNeeded: '1',
      isUrgent: false,
      disease: '',
      diseaseInfo: '',
    },
  });

  const selectedDistrict = form.watch('district');

  useEffect(() => {
    async function loadDistricts() {
      setLoadingLocations(prev => ({ ...prev, districts: true }));
      const data = await getDistricts();
      setDistricts(data);
      setLoadingLocations(prev => ({ ...prev, districts: false }));
    }
    loadDistricts();
  }, []);

  useEffect(() => {
    async function loadUpazillas() {
      if (selectedDistrict) {
        setLoadingLocations(prev => ({ ...prev, upazilas: true }));
        const data = await getUpazillas(selectedDistrict);
        setUpazilas(data);
        setLoadingLocations(prev => ({ ...prev, upazilas: false }));
        
        const inDistrict = HOSPITALS.filter(h => h.district === selectedDistrict);
        setSuggestedHospitals(inDistrict);
      } else {
        setUpazilas([]);
        setSuggestedHospitals([]);
      }
      form.setValue('area', '');
    }
    loadUpazillas();
  }, [selectedDistrict, form]);

  const handleLocationPicked = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    const withDistance = HOSPITALS.map(h => ({
      ...h,
      distance: getDist(lat, lng, h.lat, h.lng)
    })).sort((a, b) => a.distance - b.distance);
    
    setSuggestedHospitals(withDistance.slice(0, 5));
    toast({
      title: "অবস্থান শনাক্ত হয়েছে",
      description: "আপনার অবস্থানের নিকটস্থ হাসপাতালগুলো সাজেস্ট করা হয়েছে।",
    });
  };

  const handleDetectBrowserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        handleLocationPicked(pos.coords.latitude, pos.coords.longitude);
      }, () => {
        toast({ variant: "destructive", title: "ব্যর্থ হয়েছে", description: "অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন।" });
      });
    }
  };

  async function onSubmit(values: FormValues) {
    if (!navigator.onLine) {
      localStorage.setItem('roktodao_offline_request', JSON.stringify(values));
      setHasOfflineData(true);
      toast({ title: "অফলাইনে সেভ হয়েছে" });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createBloodRequest(values as any);
      if (result && (result.success || result.id)) {
        toast({ title: "অনুরোধ সফলভাবে জমা হয়েছে!" });
        router.push('/requests');
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSync = async () => {
    const saved = localStorage.getItem('roktodao_offline_request');
    if (!saved) return;
    setIsSubmitting(true);
    try {
      const values = JSON.parse(saved);
      const result = await createBloodRequest(values as any);
      if (result && result.success) {
        localStorage.removeItem('roktodao_offline_request');
        setHasOfflineData(false);
        toast({ title: "সিঙ্ক সফল!" });
        router.push('/requests');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6 flex flex-col gap-4">
        <Button variant="ghost" asChild className="w-fit">
          <Link href="/requests"><ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান</Link>
        </Button>

        {!isOnline && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800 rounded-2xl">
            <WifiOff className="h-5 w-5" />
            <AlertTitle className="font-black">অফলাইন মোড অ্যাক্টিভ</AlertTitle>
            <AlertDescription className="font-medium">আপনার ইন্টারনেট সংযোগ নেই। তথ্য ফোনে সেভ থাকবে।</AlertDescription>
          </Alert>
        )}

        {hasOfflineData && isOnline && (
          <Alert className="bg-green-50 border-green-200 text-green-800 rounded-2xl flex items-center justify-between">
            <div className="flex gap-3">
              <CloudUpload className="h-5 w-5" />
              <div>
                <AlertTitle className="font-black">তথ্য সিঙ্ক করতে হবে</AlertTitle>
                <AlertDescription className="font-medium">আপনার একটি অফলাইন অনুরোধ পেন্ডিং আছে।</AlertDescription>
              </div>
            </div>
            <Button onClick={handleSync} disabled={isSubmitting} size="sm" className="bg-green-600 hover:bg-green-700">সিঙ্ক করুন</Button>
          </Alert>
        )}
      </div>

      <Card className="w-full max-w-3xl shadow-2xl border-t-8 border-t-primary rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center space-y-2 bg-primary/5 pb-10">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2 shadow-inner">
            <Droplet className="h-10 w-10 text-primary fill-primary" />
          </div>
          <CardTitle className="text-4xl font-black font-headline">জরুরী রক্তের অনুরোধ</CardTitle>
          <CardDescription className="text-lg font-bold">হাসপাতালের সঠিক অবস্থান নিশ্চিত করুন।</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-black flex items-center gap-2">
                       <MapPin className="h-5 w-5 text-primary" /> হাসপাতালের অবস্থান (Map)
                    </FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDetectBrowserLocation}
                      className="rounded-full h-8 px-4 font-bold border-primary/20 text-primary"
                    >
                      <Navigation className="h-3 w-3 mr-2" /> Detect My Location
                    </Button>
                 </div>
                 <LocationPicker 
                   onLocationSelect={handleLocationPicked} 
                   selectedDistrict={selectedDistrict}
                   initialCoords={coords || undefined}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black">জেলা *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="জেলা সিলেক্ট করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {districts.map(d => (
                            <SelectItem key={d.id} value={d.bn_name}>{d.bn_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hospitalName"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="font-black">হাসপাতালের নাম *</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input className="pl-12 h-12 rounded-xl border-2 focus:border-primary" placeholder="হাসপাতালের নাম লিখুন" {...field} />
                        </div>
                      </FormControl>
                      
                      {suggestedHospitals.length > 0 && (
                        <div className="mt-3 p-4 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 animate-in fade-in slide-in-from-top-2">
                           <p className="text-[10px] font-black uppercase text-primary mb-3 flex items-center gap-2">
                             <Sparkles className="h-3 w-3" /> নিকটস্থ হাসপাতাল (Suggested)
                           </p>
                           <div className="flex flex-wrap gap-2">
                              {suggestedHospitals.map((h, i) => (
                                <Button 
                                  key={i} 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => form.setValue('hospitalName', h.name)}
                                  className="text-[11px] font-bold h-7 rounded-full bg-white border-primary/20 text-slate-800 hover:bg-primary hover:text-white transition-all shadow-sm px-4"
                                >
                                  {h.name}
                                </Button>
                              ))}
                           </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black">প্রয়োজনীয় রক্তের গ্রুপ *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-2">
                            <SelectValue placeholder="গ্রুপ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                            <SelectItem key={type} value={type} className="font-bold">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bagsNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black">কত ব্যাগ রক্ত প্রয়োজন? *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" className="h-12 rounded-xl border-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black">যোগাযোগের নম্বর *</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" className="h-12 rounded-xl border-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neededWhen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black">কখন প্রয়োজন? *</FormLabel>
                      <FormControl>
                        <Input placeholder="যেমন: আজ রাত ১০টায়" className="h-12 rounded-xl border-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isUrgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-[2rem] border-4 border-primary/10 p-6 bg-primary/5 shadow-inner">
                    <div className="space-y-1">
                      <FormLabel className="text-xl text-primary font-black">অতি জরুরী অনুরোধ</FormLabel>
                      <FormDescription className="font-bold">
                        অটো-এসএমএস এবং ব্রডকাস্ট এলার্ট পাঠানোর জন্য এটি অন করুন।
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-125"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary h-20 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-3 h-8 w-8 animate-spin" /> প্রসেসিং...</>
                ) : (
                  <>অনুরোধ জমা দিন <ArrowRight className="ml-3 h-8 w-8" /></>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center border-t bg-muted/20 py-8 px-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold">
             <AlertCircle className="h-5 w-5 text-primary" />
             <span>রক্তদানের বিনিময়ে কোনো প্রকার আর্থিক লেনদেন দণ্ডনীয় অপরাধ।</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
