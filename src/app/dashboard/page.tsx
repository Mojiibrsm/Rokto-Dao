
'use client';

import { useState, useEffect } from 'react';
import { getDonationHistory, type Appointment } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, Calendar, History, ShieldCheck, MapPin, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [history, setHistory] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const userEmail = 'test@example.com'; // Simulate logged in user

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getDonationHistory(userEmail);
      setHistory(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const upcoming = history.filter(a => a.status === 'Scheduled');
  const past = history.filter(a => a.status === 'Completed');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
            <div className="bg-primary/5 p-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                AD
              </div>
              <div>
                <h2 className="text-xl font-bold font-headline">Alex Donor</h2>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Blood Type</span>
                <Badge className="bg-primary h-6 px-2">O+</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Total Donations</span>
                <span className="font-bold text-primary">{past.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Lives Impacted</span>
                <span className="font-bold text-secondary">{past.length * 3}</span>
              </div>
              <div className="flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Verified Donor Account
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
                My Appointments
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Donation History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : upcoming.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">No upcoming appointments found.</p>
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
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">Upcoming</Badge>
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
                    <p className="text-muted-foreground">You haven't made any donations yet. Start today!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {past.map(app => (
                    <Card key={app.id} className="border-l-4 border-l-primary/30 shadow-sm opacity-90">
                      <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{app.driveName}</CardTitle>
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 pb-4 flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {app.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Droplet className="h-4 w-4 text-primary fill-primary" />
                          Life Saved
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
