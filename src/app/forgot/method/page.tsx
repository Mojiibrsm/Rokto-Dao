'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Send, HelpCircle, MessageSquare, Facebook, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetMethodPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem('roktodao_reset_user');
    if (!data) {
      router.push('/forgot');
      return;
    }
    setUser(JSON.parse(data));
  }, [router]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 border-2 border-primary/20">
            <Droplet className="h-8 w-8 text-primary fill-primary" />
          </div>
          <CardTitle className="text-2xl font-black font-headline">রিসেট পদ্ধতি</CardTitle>
          <CardDescription className="text-base font-bold">
            স্বাগতম, {user.fullName}! <br />পাসওয়ার্ড রিসেট করার উপায় বেছে নিন:
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8 space-y-4">
          <Button onClick={() => router.push('/reset-otp')} variant="outline" className="w-full h-16 rounded-2xl border-2 border-primary/20 hover:bg-primary/5 text-lg font-bold gap-3">
            <Send className="h-6 w-6 text-primary" /> OTP এর মাধ্যমে (SMS)
          </Button>

          <Button onClick={() => router.push('/reset-question')} variant="outline" className="w-full h-16 rounded-2xl border-2 hover:bg-primary/5 text-lg font-bold gap-3">
            <HelpCircle className="h-6 w-6 text-primary" /> সিকিউরিটি প্রশ্নাবলি
          </Button>

          <div className="p-6 rounded-3xl bg-muted/30 border-2 border-dashed space-y-4 mt-4">
            <p className="text-sm font-bold text-center">অথবা অ্যাডমিনের সাথে যোগাযোগ করুন:</p>
            <div className="grid grid-cols-2 gap-3">
               <Button variant="outline" className="rounded-xl h-12 bg-white border-green-200 text-green-600 font-bold gap-2" asChild>
                 <a href="https://wa.me/8801601519007" target="_blank" rel="noopener noreferrer"><MessageSquare className="h-4 w-4" /> WhatsApp</a>
               </Button>
               <Button variant="outline" className="rounded-xl h-12 bg-white border-blue-200 text-blue-600 font-bold gap-2" asChild>
                 <a href="https://www.facebook.com/MoJiiB.RsM" target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /> Facebook</a>
               </Button>
            </div>
            <Button variant="link" className="w-full text-xs text-muted-foreground" asChild>
              <a href="https://mojib.me/" target="_blank" rel="noopener noreferrer"><Globe className="h-3 w-3 mr-1" /> Visit Admin Website</a>
            </Button>
          </div>
          
          <Button variant="ghost" onClick={() => router.push('/forgot')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}