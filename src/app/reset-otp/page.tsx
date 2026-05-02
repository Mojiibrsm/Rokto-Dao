'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { sendPasswordResetOtp } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';

export default function ResetOtpPage() {
  const [user, setUser] = useState<any>(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const data = sessionStorage.getItem('roktodao_reset_user');
    if (!data) {
      router.push('/forgot');
      return;
    }
    setUser(JSON.parse(data));
  }, [router]);

  const handleSendOtp = async () => {
    if (!user) return;
    setLoading(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    
    try {
      const res = await sendPasswordResetOtp(user.phone, otp);
      if (res && res.status === 'success') {
        toast({ title: "OTP পাঠানো হয়েছে!", description: "আপনার ফোনে আসা ৬ সংখ্যার কোডটি এখানে দিন।" });
        setOtpSent(true);
      } else {
        toast({ variant: "destructive", title: "OTP পাঠানো যায়নি", description: "SMS সার্ভারে সমস্যা হচ্ছে। বিকল্প পদ্ধতি চেষ্টা করুন।" });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "SMS পাঠাতে সমস্যা হয়েছে।" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (userOtpInput === generatedOtp) {
      router.push('/reset-password');
      toast({ title: "যাচাই সফল!", description: "এখন আপনার নতুন পাসওয়ার্ড সেট করুন।" });
    } else {
      toast({ variant: "destructive", title: "ভুল কোড", description: "সঠিক OTP কোড দিন।" });
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <CardTitle className="text-2xl font-black font-headline">OTP যাচাইকরণ</CardTitle>
          <CardDescription className="text-base font-bold">আপনার নিবন্ধিত নম্বরে একটি সুরক্ষা কোড পাঠানো হবে।</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          {!otpSent ? (
            <div className="space-y-6 text-center">
               <div className="p-6 rounded-2xl bg-muted/50 border space-y-2">
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">নিবন্ধিত নম্বর</p>
                  <p className="text-2xl font-black text-primary tracking-widest">
                    {user.phone.replace(/.(?=.{4})/g, '*')}
                  </p>
               </div>
               <Button onClick={handleSendOtp} disabled={loading} className="w-full h-14 bg-primary text-xl font-bold rounded-2xl gap-3">
                 {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                 কোড পাঠান
               </Button>
               <Button variant="ghost" onClick={() => router.push('/forgot/method')} className="w-full">
                 <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
               </Button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in zoom-in-95 duration-300">
               <div className="space-y-3">
                 <Label className="font-bold text-center block">৬ সংখ্যার কোড লিখুন</Label>
                 <Input 
                   placeholder="XXXXXX" 
                   className="h-16 rounded-xl border-2 focus:border-primary text-center text-3xl font-black tracking-[0.5em]"
                   value={userOtpInput}
                   onChange={e => setUserOtpInput(e.target.value.replace(/\D/g, '').substring(0, 6))}
                   required
                   autoFocus
                 />
               </div>
               
               <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl">কোড যাচাই করুন</Button>
                  <Button variant="ghost" type="button" onClick={() => setOtpSent(false)} className="text-muted-foreground">আবার চেষ্টা করুন</Button>
               </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}