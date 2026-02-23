'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getDonors } from '@/lib/sheets';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In this MVP, we verify by checking if the email exists in our donor sheet
      const donors = await getDonors();
      const user = donors.find((d: any) => d.email?.toLowerCase() === email.toLowerCase());

      if (user) {
        localStorage.setItem('roktodao_user', JSON.stringify({
          email: user.email,
          fullName: user.fullname,
          bloodType: user.bloodtype
        }));
        
        toast({
          title: "লগইন সফল!",
          description: `স্বাগতম, ${user.fullname}`,
        });
        
        window.dispatchEvent(new Event('storage'));
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "লগইন ব্যর্থ",
          description: "এই ইমেইলটি আমাদের সিস্টেমে পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইমেইল দিন বা নতুন একাউন্ট তৈরি করুন।",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8 text-primary fill-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">লগইন করুন</CardTitle>
          <CardDescription>আপনার নিবন্ধিত ইমেইল ঠিকানা দিয়ে প্রবেশ করুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল ঠিকানা</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>প্রবেশ করুন <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 py-6 rounded-b-3xl">
          <p className="text-sm text-muted-foreground">
            আপনার একাউন্ট নেই? <Link href="/register" className="text-primary font-bold">নতুন একাউন্ট খুলুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
