'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplet, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerDonor } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { getDistricts, getUpazillas, getUnionsApi, type LocationEntry } from '@/lib/bangladesh-api';
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

  const selectedDistrictName = form.watch('district');
  const selectedUpazilaName = form.watch('area');

  // Load Districts on mount
  useEffect(() => {
    async function loadDistricts() {
      setLoadingLocations(prev => ({ ...prev, districts: true }));
      try {
        const data = await getDistricts();
        setDistricts(data);
      } catch (e) {
        console.error("Failed to load districts", e);
      } finally {
        setLoadingLocations(prev => ({ ...prev, districts: false }));
      }
    }
    loadDistricts();
  }, []);

  // Load Upazillas when District changes
  useEffect(() => {
    async function loadUpazillas() {
      const districtObj = districts.find(d => d.bn_name === selectedDistrictName);
      if (districtObj) {
        setLoadingLocations(prev => ({ ...prev, upazilas: true }));
        try {
          const data = await getUpazillas(districtObj.id);
          setUpazilas(data);
        } catch (e) {
          console.error("Failed to load upazilas", e);
        } finally {
          setLoadingLocations(prev => ({ ...prev, upazilas: false }));
        }
      } else {
        setUpazilas([]);
      }
      form.setValue('area', '');
      form.setValue('union', '');
    }
    loadUpazillas();
  }, [selectedDistrictName, districts, form]);

  // Load Unions when Upazilla changes
  useEffect(() => {
    async function loadUnions() {
      const upazilaObj = upazilas.find(u => u.bn_name === selectedUpazilaName);
      if (upazilaObj) {
        setLoadingLocations(prev => ({ ...prev, unions: true }));
        try {
          const data = await getUnionsApi(upazilaObj.id);
          setUnions(data);
        } catch (e) {
          console.error("Failed to load unions", e);
        } finally {
          setLoadingLocations(prev => ({ ...prev, unions: false }));
        }
      } else {
        setUnions([]);
      }
      form.setValue('union', '');
    }
    loadUnions();
  }, [selectedUpazilaName, upazilas, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await registerDonor(values);
      if (result.success) {
        toast({
          title: "নিবন্ধন সফল!",
          description: "আপনি এখন আমাদের জীবন রক্ষাকারী সম্প্রদায়ের অংশ।",
        });
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
                        <Input placeholder="আকবর হোসেন" {...field} />
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
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        জেলা {loadingLocations.districts && <Loader2 className="h-3 w-3 animate-spin" />}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingLocations.districts ? "লোড হচ্ছে..." : "জেলা"} />
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDistrictName || loadingLocations.upazilas}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingLocations.upazilas ? "লোড হচ্ছে..." : "উপজেলা"} />
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedUpazilaName || loadingLocations.unions}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingLocations.unions ? "লোড হচ্ছে..." : "ইউনিয়ন"} />
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
