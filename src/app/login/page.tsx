'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, ArrowRight, Phone, Mail, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getDonors, logActivity } from '@/lib/sheets';
import { normalizePhone } from '@/lib/utils';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginStep, setStep] = useState(1); // 1: Identifier, 2: Password
  const [foundUser, setFoundUser] = useState<any>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const donors = await getDonors();
      const inputId = identifier.trim().toLowerCase();
      const inputPhone = normalizePhone(identifier);
      
      const user = donors.find((d: any) => {
        if (d.email?.toLowerCase() === inputId) return true;
        const dbPhone = normalizePhone(d.phone);
        return inputPhone && dbPhone && inputPhone === dbPhone;
      });

      if (user) {
        setFoundUser(user);
        if (user.password && user.password.trim() !== '') {
          setStep(2); // Has password, ask for it
        } else {
          // No password, direct login (Legacy/First time)
          completeLogin(user);
        }
      } else {
        toast({
          variant: "destructive",
          title: "ইউজার পাওয়া যায়নি",
          description: "এই ইমেইল বা ফোন নম্বরটি আমাদের সিস্টেমে নিবন্ধিত নেই।",
        });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundUser) return;

    if (password === foundUser.password) {
      completeLogin(foundUser);
    } else {
      toast({
        variant: "destructive",
        title: "ভুল পাসওয়ার্ড",
        description: "অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।",
      });
    }
  };

  const completeLogin = (user: any) => {
    localStorage.setItem('roktodao_user', JSON.stringify({
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      bloodType: user.bloodType
    }));
    
    logActivity(user.fullName, user.phone, 'Login', 'User successfully logged into dashboard');
    
    toast({
      title: "লগইন সফল!",
      description: `স্বাগতম, ${user.fullName}`,
    });
    
    window.dispatchEvent(new Event('storage'));
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <Droplet className="h-10 w-10 text-white fill-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline">প্রবেশ করুন</CardTitle>
          <CardDescription className="text-base">আপনার নিবন্ধিত অ্যাকাউন্ট দিয়ে ড্যাশবোর্ডে প্রবেশ করুন।</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          {loginStep === 1 ? (
            <form onSubmit={handleIdentifierSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="identifier" className="text-lg font-bold">ইমেইল বা ফোন নম্বর</Label>
                <div className="relative">
                  <Input 
                    id="identifier" 
                    placeholder="01XXXXXXXXX" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="h-14 rounded-2xl pl-12 text-lg border-2 focus:border-primary"
                    required 
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                    <Phone className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full h-14 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                  <>পরবর্তী ধাপ <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {foundUser.fullName.substring(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold">{foundUser.fullName}</p>
                  <p className="text-xs text-muted-foreground">{foundUser.phone}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="pass" className="text-lg font-bold flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" /> পাসওয়ার্ড দিন
                </Label>
                <Input 
                  id="pass" 
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl text-center text-2xl tracking-widest border-2 focus:border-primary"
                  autoFocus
                  required 
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full h-14 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "লগইন করুন"}
                </Button>
                <Button variant="ghost" type="button" onClick={() => setStep(1)} className="text-muted-foreground">
                  আবার চেষ্টা করুন
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 py-8 rounded-b-3xl mt-4">
          <p className="text-sm text-muted-foreground">
            আপনার কি অ্যাকাউন্ট নেই? <Link href="/register" className="text-primary font-black hover:underline">নতুন নিবন্ধন করুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}