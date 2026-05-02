'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDonors, getBloodRequests, updateDonorProfile, setDonorPassword, logActivity, sendMessage } from '@/lib/sheets';
import { findMatchingRequests } from '@/lib/blood-matching';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Calendar, History, MapPin, Loader2, User, LogOut, Settings, Save, ShieldCheck, HeartPulse, Clock, KeyRound, Eye, EyeOff, ShieldAlert, AlertCircle, Shield, Camera, Link as LinkIcon, Navigation, CheckCircle2, Sparkles, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISTRICTS } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';
import { normalizePhone } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [donorDetails, setDonorDetails] = useState<any>(null);
  const [matchingRequests, setMatchingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showPass, setShowPass] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: '',
    area: '',
    union: '',
    organization: '',
    totalDonations: 0,
    lastDonationDate: '',
    imageUrl: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined
  });

  const [passwordData, setPasswordData] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        const [allDonors, allRequests] = await Promise.all([getDonors(), getBloodRequests()]);
        const userPhone = normalizePhone(user.phone);
        
        const currentDonor = allDonors.find(d => {
          if (user.email && d.email?.toLowerCase() === user.email.toLowerCase()) return true;
          return userPhone === normalizePhone(d.phone);
        });

        if (currentDonor) {
          setDonorDetails(currentDonor);
          setFormData({
            fullName: currentDonor.fullName,
            phone: currentDonor.phone,
            email: currentDonor.email,
            district: currentDonor.district || '',
            area: currentDonor.area || '',
            union: currentDonor.union || '',
            organization: currentDonor.organization || '',
            totalDonations: currentDonor.totalDonations || 0,
            lastDonationDate: currentDonor.lastDonationDate === 'N/A' ? '' : currentDonor.lastDonationDate || '',
            imageUrl: currentDonor.imageUrl || '',
            lat: currentDonor.lat,
            lng: currentDonor.lng
          });
          setPasswordData(currentDonor.password || '');

          // Find matches for this donor
          const matches = findMatchingRequests(currentDonor, allRequests);
          setMatchingRequests(matches);
        }
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const originalKey = user.email || user.phone;
      const result = await updateDonorProfile(originalKey, {
        ...formData,
        totalDonations: Number(formData.totalDonations)
      });
      
      if (result.success) {
        await logActivity(formData.fullName, formData.phone, 'Edit Profile', `User updated profile information and image`);
        toast({ title: "সফল!", description: "প্রোফাইল আপডেট করা হয়েছে।" });
        const updatedUser = { ...user, fullName: formData.fullName, email: formData.email, phone: formData.phone };
        localStorage.setItem('roktodao_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ব্যর্থ!", description: "তথ্য আপডেট করা যায়নি।" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetPassword = async () => {
    setIsUpdatingPass(true);
    try {
      const res = await setDonorPassword(user.email, user.phone, passwordData);
      if (res.success) {
        const action = passwordData ? 'Set Password' : 'Removed Password';
        await logActivity(user.fullName, user.phone, action, `User ${passwordData ? 'enabled' : 'disabled'} password protection`);
        toast({ title: "সফল!", description: passwordData ? "পাসওয়ার্ড সেট করা হয়েছে।" : "পাসওয়ার্ড নিরাপত্তা বন্ধ করা হয়েছে।" });
        setDonorDetails({...donorDetails, password: passwordData});
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ!", description: "পাসওয়ার্ড আপডেট করা যায়নি।" });
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleStartChat = async (phone: string, text: string) => {
    try {
      const res = await sendMessage(user.phone, phone, text);
      if (res.success) {
        router.push(`/messages/${res.convoId}`);
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    }
  };

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
          setDetectingLocation(false);
          toast({ title: "লোকেশন শনাক্ত হয়েছে!", description: "এখন 'তথ্য সেভ করুন' বাটনে ক্লিক করে সেভ করুন।" });
        },
        (error) => {
          setDetectingLocation(false);
          toast({ variant: "destructive", title: "ব্যর্থ হয়েছে", description: "অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন।" });
        }
      );
    } else {
      setDetectingLocation(false);
      toast({ variant: "destructive", title: "সাপোর্ট নেই", description: "আপনার ব্রাউজারে জিপিএস সাপোর্ট নেই।" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('roktodao_user');
    localStorage.removeItem('roktodao_admin_auth');
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="border-t-8 border-t-primary shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="bg-primary/5 p-10 flex flex-col items-center text-center gap-6">
              <div className="h-28 w-24 rounded-3xl bg-primary flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary/20 rotate-3 overflow-hidden relative">
                {formData.imageUrl ? (
                  <Image src={formData.imageUrl} fill alt="Profile" className="object-cover -rotate-3 scale-110" />
                ) : (
                  user?.fullName?.substring(0, 1) || 'R'
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black font-headline">{user?.fullName}</h2>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-muted-foreground font-bold">{user?.phone}</p>
                  {donorDetails?.role === 'admin' && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 font-black uppercase text-[10px] tracking-widest px-3">
                      <Shield className="h-3 w-3 mr-1" /> Admin Account
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="w-full space-y-3">
                {donorDetails?.role === 'admin' && (
                  <Button variant="outline" className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-2xl font-bold border-none" asChild>
                    <Link href="/admin"><ShieldCheck className="h-5 w-5 mr-2" /> অ্যাডমিন প্যানেল</Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full text-red-600 border-red-200 hover:bg-red-50 h-12 rounded-2xl font-bold">
                  <LogOut className="h-5 w-5 mr-2" /> লগআউট করুন
                </Button>
              </div>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-primary/5 border-2 border-primary/10 text-center">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">গ্রুপ</p>
                  <p className="text-3xl font-black text-primary">{user?.bloodType}</p>
                </div>
                <div className="p-4 rounded-3xl bg-muted/30 border-2 border-transparent text-center">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">রক্তদান</p>
                  <p className="text-3xl font-black">{donorDetails?.totalDonations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Matches For Donor */}
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-950 text-white overflow-hidden">
            <CardHeader className="bg-primary pb-6">
               <CardTitle className="text-xl font-black flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-white" /> Matches For You
               </CardTitle>
               <CardDescription className="text-white/70 font-bold">
                 Urgent requests near your location.
               </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {matchingRequests.length === 0 ? (
                <div className="text-center py-6 opacity-40 italic text-sm">
                  No compatible requests nearby right now.
                </div>
              ) : (
                matchingRequests.map((req, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Blood Needed</p>
                        <h4 className="font-black text-lg">{req.bloodType}</h4>
                      </div>
                      <Badge className="bg-primary text-[10px] uppercase">{req.distance} KM Away</Badge>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {req.hospitalName}, {req.district}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-white text-slate-900 hover:bg-slate-100 font-black h-8 text-[10px]"
                        onClick={() => handleStartChat(req.phone, `আসসালামু আলাইকুম, আমি আপনার "${req.bloodType}" রক্তের অনুরোধের প্রেক্ষিতে যোগাযোগ করছি।`)}
                      >
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 rounded-lg border-white/20" asChild>
                        <a href={`tel:${req.phone}`}><Phone className="h-3 w-3" /></a>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-16 rounded-2xl p-1 mb-8">
              <TabsTrigger value="settings" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary h-full">
                <Settings className="h-5 w-5 mr-2" /> প্রোফাইল আপডেট
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-primary h-full">
                <KeyRound className="h-5 w-5 mr-2" /> পাসওয়ার্ড ও নিরাপত্তা
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="animate-in fade-in-50 duration-500">
              <Card className="shadow-xl rounded-[2.5rem] border-none overflow-hidden">
                <CardHeader className="bg-primary/5 pb-8 pt-10 px-10">
                  <CardTitle className="text-2xl font-black">তথ্য আপডেট করুন</CardTitle>
                  <CardDescription>আপনার ব্যক্তিগত তথ্য এখান থেকে পরিবর্তন করতে পারেন।</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-8">
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    {/* Location Detection Block */}
                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border-2 border-dashed border-primary/20 space-y-6">
                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Navigation className="h-7 w-7 text-primary" />
                            <h4 className="font-black text-xl">আমার সঠিক অবস্থান</h4>
                          </div>
                          <Button 
                            type="button" 
                            onClick={handleDetectLocation} 
                            disabled={detectingLocation}
                            className="bg-primary hover:bg-primary/90 text-white rounded-full font-black px-6 shadow-lg shadow-primary/10"
                          >
                            {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
                            Detect Location
                          </Button>
                       </div>
                       <div className="flex flex-col md:flex-row gap-4 items-center">
                          <div className={`p-4 rounded-2xl border-2 flex-1 w-full text-center ${formData.lat ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                             <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">অক্ষাংশ (Latitude)</p>
                             <p className="font-mono font-bold">{formData.lat || 'সংগ্রহ করা হয়নি'}</p>
                          </div>
                          <div className={`p-4 rounded-2xl border-2 flex-1 w-full text-center ${formData.lng ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                             <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">দ্রাঘিমাংশ (Longitude)</p>
                             <p className="font-mono font-bold">{formData.lng || 'সংগ্রহ করা হয়নি'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-8 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-primary/20 space-y-6">
                       <div className="flex items-center gap-4 mb-2">
                          <Camera className="h-6 w-6 text-primary" />
                          <h4 className="font-black text-lg">প্রোফাইল ছবি</h4>
                       </div>
                       <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="h-32 w-32 rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden relative shrink-0">
                             {formData.imageUrl ? <Image src={formData.imageUrl} fill alt="Preview" className="object-cover" /> : <div className="h-full w-full flex items-center justify-center text-muted-foreground"><User className="h-10 w-10" /></div>}
                          </div>
                          <div className="flex-1 w-full space-y-3">
                             <Label className="font-bold flex items-center gap-2"><LinkIcon className="h-4 w-4" /> ছবির লিঙ্ক (Image URL)</Label>
                             <Input 
                                value={formData.imageUrl} 
                                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                                placeholder="https://example.com/your-photo.jpg" 
                                className="h-12 rounded-xl border-2 focus:border-primary"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-lg font-bold">পুরো নাম</Label>
                        <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-14 rounded-2xl bg-muted/20 border-none text-lg" />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-lg font-bold">ফোন নম্বর</Label>
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-14 rounded-2xl bg-muted/20 border-none text-lg" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 p-8 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-muted">
                      <div className="space-y-3">
                        <Label className="font-bold">জেলা</Label>
                        <Select value={formData.district} onValueChange={val => setFormData({...formData, district: val, area: '', union: ''})}>
                          <SelectTrigger className="bg-white h-12 rounded-xl"><SelectValue placeholder="জেলা" /></SelectTrigger>
                          <SelectContent>{DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold">সংগঠন/টিম</Label>
                        <Input value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="h-12 rounded-xl bg-white border-none" />
                      </div>
                      <div className="space-y-3">
                        <Label className="font-bold flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary" /> মোট দান</Label>
                        <Input type="number" value={formData.totalDonations} onChange={e => setFormData({...formData, totalDonations: parseInt(e.target.value) || 0})} className="h-12 rounded-xl bg-white border-none" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary h-16 text-2xl font-black rounded-2xl shadow-xl shadow-primary/20" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Save className="h-6 w-6 mr-2" />}
                      তথ্য সেভ করুন
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="animate-in fade-in-50 duration-500">
              <Card className="shadow-xl rounded-[2.5rem] border-none overflow-hidden">
                <CardHeader className="bg-slate-900 text-white pb-10 pt-12 px-10 relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-5 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur">
                      <ShieldAlert className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl">অ্যাকাউন্ট নিরাপত্তা</CardTitle>
                      <CardDescription className="text-slate-400 text-lg">আপনার অ্যাকাউন্টে পাসওয়ার্ড সেট করে সুরক্ষিত রাখুন।</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="space-y-8 max-w-md mx-auto">
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4 mb-4">
                      <AlertCircle className="h-6 w-6 text-primary shrink-0" />
                      <p className="text-sm text-muted-foreground font-bold">
                        পাসওয়ার্ড সেট করলে লগইন করার সময় ফোন নম্বরের পাশাপাশি এই পাসওয়ার্ডটিও প্রয়োজন হবে।
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg font-bold flex items-center gap-2">
                        {donorDetails?.password ? "পাসওয়ার্ড পরিবর্তন করুন" : "নতুন পাসওয়ার্ড সেট করুন"}
                      </Label>
                      <div className="relative">
                        <Input 
                          type={showPass ? "text" : "password"}
                          value={passwordData}
                          onChange={e => setPasswordData(e.target.value)}
                          placeholder="আপনার গোপন পাসওয়ার্ড..."
                          className="h-16 rounded-2xl border-2 focus:border-primary px-6 text-xl tracking-widest"
                        />
                        <button 
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPass ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Button 
                        onClick={handleSetPassword} 
                        disabled={isUpdatingPass} 
                        className="h-16 rounded-2xl text-xl font-black bg-primary shadow-lg shadow-primary/20"
                      >
                        {isUpdatingPass ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <ShieldCheck className="h-6 w-6 mr-2" />}
                        {passwordData ? "পাসওয়ার্ড সেভ করুন" : "পাসওয়ার্ড মুছে ফেলুন"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
