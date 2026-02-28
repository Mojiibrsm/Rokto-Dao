'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplet, ArrowLeft, ArrowRight, Loader2, Search, Check, ChevronsUpDown, Plus, Hospital, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { createBloodRequest } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { getDistricts, getUpazillas, getUnionsApi, type LocationEntry } from '@/lib/bangladesh-api';
import { getDynamicHospitals } from '@/lib/hospital-api';
import { HOSPITALS } from '@/lib/hospital-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const DISEASES = [
  "থ্যালাসেমিয়া", 
  "ডেঙ্গু", 
  "লিউকেমিয়া", 
  "ক্যান্সার", 
  "তীব্র রক্তস্বল্পতা (অ্যানিমিয়া)", 
  "রক্তশূন্যতা (হিমোগ্লোবিন স্বল্পতা)",
  "সিকেল সেল রোগ", 
  "হিমোফিলিয়া", 
  "অ্যাপ্লাস্টিক অ্যানিমিয়া", 
  "দীর্ঘমেয়াদি কিডনি রোগ", 
  "কিডনি ডায়ালাইসিস",
  "লিভার সিরোসিস", 
  "পাকস্থলী বা অন্ত্রের রক্তক্ষরণ", 
  "প্রসবকালীন জটিলতা (Maternity)",
  "প্রসবজনিত অতিরিক্ত রক্তক্ষরণ", 
  "সিজারিয়ান অপারেশন (C-Section)",
  "ম্যালেরিয়া", 
  "বোন ম্যারো রোগ", 
  "দুর্ঘটনাজনিত রক্তক্ষরণ", 
  "অস্ত্রোপচার (বড় অপারেশন)", 
  "হৃদরোগের অস্ত্রোপচার (Heart Surgery)",
  "রক্তের প্লাটিলেট ঘাটতি", 
  "অভ্যন্তরীণ রক্তক্ষরণ", 
  "গুরুতর আঘাত", 
  "হার্ট ব্লক",
  "রক্তসংক্রান্ত বিরল রোগ", 
  "অন্যান্য"
];

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

