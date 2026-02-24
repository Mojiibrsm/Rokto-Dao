'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bulkRegisterDonors, getDonors } from '@/lib/sheets';
import { parseDonorData } from '@/ai/flows/donor-data-parser-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Users, CheckCircle2, AlertTriangle, Info, Sparkles, Wand2, ShieldCheck, Database, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function BulkDonorsPage() {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (inputText.trim() === '') {
      toast({ variant: "destructive", title: "তথ্য পাওয়া যায়নি", description: "অনুগ্রহ করে রক্তদাতার তথ্য ইনপুট দিন।" });
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
        // Safe conversion to string and cleanup
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
          uniqueNewData.push(newDonor);
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
      toast({ variant: "destructive", title: "ইম্পোর্ট ব্যর্থ", description: "গুগল শিট আপডেট করার সময় সমস্যা হয়েছে।" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
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
                <CardTitle className="text-3xl">AI Data Parser</CardTitle>
                <CardDescription className="text-lg">
                  যেকোনো অগোছালো ডাটা পেস্ট করুন। AI নিজ থেকেই সব ঠিক করে নেবে।
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-10 space-y-6">
            <Alert className="bg-blue-50 border-blue-200 rounded-2xl">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800 font-bold mb-1">স্মার্ট ইনপুট সাপোর্ট!</AlertTitle>
              <AlertDescription className="text-blue-700">
                আপনি নাম, রক্তের গ্রুপ এবং মোবাইল নম্বর সম্বলিত যেকোনো টেক্সট এখানে দিতে পারেন। AI স্বয়ংক্রিয়ভাবে ইংরেজি জেলাকে বাংলায় রূপান্তর করবে এবং উপজেলা খুঁজে নেবে।
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="bulkData" className="text-lg font-bold">ইনপুট এরিয়া</Label>
              <Textarea 
                id="bulkData" 
                placeholder="যেমন: Faisal, B+, 01815... Coxbazar PS Maheshkhali" 
                className="min-h-[350px] font-mono text-base rounded-3xl bg-muted/20 focus:bg-white transition-all p-6 border-2 focus:border-primary"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
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
                <table className="w-full text-base">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">নাম</th>
                      <th className="px-6 py-4 text-left font-bold">ফোন</th>
                      <th className="px-6 py-4 text-left font-bold">রক্তের গ্রুপ</th>
                      <th className="px-6 py-4 text-left font-bold">অবস্থান</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {preview.map((d, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-bold">{d.fullName}</td>
                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{d.phone}</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-primary h-10 w-10 flex items-center justify-center text-lg font-black rounded-lg">
                            {d.bloodType}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-primary" /> {d.district}
                            </span>
                            <span className="text-xs text-muted-foreground ml-4">{d.area || 'N/A'}</span>
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
