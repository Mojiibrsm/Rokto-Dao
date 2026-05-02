'use client';

import { useState, useEffect } from 'react';
import { getReports, updateReportStatus, deleteEntry, type Report } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ArrowLeft, RefreshCw, ShieldAlert, CheckCircle, Trash2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateReportStatus(id, status);
      toast({ title: "Updated!", description: `Report status set to ${status}.` });
      setSelectedReport(null);
      loadData();
    } catch (e) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const handleActionTaken = async (report: Report) => {
    if (!confirm('Are you sure you want to take action and delete this entry?')) return;
    try {
      const sheetName = report.type === 'Donor' ? 'Donors' : 'Requests';
      await deleteEntry(sheetName, report.targetId);
      await updateReportStatus(report.id, 'Action Taken');
      toast({ title: "Success!", description: `${report.type} has been removed from system.` });
      setSelectedReport(null);
      loadData();
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 border">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black font-headline text-slate-900">User Reports</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">ফেক ডোনার বা স্প্যাম রিকোয়েস্ট ম্যানেজমেন্ট</p>
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
              <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">ইউজার রিপোর্ট তালিকা</CardTitle>
                <CardDescription>ডোনার বা গ্রহীতাদের বিরুদ্ধে আসা অভিযোগসমূহ।</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="h-14 border-none">
                  <TableHead className="px-10 font-black text-slate-900 uppercase text-[11px] tracking-widest">সময় ও টাইপ</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">টার্গেট (অভিযুক্ত)</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">কারণ</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">স্ট্যাটাস</TableHead>
                  <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest text-right px-10">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : reports.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center font-bold text-muted-foreground">কোনো রিপোর্ট পাওয়া যায়নি।</TableCell></TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-muted/20">
                      <TableCell className="px-10 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black">{format(new Date(report.timestamp), 'MMM dd, hh:mm a')}</span>
                          <Badge variant={report.type === 'Donor' ? 'destructive' : 'secondary'} className="w-fit text-[9px] mt-1 uppercase">{report.type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">{report.targetName}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{report.targetId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm font-bold text-slate-700 truncate">{report.reason}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          report.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                          report.status === 'Reviewed' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                        }>{report.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right px-10">
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)} className="rounded-xl font-bold gap-2">
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-xl rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-red-600" /> রিপোর্ট বিস্তারিত
            </DialogTitle>
            <DialogDescription className="font-bold">রিপোর্ট আইডি: {selectedReport?.id}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-2xl border">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">অভিযুক্ত</p>
                   <p className="font-black text-lg">{selectedReport.targetName}</p>
                   <p className="text-xs text-primary font-bold">{selectedReport.targetId}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border">
                   <p className="text-[10px] font-black text-muted-foreground uppercase">রিপোর্টার</p>
                   <p className="font-black text-lg">{selectedReport.reporterPhone}</p>
                   <p className="text-xs text-muted-foreground font-bold">User Access</p>
                </div>
              </div>

              <div className="space-y-2">
                 <p className="text-xs font-black text-muted-foreground uppercase">রিপোর্টের কারণ</p>
                 <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold">
                   {selectedReport.reason}
                 </div>
              </div>

              {selectedReport.details && (
                <div className="space-y-2">
                   <p className="text-xs font-black text-muted-foreground uppercase">অতিরিক্ত তথ্য</p>
                   <div className="p-4 bg-white rounded-2xl border italic text-sm">
                     "{selectedReport.details}"
                   </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button className="flex-1 bg-slate-900 rounded-xl font-bold" asChild>
                  <Link href={selectedReport.type === 'Donor' ? `/donors/${selectedReport.targetId}` : `/requests`}>
                    টার্গেট পেজ দেখুন <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <DialogFooter className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleStatusChange(selectedReport.id, 'Dismissed')} className="rounded-xl font-bold border-2">
                  বাতিল করুন
                </Button>
                <Button variant="destructive" onClick={() => handleActionTaken(selectedReport)} className="rounded-xl font-black shadow-lg shadow-red-200">
                  অ্যাকশন নিন (মুছে ফেলুন)
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
