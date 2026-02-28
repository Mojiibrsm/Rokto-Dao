'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  ShieldAlert, BellRing, Settings, Users, BarChart3, ArrowRight, 
  Loader2, Droplet, CalendarCheck, Database, RefreshCw, 
  TrendingUp, MapPin, Activity, ShieldCheck, HeartPulse, UserPlus, FileUp, UserCheck, LogOut, History, Users2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    { title: "User Activity Logs", description: "Track who updated what and when.", icon: History, href: "/admin/logs", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { title: "Manage Team", description: "Add, edit or remove team members info.", icon: Users2, href: "/admin/manage-team", color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { title: "Bulk Donor Import", description: "Smart AI import from raw text records.", icon: FileUp, href: "/admin/bulk-donors", color: "text-purple-600", bgColor: "bg-purple-100" },
    { title: "Urgent Notification", description: "Generate personalized Bengali SMS messages.", icon: BellRing, href: "/admin/send-notification", color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Fake Detector", description: "Check if a profile looks suspicious using AI.", icon: ShieldAlert, href: "/admin/fake-profile-detector", color: "text-amber-600", bgColor: "bg-amber-50" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline flex items-center gap-3 text-slate-900">
            <Settings className="h-10 w-10 text-primary animate-spin-slow" /> 
            অ্যাডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-muted-foreground mt-2 font-bold uppercase tracking-widest text-xs">RoktoDao Central Management System</p>
        </div>
        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 h-12 rounded-2xl px-6 font-bold" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> লগআউট করুন
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {[
          { label: "মোট দাতা", val: stats?.totalDonors, icon: Users, color: "text-primary", bg: "bg-primary/5" },
          { label: "রক্তের অনুরোধ", val: stats?.totalRequests, icon: Droplet, color: "text-secondary", bg: "bg-secondary/5" },
          { label: "সফল দান", val: "৪৫০+", icon: HeartPulse, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((s, i) => (
          <Card key={i} className={`${s.bg} border-none shadow-sm rounded-3xl overflow-hidden`}>
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{s.label}</p>
                  <h3 className="text-4xl font-black mt-2">{loading ? <Loader2 className="animate-spin h-6 w-6" /> : (s.val || 0)}</h3>
                </div>
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${s.bg} border-2 border-white shadow-xl`}>
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, idx) => (
          <Card key={idx} className="hover:shadow-xl transition-all duration-300 rounded-[2rem] border-none group bg-white border-b-4 border-b-transparent hover:border-b-primary shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-start gap-5 pb-6 pt-8 px-8">
              <div className={`${tool.bgColor} h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <tool.icon className={`h-7 w-7 ${tool.color}`} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-black">{tool.title}</CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed">{tool.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Button asChild variant="outline" className="w-full group rounded-2xl h-12 font-bold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Link href={tool.href} className="flex items-center justify-between">
                  ম্যানেজ করুন <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Card className="bg-slate-900 text-white rounded-3xl w-full max-w-md overflow-hidden border-none shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> লোকেশন ডাটা সিঙ্ক
            </CardTitle>
            <CardDescription className="text-slate-400">নতুন কোনো জেলা বা উপজেলা যোগ হলে সিঙ্ক করুন।</CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            <Button onClick={handleSeedData} disabled={isSeeding} variant="secondary" className="w-full h-14 rounded-2xl gap-3 bg-white/10 hover:bg-primary hover:text-white transition-all text-lg font-bold border-none">
              {isSeeding ? <RefreshCw className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />} 
              সিঙ্ক শুরু করুন
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}