export default function NewRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState<LocationEntry[]>([]);
  const [upazilas, setUpazilas] = useState<LocationEntry[]>([]);
  const [unions, setUnions] = useState<LocationEntry[]>([]);
  const [loadingLocations, setLoadingLocations] = useState({ districts: false, upazilas: false, unions: false });
  
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalPopoverOpen, setHospitalPopoverOpen] = useState(false);
  const [dynamicHospitals, setDynamicHospitals] = useState<string[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
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
  const selectedUpazila = form.watch('area');
  const selectedDisease = form.watch('disease');

  // Logic to determine if extra info is needed
  const needsHb = ["থ্যালাসেমিয়া", "তীব্র রক্তস্বল্পতা (অ্যানিমিয়া)", "রক্তশূন্যতা (হিমোগ্লোবিন স্বল্পতা)", "সিকেল সেল রোগ"].includes(selectedDisease || "");
  const needsPlt = ["ডেঙ্গু", "রক্তের প্লাটিলেট ঘাটতি"].includes(selectedDisease || "");

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
    async function loadUpazillasAndHospitals() {
      if (selectedDistrict) {
        setLoadingLocations(prev => ({ ...prev, upazilas: true }));
        const data = await getUpazillas(selectedDistrict);
        setUpazilas(data);
        setLoadingLocations(prev => ({ ...prev, upazilas: false }));

        setLoadingHospitals(true);
        try {
          const fetched = await getDynamicHospitals(selectedDistrict);
          setDynamicHospitals(fetched);
        } catch (e) {
          setDynamicHospitals([]);
        } finally {
          setLoadingHospitals(false);
        }
      } else {
        setUpazilas([]);
        setDynamicHospitals([]);
      }
      form.setValue('area', '');
      form.setValue('union', '');
    }
    loadUpazillasAndHospitals();
  }, [selectedDistrict, form]);

  useEffect(() => {
    async function loadUnions() {
      if (selectedDistrict && selectedUpazila && selectedUpazila !== 'N/A') {
        setLoadingLocations(prev => ({ ...prev, unions: true }));
        const data = await getUnionsApi(selectedUpazila, selectedDistrict);
        setUnions(data);
        setLoadingLocations(prev => ({ ...prev, unions: false }));
      } else {
        setUnions([]);
      }
      form.setValue('union', '');
    }
    loadUnions();
  }, [selectedUpazila, selectedDistrict, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createBloodRequest(values as any);
      if (result && (result.success || result.id)) {
        toast({
          title: "অনুরোধ সফলভাবে জমা হয়েছে!",
          description: "আপনার অনুরোধটি এখন লাইভ দেখা যাচ্ছে।",
        });
        router.push('/requests');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: error.message || "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const combinedHospitals = Array.from(new Set([...HOSPITALS, ...dynamicHospitals]));
  const filteredHospitals = combinedHospitals.filter(h => 
    h.toLowerCase().includes(hospitalSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/requests"><ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান</Link>
        </Button>
      </div>

      <Card className="w-full max-w-2xl shadow-xl border-t-8 border-t-primary rounded-3xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Droplet className="h-8 w-8 text-primary fill-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">জরুরী রক্তের অনুরোধ করুন</CardTitle>
          <CardDescription className="text-lg">
            অনুগ্রহ করে রোগীর সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>রোগীর নাম (ঐচ্ছিক)</FormLabel>
                      <FormControl>
                        <Input placeholder="রোগীর নাম (না দিলেও চলবে)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>প্রয়োজনীয় রক্তের গ্রুপ *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="গ্রুপ নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Disease Selection Section */}
              <div className="space-y-6 p-6 bg-muted/20 rounded-2xl border border-primary/5">
                <div className="flex items-center gap-2 text-primary font-bold mb-2">
                  <Activity className="h-5 w-5" /> রোগের তথ্য (ঐচ্ছিক)
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="disease"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>রোগের ধরন</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="রোগ নির্বাচন করুন" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DISEASES.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional Info Fields */}
                  {needsHb && (
                    <FormField
                      control={form.control}
                      name="diseaseInfo"
                      render={({ field }) => (
                        <FormItem className="animate-in slide-in-from-top-2 duration-300">
                          <FormLabel className="text-secondary font-bold">হিমোগ্লোবিন লেভেল (Hb)</FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: 6.5 g/dL" {...field} className="border-secondary/30 focus:border-secondary" />
                          </FormControl>
                          <FormDescription>রোগীর বর্তমান হিমোগ্লোবিনের মাত্রা লিখুন।</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {needsPlt && (
                    <FormField
                      control={form.control}
                      name="diseaseInfo"
                      render={({ field }) => (
                        <FormItem className="animate-in slide-in-from-top-2 duration-300">
                          <FormLabel className="text-blue-600 font-bold">প্লাটিলেট কাউন্ট</FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: 45,000" {...field} className="border-blue-200 focus:border-blue-500" />
                          </FormControl>
                          <FormDescription>রোগীর বর্তমান প্লাটিলেট সংখ্যা লিখুন।</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedDisease === "অন্যান্য" && (
                    <FormField
                      control={form.control}
                      name="diseaseInfo"
                      render={({ field }) => (
                        <FormItem className="animate-in slide-in-from-top-2 duration-300">
                          <FormLabel>বিস্তারিত তথ্য</FormLabel>
                          <FormControl>
                            <Input placeholder="রোগ সম্পর্কে কিছু লিখুন" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center justify-between">
                      <span>হাসপাতালের নাম *</span>
                      {loadingHospitals && <Badge variant="outline" className="animate-pulse py-0 h-5 text-[10px]">DGHS ডাটা লোড হচ্ছে...</Badge>}
                    </FormLabel>
                    <Popover open={hospitalPopoverOpen} onOpenChange={setHospitalPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-12 bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Hospital className="h-4 w-4 shrink-0 text-primary" />
                              <span className="truncate">{field.value ? field.value : "তালিকা থেকে খুঁজুন বা টাইপ করুন"}</span>
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <div className="flex items-center border-b px-3 bg-muted/20">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="হাসপাতাল বা ক্লিনিকের নাম..."
                            value={hospitalSearch}
                            onChange={(e) => setHospitalSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-1">
                          {filteredHospitals.length === 0 ? (
                            <div className="py-4 px-4 text-center">
                              <p className="text-sm text-muted-foreground mb-3">তালিকায় নেই? আপনি যা লিখেছেন তা ব্যবহার করতে পারেন:</p>
                              <Button 
                                type="button"
                                variant="secondary" 
                                className="w-full justify-start gap-2"
                                onClick={() => {
                                  form.setValue("hospitalName", hospitalSearch);
                                  setHospitalPopoverOpen(false);
                                }}
                              >
                                <Plus className="h-4 w-4" /> "{hospitalSearch}" ব্যবহার করুন
                              </Button>
                            </div>
                          ) : (
                            <>
                              {filteredHospitals.map((h) => (
                                <div
                                  key={h}
                                  className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none hover:bg-primary hover:text-white transition-colors",
                                    field.value === h && "bg-primary/10 text-primary"
                                  )}
                                  onClick={() => {
                                    form.setValue("hospitalName", h);
                                    setHospitalPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === h ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {h}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/30 rounded-2xl border border-primary/10">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        জেলা * {loadingLocations.districts && <Loader2 className="h-3 w-3 animate-spin" />}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="জেলা" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        উপজেলা {loadingLocations.upazilas && <Loader2 className="h-3 w-3 animate-spin" />}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDistrict}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="সিলেক্ট করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="N/A">জানি না / নেই</SelectItem>
                          {upazilas.map(u => (
                            <SelectItem key={u.id} value={u.bn_name}>{u.bn_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="union"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        ইউনিয়ন {loadingLocations.unions && <Loader2 className="h-3 w-3 animate-spin" />}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedUpazila || selectedUpazila === 'N/A'}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="সিলেক্ট করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="N/A">জানি না / নেই</SelectItem>
                          {unions.map(u => (
                            <SelectItem key={u.id} value={u.bn_name}>{u.bn_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>যোগাযোগের নম্বর *</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bagsNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ব্যাগ সংখ্যা *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="neededWhen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>কখন প্রয়োজন? *</FormLabel>
                    <FormControl>
                      <Input placeholder="যেমন: জরুরি ভিত্তিতে / আগামীকাল সকাল ১০টায়" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isUrgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-4 bg-primary/5">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-primary font-bold">জরুরী অনুরোধ</FormLabel>
                      <FormDescription>
                        এটি একটি অতি জরুরি অনুরোধ হিসেবে চিহ্নিত করুন।
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary h-14 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    প্রসেসিং হচ্ছে...
                  </>
                ) : (
                  <>
                    অনুরোধ জমা দিন <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center border-t bg-muted/30 py-6 rounded-b-3xl">
          <p className="text-sm text-muted-foreground text-center">
            আপনার অনুরোধটি জমা দেওয়ার পর এডমিন দ্বারা যাচাইকৃত হতে পারে।
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
