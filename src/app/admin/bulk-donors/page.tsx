'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { bulkRegisterDonors, getDonors } from '@/lib/sheets';
import { parseDonorData } from '@/ai/flows/donor-data-parser-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Users, CheckCircle2, AlertTriangle, Info, Sparkles, Wand2, ShieldCheck, Database, MapPin, Building2, Mail, Calendar, Key, FileUp, FileSpreadsheet, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

export default function BulkDonorsPage() {
  const [inputText, setInputText] = useState('');
  const [globalOrg, setGlobalOrg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    const reader = new FileReader();

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        reader.onload = (evt) => {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_txt(ws);
          setInputText(data);
          setIsReadingFile(false);
          toast({ title: "ফাইল রিড সম্পন্ন", description: "এখন 'Extract Data with AI' বাটনে ক্লিক করুন।" });
        };
        reader.readAsBinaryString(file);
      } else if (file.name.endsWith('.pdf')) {
        // PDF client-side text extraction is complex without heavy libraries
        // We inform the user to copy-paste or convert to Excel for better results
        toast({ 
          variant: "destructive", 
          title: "PDF সরাসরি সাপোর্ট করছে না", 
          description: "অনুগ্রহ করে PDF থেকে ডাটা কপি করে নিচে পেস্ট করুন অথবা Excel ব্যবহার করুন।" 
        });
        setIsReadingFile(false);
      } else {
        reader.onload = (evt) => {
          const text = evt.target?.result as string;
          setInputText(text);
          setIsReadingFile(false);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "ফাইল রিডে ত্রুটি", description: "ফাইলটি পড়া সম্ভব হয়নি।" });
      setIsReadingFile(false);
    }
  };

  const handleAnalyze = async () => {
    if (inputText.trim() === '') {
      toast({ variant: "destructive", title: "তথ্য পাওয়া যায়নি", description: "অনুগ্রহ করে রক্তদাতার তথ্য পেস্ট করুন বা ফাইল আপলোড করুন।" });
      return;
    }

    setIsAnalyzing(true);
    setDuplicatesCount(0);
    setPreview([]);

    try {
      // 1. Use AI to parse the text into structured data
      const { donors: parsedDonors } = await parseDonorData({ rawText: inputText });

      if (!parsedDonors || parsedDonors.length === 0) {
        toast({ variant: "destructive", title: "পার্সিং ব্যর্থ", description: "AI কোনো দাতার তথ্য খুঁজে পায়নি।" });
        return;
      }

      // 2. Fetch existing donors to check for duplicates
      const existingDonors = await getDonors();
      
      const uniqueNewData: any[] = [];
      let dupes = 0;

      parsedDonors.forEach(newDonor => {
        const cleanNewPhone = String(newDonor.phone || '').replace(/\D/g, '');
        const newNameLower = String(newDonor.fullName || '').toLowerCase().trim();
        
        const isDuplicate = existingDonors.some(ext => {
          if (!ext) return false;
          const cleanExtPhone = String(ext.phone || '').replace(/\D/g, '');
          const extNameLower = String(ext.fullName || '').toLowerCase().trim();
          
          return (
            extNameLower === newNameLower && 
            cleanExtPhone === cleanNewPhone
          );
        });

        if (isDuplicate) {
          dupes++;
        } else {
          uniqueNewData.push({
            ...newDonor,
            organization: globalOrg.trim() || newDonor.organization || ''
          });
        }
      });

      setDuplicatesCount(dupes);
      setPreview(uniqueNewData);

      toast({
        title: "বিশ্লেষণ সম্পন্ন",
        description: `মোট ${parsedDonors.length} জন পাওয়া গেছে। ${dupes} টি ডুপ্লিকেট বাদ দেওয়া হয়েছে।`,
      });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "বিশ্লেষণে ত্রুটি", description: "AI এর মাধ্যমে ডাটা প্রসেস করা যায়নি।" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const result = await bulkRegisterDonors(preview);
      if (result.success) {
        toast({
          title: "ইম্পোর্ট সফল!",
          description: `সফলভাবে ${result.count} জন নতুন দাতা যোগ করা হয়েছে।`,
        });
        router.push('/admin');
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ইম্পোর্ট ব্যর্থ", description: "ডাটাবেজ আপডেট করার সময় সমস্যা হয়েছে।" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Smart Bulk AI Import</h1>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-xl rounded-[2.5rem] overflow-hidden border-t-8 border-t-primary">
          <CardHeader className="bg-primary/5 pb-8 pt-10 px-10">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-3xl">Excel/Text Data Parser</CardTitle>
                <CardDescription className="text-lg">
                  Excel ফাইল আপলোড করুন অথবা রো কপি করে এখানে পেস্ট করুন। AI সব তথ্য সাজিয়ে নেবে।
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-10 space-y-8">
            {/* File Upload Zone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="border-4 border-dashed border-primary/20 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx,.xls,.csv,.txt"
                  onChange={handleFileUpload} 
                />
                <div className="h-16 w-16 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Excel/CSV ফাইল আপলোড</p>
                  <p className="text-xs text-muted-foreground">ড্র্যাগ করুন অথবা এখানে ক্লিক করুন</p>
                </div>
                {isReadingFile && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              </div>

              <div className="space-y-3 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-5 w-5 text-primary" />
                  <Label htmlFor="globalOrg" className="text-lg font-bold">সংগঠন বা টিমের নাম (ঐচ্ছিক)</Label>
                </div>
                <Input 
                  id="globalOrg"
                  placeholder="যেমন: Sandhani / Red Crescent" 
                  className="h-14 rounded-2xl bg-white border-2 focus:border-primary transition-all text-lg"
                  value={globalOrg}
                  onChange={e => setGlobalOrg(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="bulkData" className="text-lg font-bold">টেক্সট ডাটা বা কপি-পেস্ট</Label>
                {inputText && (
                  <Button variant="ghost" size="sm" onClick={() => setInputText('')} className="text-red-500 hover:text-red-600 font-bold">
                    <X className="h-4 w-4 mr-1" /> পরিষ্কার করুন
                  </Button>
                )}
              </div>
              <Textarea 
                id="bulkData" 
                placeholder="Excel থেকে রো কপি করে এখানে পেস্ট করুন..." 
                className="min-h-[300px] font-mono text-sm rounded-3xl bg-muted/20 focus:bg-white transition-all p-6 border-2 focus:border-primary"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || isReadingFile}
              className="w-full h-16 bg-primary hover:bg-primary/90 rounded-2xl font-bold text-xl gap-3 shadow-xl shadow-primary/10 transition-all active:scale-95"
            >
              {isAnalyzing ? (
                <><Loader2 className="h-6 w-6 animate-spin" /> AI বিশ্লেষণ করছে...</>
              ) : (
                <><Wand2 className="h-6 w-6" /> Extract Data with AI</>
              )}
            </Button>
          </CardContent>
        </Card>

        {duplicatesCount > 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 rounded-2xl animate-in slide-in-from-top-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">ডুপ্লিকেট ডাটা শনাক্ত হয়েছে</AlertTitle>
            <AlertDescription className="text-red-700">
              আমরা <strong>{duplicatesCount}</strong> টি দাতার তথ্য পেয়েছি যা ইতিমধ্যে সিস্টেমে আছে। এগুলোকে বাদ দেওয়া হয়েছে।
            </AlertDescription>
          </Alert>
        )}

        {preview.length > 0 && (
          <Card className="border-green-200 shadow-2xl rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between pb-6 px-10 pt-10 bg-green-50/50">
              <div>
                <CardTitle className="text-2xl text-green-800">Verified AI Output</CardTitle>
                <CardDescription className="text-green-600">ইম্পোর্ট করার জন্য {preview.length} টি নতুন ডাটা প্রস্তুত।</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-4 py-1 text-sm font-bold rounded-full">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Verified
              </Badge>
            </CardHeader>
            <CardContent className="px-10">
              <div className="border rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">নাম ও ইমেইল</th>
                      <th className="px-6 py-4 text-left font-bold">ফোন ও গ্রুপ</th>
                      <th className="px-6 py-4 text-left font-bold">অবস্থান</th>
                      <th className="px-6 py-4 text-left font-bold">দান ও তারিখ</th>
                      <th className="px-6 py-4 text-left font-bold">অতিরিক্ত</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {preview.map((d, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold">{d.fullName}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="h-2 w-2" /> {d.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary h-7 w-7 flex items-center justify-center font-black rounded-lg text-xs">
                              {d.bloodType}
                            </Badge>
                            <span className="font-mono text-xs">{d.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3 text-primary" /> {d.district}
                            </span>
                            <span className="text-[10px] text-muted-foreground ml-4">{d.area || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="w-fit text-[10px] font-bold">Donations: {d.totalDonations}</Badge>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="h-2 w-2" /> Last: {d.lastDonationDate || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {d.organization && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-100">{d.organization}</span>}
                            {d.password && <span className="text-[10px] flex items-center gap-1 text-amber-600"><Key className="h-2 w-2" /> Has Pass</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-green-50/50 py-10 px-10 border-t">
              <Button onClick={handleImport} disabled={isSubmitting} className="w-full h-20 bg-green-600 hover:bg-green-700 rounded-3xl text-2xl font-black shadow-2xl shadow-green-200 gap-4 transition-all hover:scale-[1.01]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin" />
                    ডাটাবেজ আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    Complete Smart Import <Database className="h-8 w-8" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
