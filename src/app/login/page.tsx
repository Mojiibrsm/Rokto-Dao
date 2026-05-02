'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, ArrowRight, Phone, Mail, KeyRound, AlertCircle, ShieldCheck, HelpCircle, User, MapPin, MessageSquare, Facebook, Globe, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getDonors, logActivity, setDonorPassword } from '@/lib/sheets';
import { normalizePhone } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISTRICTS } from '@/lib/bangladesh-data';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginStep, setStep] = useState(1); // 1: Identifier, 2: Password, 3: Reset Selection, 4: Security Questions, 5: New Pass
  const [foundUser, setFoundUser] = useState<any>(null);
  
  // Security Question States
  const [resetData, setResetData] = useState({
    fullName: '',
    bloodType: '',
    district: '',
    newPass: ''
  });

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
          setStep(2); 
        } else {
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

  const handleSecurityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    
    if (resetData.fullName.toLowerCase().trim() === foundUser.fullName.toLowerCase().trim()) correctCount++;
    if (resetData.bloodType === foundUser.bloodType) correctCount++;
    if (resetData.district === foundUser.district) correctCount++;

    if (correctCount >= 2) {
      setStep(5); // Go to set new password
    } else {
      toast({
        variant: "destructive",
        title: "তথ্য মেলেনি",
        description: "কমপক্ষে ২টি তথ্য সঠিক হতে হবে। আবার চেষ্টা করুন।"
      });
    }
  };

  const handleNewPassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await setDonorPassword(foundUser.email, foundUser.phone, resetData.newPass);
      if (res.success) {
        toast({ title: "সফল!", description: "পাসওয়ার্ড রিসেট হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।" });
        setStep(1);
        setIdentifier(foundUser.phone);
        setPassword('');
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (user: any) => {
    localStorage.setItem('roktodao_user', JSON.stringify({
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      bloodType: user.bloodType,
      role: user.role || 'user'
    }));
    
    if (user.role === 'admin') {
      localStorage.setItem('roktodao_admin_auth', 'true');
    }
    
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
          <CardTitle className="text-3xl font-black font-headline">
            {loginStep === 1 || loginStep === 2 ? "প্রবেশ করুন" : "পাসওয়ার্ড রিসেট"}
          </CardTitle>
          <CardDescription className="text-base">
            {loginStep < 3 ? "আপনার নিবন্ধিত অ্যাকাউন্ট দিয়ে ড্যাশবোর্ডে প্রবেশ করুন।" : "আপনার তথ্য যাচাই করে পাসওয়ার্ড পুনরুদ্ধার করুন।"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          {/* STEP 1: IDENTIFIER */}
          {loginStep === 1 && (
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
          )}

          {/* STEP 2: PASSWORD */}
          {loginStep === 2 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {foundUser?.fullName.substring(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold">{foundUser?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{foundUser?.phone}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="pass" className="text-lg font-bold flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-primary" /> পাসওয়ার্ড দিন
                  </Label>
                  <button type="button" onClick={() => setStep(3)} className="text-xs text-primary font-bold hover:underline">পাসওয়ার্ড ভুলে গেছেন?</button>
                </div>
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

          {/* STEP 3: RESET OPTIONS */}
          {loginStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <p className="text-center font-bold text-muted-foreground mb-4">পাসওয়ার্ড রিসেট করার উপায় বেছে নিন:</p>
              <Button onClick={() => setStep(4)} variant="outline" className="w-full h-16 rounded-2xl border-2 hover:bg-primary/5 text-lg font-bold gap-3">
                <HelpCircle className="h-6 w-6 text-primary" /> সিকিউরিটি প্রশ্নের মাধ্যমে
              </Button>
              <div className="p-6 rounded-3xl bg-muted/30 border-2 border-dashed space-y-4">
                <p className="text-sm font-bold text-center">অথবা অ্যাডমিনের সাথে যোগাযোগ করুন:</p>
                <div className="grid grid-cols-2 gap-3">
                   <Button variant="outline" className="rounded-xl h-12 bg-white border-green-200 text-green-600 font-bold gap-2" asChild>
                     <a href="https://wa.me/8801601519007" target="_blank" rel="noopener noreferrer"><MessageSquare className="h-4 w-4" /> WhatsApp</a>
                   </Button>
                   <Button variant="outline" className="rounded-xl h-12 bg-white border-blue-200 text-blue-600 font-bold gap-2" asChild>
                     <a href="https://www.facebook.com/MoJiiB.RsM" target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /> Facebook</a>
                   </Button>
                </div>
                <Button variant="ghost" className="w-full font-bold text-muted-foreground" asChild>
                  <a href="https://mojib.me/" target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4 mr-2" /> mojib.me</a>
                </Button>
              </div>
              <Button variant="ghost" onClick={() => setStep(2)} className="w-full">ফিরে যান</Button>
            </div>
          )}

          {/* STEP 4: SECURITY QUESTIONS */}
          {loginStep === 4 && (
            <form onSubmit={handleSecurityCheck} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-xs font-bold text-primary flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> নিচের ৩টি তথ্যের মধ্যে যেকোনো ২টি সঠিক হলে আপনি পাসওয়ার্ড রিসেট করতে পারবেন।
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><User className="h-4 w-4" /> আপনার পুরো নাম</Label>
                <Input placeholder="নিবন্ধনকৃত নাম" value={resetData.fullName} onChange={e => setResetData({...resetData, fullName: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Droplet className="h-4 w-4" /> রক্তের গ্রুপ</Label>
                <Select value={resetData.bloodType} onValueChange={v => setResetData({...resetData, bloodType: v})}>
                  <SelectTrigger><SelectValue placeholder="গ্রুপ নির্বাচন করুন" /></SelectTrigger>
                  <SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> আপনার জেলা</Label>
                <Select value={resetData.district} onValueChange={v => setResetData({...resetData, district: v})}>
                  <SelectTrigger><SelectValue placeholder="জেলা নির্বাচন করুন" /></SelectTrigger>
                  <SelectContent>{DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl">তথ্য যাচাই করুন</Button>
              <Button variant="ghost" onClick={() => setStep(3)} className="w-full">বিকল্প পদ্ধতি</Button>
            </form>
          )}

          {/* STEP 5: NEW PASSWORD */}
          {loginStep === 5 && (
            <form onSubmit={handleNewPassSubmit} className="space-y-6 animate-in zoom-in-95 duration-300">
               <div className="text-center py-4">
                  <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold">তথ্য সঠিক হয়েছে!</h3>
                  <p className="text-sm text-muted-foreground">এখন আপনার নতুন পাসওয়ার্ড সেট করুন।</p>
               </div>

               <div className="space-y-3">
                 <Label className="font-bold">নতুন পাসওয়ার্ড</Label>
                 <Input 
                   type="password" 
                   placeholder="কমপক্ষে ৬ সংখ্যা..." 
                   className="h-14 rounded-xl border-2 focus:border-primary text-center text-lg"
                   value={resetData.newPass}
                   onChange={e => setResetData({...resetData, newPass: e.target.value})}
                   required
                   autoFocus
                 />
               </div>
               
               <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl" disabled={loading}>
                 {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "পাসওয়ার্ড সেভ করুন"}
               </Button>
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
