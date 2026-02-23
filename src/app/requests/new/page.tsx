'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplet, ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { createBloodRequest } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { DISTRICTS, BANGLADESH_DATA, getUnions } from '@/lib/bangladesh-data';
import Link from 'next/link';

const formSchema = z.object({
  patientName: z.string().min(2, 'রোগীর নাম দিন'),
  bloodType: z.string().min(1, 'রক্তের গ্রুপ নির্বাচন করুন'),
  hospitalName: z.string().min(2, 'হাসপাতালের নাম দিন'),
  district: z.string().min(1, 'জেলা নির্বাচন করুন'),
  area: z.string().min(1, 'উপজেলা নির্বাচন করুন'),
  union: z.string().min(1, 'ইউনিয়ন নির্বাচন করুন'),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  neededWhen: z.string().min(2, 'কখন প্রয়োজন তা লিখুন'),
  bagsNeeded: z.string().min(1, 'ব্যাগ সংখ্যা দিন'),
  isUrgent: z.boolean().default(false),
});

export default function NewRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const upazilas = selectedDistrict ? BANGLADESH_DATA[selectedDistrict]?.upazilas || [] : [];
  const unions = selectedUpazila ? getUnions(selectedUpazila) : [];

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
                      <FormLabel>রোগীর নাম/অবস্থা</FormLabel>
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
                      <FormLabel>প্রয়োজনীয় রক্তের গ্রুপ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormItem>
                    <FormLabel>হাসপাতালের নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="হাসপাতালের পুরো নাম" {...field} />
                    </FormControl>
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
                      <FormLabel>জেলা</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue('area', '');
                        form.setValue('union', '');
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="জেলা" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISTRICTS.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
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
                      <FormLabel>উপজেলা</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue('union', '');
                      }} defaultValue={field.value} disabled={!selectedDistrict}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="উপজেলা" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {upazilas.map(u => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
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
                      <FormLabel>ইউনিয়ন</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedUpazila}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="ইউনিয়ন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unions.map(u => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
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
                      <FormLabel>যোগাযোগের নম্বর</FormLabel>
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
                      <FormLabel>ব্যাগ সংখ্যা</FormLabel>
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
                    <FormLabel>কখন প্রয়োজন?</FormLabel>
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
                    অনুরোধ জমা দিন <ArrowLeft className="ml-2 h-6 w-6 rotate-180" />
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
