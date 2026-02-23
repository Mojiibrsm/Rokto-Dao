'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldAlert, BellRing, Settings, Users, BarChart3, ArrowRight, Loader2, Droplet, CalendarCheck, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGlobalStats, seedLocationData } from '@/lib/sheets';
import { BANGLADESH_DATA } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';

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

      // Sending data in batches to avoid payload limits
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

  const tools = [
    {
      title: "Fake Profile Detector",
      description: "Analyze donor profiles to detect potential fakes using AI.",
      icon: ShieldAlert,
      href: "/admin/fake-profile-detector",
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      title: "Urgent Notification Generator",
      description: "Generate personalized urgent blood request notifications.",
      icon: BellRing,
      href: "/admin/send-notification",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Donor Management",
      description: "View and manage all registered donors in the system.",
      icon: Users,
      href: "/donors",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Blood Requests",
      description: "Review and manage all active blood requests.",
      icon: Droplet,
      href: "/requests",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <Settings className="h-10 w-10 text-primary" /> Admin Panel
        </h1>
        <p className="text-muted-foreground mt-2">Manage the RoktoDao platform and use AI-powered administrative tools.</p>
      </div>

      {/* Real-time Stats from Google Sheets */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                <h3 className="text-3xl font-bold">
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : stats?.totalDonors || 0}
                </h3>
              </div>
              <Users className="h-10 w-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Requests</p>
                <h3 className="text-3xl font-bold">
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : stats?.totalRequests || 0}
                </h3>
              </div>
              <Droplet className="h-10 w-10 text-secondary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <h3 className="text-3xl font-bold">
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : stats?.totalAppointments || 0}
                </h3>
              </div>
              <CalendarCheck className="h-10 w-10 text-green-600 opacity-20" />
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
                <Button asChild variant="outline" className="w-full group">
                  <Link href={tool.href} className="flex items-center justify-between">
                    Open Tool <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Tools Sidebar */}
        <div className="space-y-6">
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-muted-foreground" />
                System Maintenance
              </CardTitle>
              <CardDescription>
                Seed static location data into your Google Sheet for database consistency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSeedData} 
                disabled={isSeeding}
                variant="secondary"
                className="w-full h-12 gap-2"
              >
                {isSeeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Sync Locations to Sheet
              </Button>
              <p className="text-[10px] text-muted-foreground mt-3 text-center italic">
                * This will populate the 'Locations' tab with 4,500+ records.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
