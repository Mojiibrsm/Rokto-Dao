'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDonationHistory, type Appointment, getDonors, updateDonorProfile } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Calendar, History, MapPin, Loader2, User, LogOut, Settings, Save, ExternalLink, MessageSquare, HeartPulse, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISTRICTS, BANGLADESH_DATA } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';
import { normalizePhone } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [donorDetails, setDonorDetails] = useState<any>(null);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [upazilas, setUpazilas] = useState<string[]>([]);
  const [unions, setUnions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: '',
    area: '',
    union: '',
    organization: '',
    totalDonations: 0,
    lastDonationDate: ''
  });

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
        const appData = await getDonationHistory(user.email);
        setHistory(appData);

        const allDonors = await getDonors();
        const userNormalizedPhone = normalizePhone(user.phone);
        
        const currentDonor = allDonors.find(d => {
          if (user.email && d.email?.toLowerCase() === user.email.toLowerCase()) return true;
          const dbNormalizedPhone = normalizePhone(d.phone);
          return userNormalizedPhone && dbNormalizedPhone && userNormalizedPhone === dbNormalizedPhone;
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
            lastDonationDate: currentDonor.lastDonationDate === 'N/A' ? '' : currentDonor.lastDonationDate || ''
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  useEffect(() => {
    if (formData.district && BANGLADESH_DATA[formData.district]) {
      setUpazilas(Object.keys(BANGLADESH_DATA[formData.district]));
    } else {
      setUpazilas([]);
    }
  }, [formData.district]);

  useEffect(() => {
    if (formData.district && formData.area && BANGLADESH_DATA[formData.district]?.[formData.area]) {
      setUnions(BANGLADESH_DATA[formData.district][formData.area]);
    } else {
      setUnions([]);
    }
  }, [formData.district, formData.area]);

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
        toast({ title: "সফল!", description: "আপনার প্রোফাইল আপডেট করা হয়েছে।" });
        const updatedUser = { ...user, fullName: formData.fullName, email: formData.email, phone: formData.phone };
        localStorage.setItem('roktodao_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setDonorDetails(prev => ({ ...prev, ...formData, totalDonations: Number(formData.totalDonations) }));
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ব্যর্থ!", description: "তথ্য আপডেট করা যায়নি।" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('roktodao_user');
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

  const initials = user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'RD';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
            <div className="bg-primary/5 p-6 flex flex-col items-center text-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold font-headline">{user?.fullName || 'লোড হচ্ছে...'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full text-red-500 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" /> লগআউট
              </Button>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3 text-center border-primary/20 bg-primary/5">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">রক্তের গ্রুপ</div>
                  <div className="text-2xl font-black text-primary">{user?.bloodType || donorDetails?.bloodType || 'N/A'}</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">মোট রক্তদান</div>
                  <div className="text-2xl font-black">{donorDetails?.totalDonations || 0}</div>
                </Card>
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50" asChild>
                  <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4" /> লাইভ চ্যাট (রক্তের গ্রুপ বদলাতে)
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-12">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> প্রোফাইল সেটিংস
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" /> রক্তদানের ইতিহাস
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="mt-6">
              <Card className="shadow-md rounded-2xl overflow-hidden border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="text-xl">তথ্য আপডেট করুন</CardTitle>
                  <CardDescription>আপনার ব্যক্তিগত তথ্য এখান থেকে পরিবর্তন করতে পারেন।</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>পুরো নাম</Label>
                        <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>ফোন নম্বর</Label>
                        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border">
                      <div className="space-y-2">
                        <Label>জেলা</Label>
                        <Select value={formData.district} onValueChange={val => setFormData({...formData, district: val, area: '', union: ''})}>
                          <SelectTrigger className="bg-white"><SelectValue placeholder="জেলা" /></SelectTrigger>
                          <SelectContent>{DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>উপজেলা</Label>
                        <Select value={formData.area} onValueChange={val => setFormData({...formData, area: val, union: ''})} disabled={!formData.district}>
                          <SelectTrigger className="bg-white"><SelectValue placeholder="উপজেলা" /></SelectTrigger>
                          <SelectContent>{upazilas.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ইউনিয়ন</Label>
                        <Select value={formData.union} onValueChange={val => setFormData({...formData, union: val})} disabled={!formData.area}>
                          <SelectTrigger className="bg-white"><SelectValue placeholder="ইউনিয়ন" /></SelectTrigger>
                          <SelectContent>{unions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label>সংগঠন/টিম</Label>
                        <Input value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-primary" /> মোট দান</Label>
                        <Input type="number" value={formData.totalDonations} onChange={e => setFormData({...formData, totalDonations: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> শেষ দান</Label>
                        <Input type="date" value={formData.lastDonationDate} onChange={e => setFormData({...formData, lastDonationDate: e.target.value})} />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary h-12 text-lg font-bold" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                      তথ্য সেভ করুন
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"><HeartPulse className="h-6 w-6 text-primary" /></div>
                    <div>
                      <h4 className="font-bold text-lg">মোট রক্তদান: {donorDetails?.totalDonations || 0} বার</h4>
                      <p className="text-sm text-muted-foreground">শেষ রক্তদান: {donorDetails?.lastDonationDate || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
