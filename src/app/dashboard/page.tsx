'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDonationHistory, type Appointment, getDonors, updateDonorProfile } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Calendar, History, MapPin, Loader2, User, LogOut, Settings, Save, ExternalLink, MessageSquare } from 'lucide-react';
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
    organization: ''
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
        
        // Robust matching logic for Dashboard load with numeral support
        const userNormalizedPhone = normalizePhone(user.phone);
        
        const currentDonor = allDonors.find(d => {
          if (user.email && d.email?.toLowerCase() === user.email.toLowerCase()) return true;
          
          const dbNormalizedPhone = normalizePhone(d.phone);
          if (userNormalizedPhone && dbNormalizedPhone && userNormalizedPhone === dbNormalizedPhone) return true;
          
          return false;
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
            organization: currentDonor.organization || ''
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

  // Update Upazilas when district changes
  useEffect(() => {
    if (formData.district && BANGLADESH_DATA[formData.district]) {
      setUpazilas(Object.keys(BANGLADESH_DATA[formData.district]));
    } else {
      setUpazilas([]);
    }
  }, [formData.district]);

  // Update Unions when area changes
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
      // Find the donor by their original email or phone (stored in 'user' state)
      const originalKey = user.email || user.phone;
      const result = await updateDonorProfile(originalKey, formData);
      
      if (result.success) {
        toast({ title: "সফল!", description: "আপনার প্রোফাইল আপডেট করা হয়েছে।" });
        // Update local storage with new info
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

  const upcoming = history.filter(a => a.status === 'Scheduled');
  const past = history.filter(a => a.status === 'Completed');
  const initials = user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'RD';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
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
              <div className="flex gap-2 w-full">
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full text-red-500 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" /> লগআউট
                </Button>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                <div className="text-sm font-bold text-green-700">আমার স্ট্যাটাস</div>
                <Badge className="bg-green-500">উপলব্ধ</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3 text-center border-primary/20 bg-primary/5">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">রক্তের গ্রুপ</div>
                  <div className="text-2xl font-black text-primary">{user?.bloodType || donorDetails?.bloodType || 'N/A'}</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">মোট রক্তদান</div>
                  <div className="text-2xl font-black">{donorDetails?.totalDonations || past.length || 0}</div>
                </Card>
              </div>
              
              <div className="pt-4 border-t space-y-4">
                <p className="text-xs text-muted-foreground italic text-center">
                  রক্তের গ্রুপ পরিবর্তন করতে আমাদের ফেসবুক পেজে যোগাযোগ করুন।
                </p>
                <Button variant="outline" className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50" asChild>
                  <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4" /> লাইভ চ্যাট
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-12">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> বর্তমান অনুরোধ
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" /> রক্তদানের ইতিহাস
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> প্রোফাইল সেটিংস
              </TabsTrigger>
            </TabsList>
            
            {/* Appointments Tab */}
            <TabsContent value="appointments" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : upcoming.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">কোনো বর্তমান অনুরোধ পাওয়া যায়নি।</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcoming.map(app => (
                    <Card key={app.id} className="border-l-4 border-l-secondary shadow-sm">
                      <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{app.driveName}</CardTitle>
                            <CardDescription className="flex items-center gap-1.5 mt-1">
                              <MapPin className="h-3.5 w-3.5" /> {app.driveName}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">Scheduled</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 pb-4 flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {app.date}</div>
                        <div className="flex items-center gap-1.5"><Droplet className="h-4 w-4" /> Whole Blood</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : past.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent><p className="text-muted-foreground">আপনি এখনো রক্তদান করেননি। আজই শুরু করুন!</p></CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {past.map(app => (
                    <Card key={app.id} className="border-l-4 border-l-primary/30 shadow-sm opacity-90">
                      <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{app.driveName}</CardTitle>
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">সম্পন্ন</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 pb-4 flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {app.date}</div>
                        <div className="flex items-center gap-1.5"><Droplet className="h-4 w-4 text-primary fill-primary" /> জীবন বাঁচিয়েছেন</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Settings / Edit Profile Tab */}
            <TabsContent value="settings" className="mt-6">
              <Card className="shadow-md rounded-2xl overflow-hidden border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="text-xl">প্রোফাইল তথ্য আপডেট করুন</CardTitle>
                  <CardDescription>আপনার ব্যক্তিগত তথ্য এখান থেকে পরিবর্তন করতে পারেন।</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>পুরো নাম</Label>
                        <Input 
                          value={formData.fullName} 
                          onChange={e => setFormData({...formData, fullName: e.target.value})} 
                          placeholder="আপনার নাম"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ফোন নম্বর</Label>
                        <Input 
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>ইমেইল ঠিকানা</Label>
                        <Input 
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>রক্তের গ্রুপ (লক করা)</Label>
                        <div className="flex items-center gap-2">
                          <Input value={user?.bloodType} disabled className="bg-muted opacity-70" />
                          <Button variant="outline" size="icon" className="shrink-0" asChild>
                            <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border">
                      <div className="space-y-2">
                        <Label>জেলা</Label>
                        <Select 
                          value={formData.district} 
                          onValueChange={val => setFormData({...formData, district: val, area: '', union: ''})}
                        >
                          <SelectTrigger className="bg-white"><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger>
                          <SelectContent>
                            {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>উপজেলা</Label>
                        <Select 
                          value={formData.area} 
                          onValueChange={val => setFormData({...formData, area: val, union: ''})}
                          disabled={!formData.district}
                        >
                          <SelectTrigger className="bg-white"><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger>
                          <SelectContent>
                            {upazilas.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ইউনিয়ন</Label>
                        <Select 
                          value={formData.union} 
                          onValueChange={val => setFormData({...formData, union: val})}
                          disabled={!formData.area}
                        >
                          <SelectTrigger className="bg-white"><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger>
                          <SelectContent>
                            {unions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>সংগঠন বা টিমের নাম</Label>
                      <Input 
                        value={formData.organization} 
                        onChange={e => setFormData({...formData, organization: e.target.value})} 
                        placeholder="যেমন: রেড ক্রিসেন্ট"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary h-12 text-lg font-bold" disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                      তথ্য সেভ করুন
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
