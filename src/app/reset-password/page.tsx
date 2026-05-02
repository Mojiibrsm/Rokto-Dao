'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { setDonorPassword } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';

export default function FinalResetPage() {
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleNewPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "দুর্বল পাসওয়ার্ড", description: "কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড দিন।" });
      return;
    }
    setLoading(true);
    try {
      const res = await setDonorPassword(user.email, user.phone, newPassword);
      if (res.success) {
        toast({ title: "সফল!", description: "পাসওয়ার্ড রিসেট হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।" });
        sessionStorage.removeItem('roktodao_reset_user');
        router.push('/login');
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-black font-headline">নতুন পাসওয়ার্ড</CardTitle>
          <CardDescription className="text-base font-bold">ভেরিফিকেশন সফল হয়েছে! আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন।</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          <form onSubmit={handleNewPassSubmit} className="space-y-6 animate-in zoom-in-95 duration-300">
             <div className="space-y-3">
               <Label className="font-bold flex items-center gap-2"><KeyRound className="h-4 w-4 text-primary" /> পাসওয়ার্ড</Label>
               <Input 
                 type="password" 
                 placeholder="কমপক্ষে ৬ সংখ্যা..." 
                 className="h-14 rounded-xl border-2 focus:border-primary text-center text-lg"
                 value={newPassword}
                 onChange={e => setNewPassword(e.target.value)}
                 required
                 autoFocus
               />
             </div>
             
             <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl" disabled={loading}>
               {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "পাসওয়ার্ড সেভ করুন"}
             </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}