'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  ShieldAlert, BellRing, Settings, Users, BarChart3, ArrowRight, 
  Loader2, Droplet, CalendarCheck, Database, RefreshCw, 
  TrendingUp, MapPin, Activity, ShieldCheck, HeartPulse, UserPlus, FileUp, UserCheck, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGlobalStats, seedLocationData } from '@/lib/sheets';
import { BANGLADESH_DATA } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getGlobalStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('roktodao_admin_auth');
    router.push('/admin/login');
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const rows: string[][] = [];
      for (const district in BANGLADESH_DATA) {
        const upazillas = BANGLADESH_DATA[district];
        for (const upazilla in upazillas) {
          const unions = upazillas[upazilla];
          unions.forEach(union => rows.push([district, upazilla, union]));
        }
      }
      const batchSize = 500;
      for (let i = 0; i < rows.length; i += batchSize) {
        await seedLocationData(rows.slice(i, i + batchSize));
      }
      toast({ title: "Seeding Successful!", description: "Locations synced." });
    } catch (error) {
      toast({ variant: "destructive", title: "Seeding Failed" });
    } finally {
      setIsSeeding(false);
    }
  };

  const tools = [
    { title: "Manage Donors", description: "Edit or remove existing donors from the system.", icon: UserCheck, href: "/admin/manage-donors", color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Add New Donor", description: "Directly add donors to the system.", icon: UserPlus, href: "/admin/add-donor", color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Bulk Donor Import", description: "Smart AI import from raw text records.", icon: FileUp, href: "/admin/bulk-donors", color: "text-purple-600", bgColor: "bg-purple-100" },
    { title: "Urgent Notification", description: "Generate personalized Bengali SMS messages.", icon: BellRing, href: "/admin/send-notification", color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Fake Detector", description: "Check if a profile looks suspicious using AI.", icon: ShieldAlert, href: "/admin/fake-profile-detector", color: "text-amber-600", bgColor: "bg-amber-50" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline flex items-center gap-3"><Settings className="h-10 w-10 text-primary" /> অ্যাডমিন প্যানেল</h1>
          <p className="text-muted-foreground mt-2">RoktoDao প্ল্যাটফর্ম এবং AI টুলস পরিচালনা করুন।</p>
        </div>
        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> লগআউট করুন
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {[
          { label: "মোট দাতা", val: stats?.totalDonors, icon: Users, color: "text-primary", bg: "bg-primary/5" },
          { label: "রক্তের অনুরোধ", val: stats?.totalRequests, icon: Droplet, color: "text-secondary", bg: "bg-secondary/5" },
          { label: "সফল দান", val: "৪৫০+", icon: HeartPulse, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((s, i) => (
          <Card key={i} className={`${s.bg} border-none shadow-sm`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-3xl font-black mt-1">{loading ? <Loader2 className="animate-spin h-6 w-6" /> : (s.val || 0)}</h3>
                </div>
                <s.icon className={`h-10 w-10 ${s.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow overflow-hidden border-l-4 border-l-primary/20">
            <CardHeader className="flex flex-row items-start gap-4 pb-4">
              <div className={`${tool.bgColor} p-3 rounded-xl`}><tool.icon className={`h-6 w-6 ${tool.color}`} /></div>
              <div className="space-y-1">
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full group rounded-xl">
                <Link href={tool.href} className="flex items-center justify-between">টুলটি ওপেন করুন <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 max-w-sm">
        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-lg">লোকেশন ডাটা সিঙ্ক</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeedData} disabled={isSeeding} variant="secondary" className="w-full h-12 gap-2 bg-white/10 hover:bg-white/20 text-white">
              {isSeeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} সিঙ্ক করুন
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}