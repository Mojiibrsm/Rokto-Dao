'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDonationHistory, type Appointment, getDonors } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Calendar, History, MapPin, Loader2, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [donorDetails, setDonorDetails] = useState<any>(null);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      if (!user?.email) return;
      setLoading(true);
      try {
        // Fetch donation appointments
        const appData = await getDonationHistory(user.email);
        setHistory(appData);

        // Fetch user profile details from Google Sheet
        const allDonors = await getDonors({ bloodType: user.bloodType });
        const currentDonor = allDonors.find(d => d.email === user.email);
        if (currentDonor) {
          setDonorDetails(currentDonor);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

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

  // Helper to get initials
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
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">সম্পাদনা</Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:bg-red-50">লগআউট</Button>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                <div className="text-sm font-bold text-green-700">আমার স্ট্যাটাস</div>
                <Badge className="bg-green-500">উপলব্ধ</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase">রক্তের গ্রুপ</div>
                  <div className="text-lg font-bold text-primary">{user?.bloodType || donorDetails?.bloodtype || 'N/A'}</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-xs text-muted-foreground uppercase">মোট রক্তদান</div>
                  <div className="text-lg font-bold">{donorDetails?.totaldonations || past.length || 0}</div>
                </Card>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">জেলা</span>
                  <span className="font-medium">{donorDetails?.district || 'লোড হচ্ছে...'}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">ফোন</span>
                  <span className="font-medium">{donorDetails?.phone || 'লোড হচ্ছে...'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                বর্তমান অনুরোধসমূহ
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                রক্তদানের ইতিহাস
              </TabsTrigger>
            </TabsList>
            
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
                              <MapPin className="h-3.5 w-3.5" />
                              {app.driveName}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">Scheduled</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 pb-4 flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {app.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Droplet className="h-4 w-4" />
                          Whole Blood
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : past.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent>
                    <p className="text-muted-foreground">আপনি এখনো রক্তদান করেননি। আজই শুরু করুন!</p>
                  </CardContent>
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
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {app.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Droplet className="h-4 w-4 text-primary fill-primary" />
                          জীবন বাঁচিয়েছেন
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
