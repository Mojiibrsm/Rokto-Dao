'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  ShieldAlert, BellRing, Settings, Users, BarChart3, ArrowRight, 
  Loader2, Droplet, CalendarCheck, Database, RefreshCw, 
  TrendingUp, MapPin, Activity, ShieldCheck, HeartPulse, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGlobalStats, seedLocationData } from '@/lib/sheets';
import { BANGLADESH_DATA } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as ChartTooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

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

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const rows: string[][] = [];
      for (const district in BANGLADESH_DATA) {
        const upazillas = BANGLADESH_DATA[district];
        for (const upazilla in upazillas) {
          const unions = upazillas[upazilla];
          unions.forEach(union => {
            rows.push([district, upazilla, union]);
          });
        }
      }

      const batchSize = 500;
      let processed = 0;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        await seedLocationData(batch);
        processed += batch.length;
      }

      toast({
        title: "Seeding Successful!",
        description: `${processed} locations have been synced to Google Sheets.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: "Could not sync locations. Check your internet and script configuration.",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const chartData = [
    { name: 'Jan', donations: 400 },
    { name: 'Feb', donations: 300 },
    { name: 'Mar', donations: 600 },
    { name: 'Apr', donations: 800 },
    { name: 'May', donations: 500 },
    { name: 'Jun', donations: 900 },
  ];

  const bloodGroupData = [
    { name: 'A+', value: 400, color: '#ef4444' },
    { name: 'O+', value: 300, color: '#f87171' },
    { name: 'B+', value: 300, color: '#b91c1c' },
    { name: 'AB+', value: 200, color: '#dc2626' },
  ];

  const tools = [
    {
      title: "Add New Donor",
      description: "Directly add donors to the system. Email is optional.",
      icon: UserPlus,
      href: "/admin/add-donor",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Fake Profile Detector",
      description: "Analyze donor profiles to detect potential fakes using AI.",
      icon: ShieldAlert,
      href: "/admin/fake-profile-detector",
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "Urgent Notification",
      description: "Generate personalized urgent blood request notifications.",
      icon: BellRing,
      href: "/admin/send-notification",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Blood Drive Manager",
      description: "Plan and manage upcoming blood donation campaigns.",
      icon: CalendarCheck,
      href: "/admin/manage-drives",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
            <Settings className="h-10 w-10 text-primary" /> অ্যাডমিন প্যানেল
          </h1>
          <p className="text-muted-foreground mt-2">RoktoDao প্ল্যাটফর্ম এবং AI টুলস পরিচালনা করুন।</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" /> লগ দেখুন
          </Button>
          <Button className="gap-2 bg-primary">
            <TrendingUp className="h-4 w-4" /> রিপোর্ট ডাউনলোড
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-10">
        {[
          { label: "মোট দাতা", val: stats?.totalDonors, icon: Users, color: "text-primary", bg: "bg-primary/5" },
          { label: "রক্তের অনুরোধ", val: stats?.totalRequests, icon: Droplet, color: "text-secondary", bg: "bg-secondary/5" },
          { label: "অ্যাপয়েন্টমেন্ট", val: stats?.totalAppointments, icon: CalendarCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "সফল দান", val: "৪৫০+", icon: HeartPulse, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((s, i) => (
          <Card key={i} className={`${s.bg} border-none shadow-sm`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-3xl font-black mt-1">
                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (s.val || 0)}
                  </h3>
                </div>
                <s.icon className={`h-10 w-10 ${s.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Analytics Section */}
      <div className="grid gap-8 lg:grid-cols-3 mb-10">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> মাসিক রক্তদান প্রবণতা
            </CardTitle>
            <CardDescription>বিগত ৬ মাসের রক্তদান কার্যক্রমের পরিসংখ্যান।</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="donations" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">রক্তের গ্রুপের অনুপাত</CardTitle>
            <CardDescription>বর্তমানে নিবন্ধিত দাতাদের গ্রুপ ডিস্ট্রিবিউশন।</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodGroupData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bloodGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {bloodGroupData.map((g, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: g.color }}></div>
                  <span>{g.name}: {g.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
          {tools.map((tool, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow overflow-hidden border-l-4 border-l-primary/20">
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <div className={`${tool.bgColor} p-3 rounded-xl`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group rounded-xl">
                  <Link href={tool.href} className="flex items-center justify-between">
                    টুলটি ওপেন করুন <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health & Maintenance */}
        <div className="space-y-6">
          <Card className="border-2 border-dashed border-primary/20 bg-muted/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                সিস্টেম স্ট্যাটাস
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium">গুগল শিট কানেকশন</span>
                <Badge className="bg-green-500">অনলাইন</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium">AI প্রসেসর (Genkit)</span>
                <Badge className="bg-green-500">সক্রিয়</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium">ব্যাকআপ স্ট্যাটাস</span>
                <span className="text-xs text-muted-foreground italic">প্রতিদিন ১২:০০ AM</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 opacity-50" />
                মেইনটেইনেন্স
              </CardTitle>
              <CardDescription className="text-slate-400">
                লোকেশন ডাটা সিঙ্ক করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSeedData} 
                disabled={isSeeding}
                variant="secondary"
                className="w-full h-12 gap-2 bg-white/10 hover:bg-white/20 text-white border-none"
              >
                {isSeeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                লোকেশন আপডেট করুন
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
