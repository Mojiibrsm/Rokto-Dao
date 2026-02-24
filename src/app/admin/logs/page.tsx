'use client';

import { useState, useEffect } from 'react';
import { getLogs, type ActivityLog } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ArrowLeft, RefreshCw, User, Phone, Calendar, Info, ShieldCheck, Edit, UserPlus, LogIn, KeyRound, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getActionIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('login')) return <LogIn className="h-4 w-4 text-blue-500" />;
    if (act.includes('edit') || act.includes('update')) return <Edit className="h-4 w-4 text-amber-500" />;
    if (act.includes('register')) return <UserPlus className="h-4 w-4 text-green-500" />;
    if (act.includes('password')) return <KeyRound className="h-4 w-4 text-purple-500" />;
    return <Info className="h-4 w-4 text-slate-400" />;
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('login')) return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Login</Badge>;
    if (act.includes('edit')) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Update</Badge>;
    if (act.includes('password')) return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Security</Badge>;
    if (act.includes('request')) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Request</Badge>;
    return <Badge variant="secondary">{action}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 border">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black font-headline text-slate-900">User Activity Logs</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">ব্যবহারকারীদের সাম্প্রতিক কার্যক্রমের ইতিহাস</p>
          </div>
        </div>
        <Button onClick={loadData} disabled={loading} className="rounded-2xl h-12 px-6 gap-2 bg-slate-900 hover:bg-primary transition-all shadow-xl">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />} রিফ্রেশ করুন
        </Button>
      </div>

      <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-muted/30 pb-6 pt-8 px-10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">সাম্প্রতিক লগসমূহ</CardTitle>
                <CardDescription>সিস্টেমে হওয়া শেষ ২০০টি কার্যক্রম এখানে দেখা যাচ্ছে।</CardDescription>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1">Real-time Data</Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 px-3 py-1">Sorted by Time</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="h-14 border-none">
                  <TableHead className="px-10 font-black text-slate-900 uppercase text-[11px] tracking-widest">সময়</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">ব্যবহারকারী</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">অ্যাকশন</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">বিস্তারিত</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                        <p className="text-muted-foreground font-bold italic">ডাটা লোড হচ্ছে...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground font-bold italic">কোনো কার্যক্রম পাওয়া যায়নি।</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, i) => (
                    <TableRow key={i} className="hover:bg-muted/20 border-b-slate-100 transition-colors">
                      <TableCell className="px-10 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-700">{log.timestamp ? format(new Date(log.timestamp), 'MMM dd, hh:mm a') : 'N/A'}</span>
                          <span className="text-[10px] font-bold text-muted-foreground italic uppercase">Today</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold">
                            {log.username.substring(0, 1)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900">{log.username}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono"><Phone className="h-3 w-3" /> {log.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {log.details}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}