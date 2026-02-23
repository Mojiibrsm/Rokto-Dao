'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplet, ArrowRight, Loader2, Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { registerDonor } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { getDistricts, getUpazillas, getUnionsApi, type LocationEntry } from '@/lib/bangladesh-api';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const formSchema = z.object({
  fullName: z.string().min(2, 'নাম খুবই ছোট'),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  bloodType: z.string().min(1, 'রক্তের গ্রুপ নির্বাচন করুন'),
  district: z.string().min(1, 'জেলা নির্বাচন করুন'),
  area: z.string().min(1, 'উপজেলা নির্বাচন করুন'),
  union: z.string().min(1, 'ইউনিয়ন নির্বাচন করুন'),
});

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState<LocationEntry[]>([]);
  const [upazilas, setUpazilas] = useState<LocationEntry[]>([]);
  const [unions, setUnions] = useState<LocationEntry[]>([]);
  const [loadingLocations, setLoadingLocations] = useState({ districts: false, upazilas: false, unions: false });
  const [districtSearch, setDistrictSearch] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      bloodType: '',
      district: '',
      area: '',
      union: '',
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
    async function loadUpazillas() {
      if (selectedDistrict) {
        setLoadingLocations(prev => ({ ...prev, upazilas: true }));
        const data = await getUpazillas(selectedDistrict);
        setUpazilas(data);
        setLoadingLocations(prev => ({ ...prev, upazilas: false }));
      } else {
        setUpazilas([]);
      }
      form.setValue('area', '');
      form.setValue('union', '');
    }
    loadUpazillas();
  }, [selectedDistrict, form]);

  useEffect(() => {
    async function loadUnions() {
      if (selectedDistrict && selectedUpazila) {
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
      const result = await registerDonor(values);
      if (result.success) {
        // Save session locally
        localStorage.setItem('roktodao_user', JSON.stringify({
          email: values.email,
          fullName: values.fullName,
          bloodType: values.bloodType
        }));
        
        toast({
          title: "নিবন্ধন সফল!",
          description: "আপনি এখন আমাদের জীবন রক্ষাকারী সম্প্রদায়ের অংশ।",
        });
        
        window.dispatchEvent(new Event('storage')); // Update navigation
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "নিবন্ধন ব্যর্থ",
        description: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredDistricts = districts.filter(d => 
    d.bn_name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8 text-primary fill-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">দাতা হিসেবে নিবন্ধন করুন</CardTitle>
          <CardDescription>আপনার তথ্যাবলী পূরণ করে আমাদের সাথে যুক্ত হোন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>পুরো নাম</FormLabel>
                      <FormControl>
                        <Input placeholder="আপনার নাম লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ইমেইল ঠিকানা</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" type="email" {...field} />
                      </FormControl>
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
                      <FormLabel>ফোন নম্বর</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
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
                      <FormLabel>রক্তের গ্রুপ</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-2xl border border-primary/10">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-1">জেলা {loadingLocations.districts && <Loader2 className="h-3 w-3 animate-spin inline-block ml-1" />}</FormLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between bg-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? districts.find((d) => d.bn_name === field.value)?.bn_name
                                : "জেলা খুঁজুন"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <div className="flex items-center border-b px-3 bg-muted/20">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                              placeholder="জেলার নাম টাইপ করুন..."
                              value={districtSearch}
                              onChange={(e) => setDistrictSearch(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-1">
                            {filteredDistricts.length === 0 ? (
                              <div className="py-6 text-center text-sm">কোনো জেলা পাওয়া যায়নি।</div>
                            ) : (
                              filteredDistricts.map((d) => (
                                <div
                                  key={d.id}
                                  className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-primary hover:text-white",
                                    field.value === d.bn_name && "bg-primary/10 text-primary"
                                  )}
                                  onClick={() => {
                                    form.setValue("district", d.bn_name);
                                    setPopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === d.bn_name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {d.bn_name}
                                </div>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
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
                            <SelectValue placeholder="উপজেলা" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedUpazila}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="ইউনিয়ন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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

              <Button type="submit" className="w-full bg-primary h-14 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    প্রসেসিং হচ্ছে...
                  </>
                ) : (
                  <>
                    নিবন্ধন সম্পন্ন করুন <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center border-t bg-muted/30 py-6">
          <p className="text-sm text-muted-foreground text-center">
            ইতিমধ্যে একটি একাউন্ট আছে? <Link href="/login" className="text-primary font-bold">লগইন করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
