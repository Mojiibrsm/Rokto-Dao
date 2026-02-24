'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplet, ArrowLeft, Loader2, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerDonor } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { getDistricts, getUpazillas, getUnionsApi, type LocationEntry } from '@/lib/bangladesh-api';
import Link from 'next/link';

const formSchema = z.object({
  fullName: z.string().min(2, 'নাম খুবই ছোট'),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন').optional().or(z.literal('')),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  bloodType: z.string().min(1, 'রক্তের গ্রুপ নির্বাচন করুন'),
  district: z.string().min(1, 'জেলা নির্বাচন করুন'),
  area: z.string().optional(),
  union: z.string().optional(),
});

export default function AdminAddDonorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState<LocationEntry[]>([]);
  const [upazilas, setUpazilas] = useState<LocationEntry[]>([]);
  const [loadingLocations, setLoadingLocations] = useState({ districts: false, upazilas: false });
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
    }
    loadUpazillas();
  }, [selectedDistrict, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await registerDonor({
        ...values,
        email: values.email || `no-email-${Date.now()}@roktodao.com`, // Fallback for sheets row structure
      } as any);
      
      if (result.success) {
        toast({
          title: "সফলভাবে যোগ হয়েছে!",
          description: "নতুন রক্তদাতা সিস্টেমে নিবন্ধিত হয়েছে।",
        });
        form.reset(); // Reset form for next entry
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> অ্যাডমিন ড্যাশবোর্ড</Link>
        </Button>
      </div>

      <Card className="w-full max-w-2xl shadow-xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-headline">নতুন দাতা যোগ করুন</CardTitle>
              <CardDescription>অ্যাডমিন হিসেবে সরাসরি রক্তদাতার তথ্য ইনপুট দিন।</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>পুরো নাম *</FormLabel>
                      <FormControl>
                        <Input placeholder="দাতার নাম লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>মোবাইল নম্বর *</FormLabel>
                      <FormControl>
                        <Input placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>রক্তের গ্রুপ *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="সিলেক্ট করুন" />
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ইমেইল (ঐচ্ছিক)</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/30 rounded-2xl border">
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
              </div>

              <Button type="submit" className="w-full bg-primary h-14 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    প্রসেসিং হচ্ছে...
                  </>
                ) : (
                  <>
                    রক্তদাতা যোগ করুন <Plus className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-green-50/50 py-4 px-8 border-t">
          <p className="text-sm text-green-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> ফর্ম সাবমিট করার পর এটি অটো রিসেট হবে, ফলে আপনি আনলিমিটেড দাতা যোগ করতে পারবেন।
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
