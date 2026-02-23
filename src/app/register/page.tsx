
'use client';

import { useState } from 'react';
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

const formSchema = z.object({
  fullName: z.string().min(2, 'নাম খুবই ছোট'),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  phone: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  bloodType: z.string().min(1, 'রক্তের গ্রুপ নির্বাচন করুন'),
});

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      bloodType: '',
    },
  });

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
      <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Droplet className="h-6 w-6 text-primary fill-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">দাতা হিসেবে নিবন্ধন করুন</CardTitle>
          <CardDescription>আপনার তথ্যাবলী পূরণ করে আমাদের সাথে যুক্ত হোন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Button type="submit" className="w-full bg-primary h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    প্রসেসিং হচ্ছে...
                  </>
                ) : (
                  <>
                    নিবন্ধন সম্পন্ন করুন <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center border-t bg-muted/30 py-4">
          <p className="text-xs text-muted-foreground text-center">
            ইতিমধ্যে একটি একাউন্ট আছে? <Link href="/login" className="text-primary font-bold">লগইন করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
