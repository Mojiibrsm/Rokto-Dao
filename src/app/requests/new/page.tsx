
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplet, ArrowLeft, ArrowRight, Loader2, Search, Check, ChevronsUpDown, Plus, Hospital } from 'lucide-react';
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

const formSchema = z.object({
  patientName: z.string().min(2, 'রোগীর নাম দিন'),
  bloodType: z.string().min(1, 'রক্তের গ্রুপ নির্বাচন করুন'),
  hospitalName: z.string().min(2, 'হাসপাতালের নাম দিন'),
  district: z.string().min(1, 'জেলা নির্বাচন করুন'),
  area: z.string().optional(),
  union: z.string().optional(),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  neededWhen: z.string().min(2, 'কখন প্রয়োজন তা লিখুন'),
  bagsNeeded: z.string().min(1, 'ব্যাগ সংখ্যা দিন'),
  isUrgent: z.boolean().default(false),
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
    },
  });

  const selectedDistrict = form.watch('district');
  const selectedUpazila = form.watch('area');

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
        // Load Upazillas
        setLoadingLocations(prev => ({ ...prev, upazilas: true }));
        const data = await getUpazillas(selectedDistrict);
        setUpazilas(data);
        setLoadingLocations(prev => ({ ...prev, upazilas: false }));

        // Load Dynamic Hospitals from DGHS API
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

  // Combine static hospital list with dynamically fetched ones
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
                      <FormLabel>রোগীর নাম/অবস্থা *</FormLabel>
                      <FormControl>
                        <Input placeholder="যেমন: থ্যালাসেমিয়া রোগী" {...field} />
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
                              {hospitalSearch && !filteredHospitals.includes(hospitalSearch) && (
                                <div className="border-t mt-1 pt-1">
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    className="w-full justify-start gap-2 text-primary"
                                    onClick={() => {
                                      form.setValue("hospitalName", hospitalSearch);
                                      setHospitalPopoverOpen(false);
                                    }}
                                  >
                                    <Plus className="h-4 w-4" /> "{hospitalSearch}" যোগ করুন
                                  </Button>
                                </div>
                              )}
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
                        উপজেলা (ঐচ্ছিক) {loadingLocations.upazilas && <Loader2 className="h-3 w-3 animate-spin" />}
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
                        ইউনিয়ন (ঐচ্ছিক) {loadingLocations.unions && <Loader2 className="h-3 w-3 animate-spin" />}
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
