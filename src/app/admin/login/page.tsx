'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2, KeyRound } from 'lucide-react';
import { getAdminPassword } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const serverPass = await getAdminPassword();
      if (password === serverPass) {
        localStorage.setItem('roktodao_admin_auth', 'true');
        toast({ title: "সফল!", description: "অ্যাডমিন প্যানেলে স্বাগতম।" });
        router.push('/admin');
      } else {
        toast({ 
          variant: "destructive", 
          title: "ভুল পাসওয়ার্ড", 
          description: "অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।" 
        });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 rotate-3">
            <ShieldCheck className="h-10 w-10 text-white -rotate-3" />
          </div>
          <CardTitle className="text-3xl font-black font-headline">অ্যাডমিন এক্সেস</CardTitle>
          <CardDescription className="text-base">প্যানেলে প্রবেশের জন্য সিকিউরিটি পাসওয়ার্ড দিন।</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="pass" className="text-lg font-bold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" /> পাসওয়ার্ড
              </Label>
              <Input 
                id="pass" 
                type="password" 
                placeholder="••••••••" 
                className="h-14 rounded-2xl border-2 focus:border-primary text-xl tracking-widest text-center"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full h-14 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all active:scale-95" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "প্রবেশ করুন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
