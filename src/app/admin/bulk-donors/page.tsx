'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bulkRegisterDonors, getDonors } from '@/lib/sheets';
import { correctLocations } from '@/ai/flows/location-correction-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Users, CheckCircle2, AlertTriangle, Info, Sparkles, Wand2, ShieldCheck } from 'lucide-react';
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

  const normalizeBloodGroup = (text: string) => {
    const bg = text.toLowerCase();
    if (bg.includes('a') && bg.includes('positive')) return 'A+';
    if (bg.includes('a') && bg.includes('negative')) return 'A-';
    if (bg.includes('b') && bg.includes('positive')) return 'B+';
    if (bg.includes('b') && bg.includes('negative')) return 'B-';
    if (bg.includes('o') && bg.includes('positive')) return 'O+';
    if (bg.includes('o') && bg.includes('negative')) return 'O-';
    if (bg.includes('ab') && bg.includes('positive')) return 'AB+';
    if (bg.includes('ab') && bg.includes('negative')) return 'AB-';
    return text.trim().toUpperCase();
  };

  const parseInput = (text: string) => {
    const blocks = text.trim().split(/\n\s*\n/);
    const parsed: any[] = [];

    // Check if it's the structured format (Name \n Blood Group... \n Mobile...)
    if (text.includes('Blood Group') && text.includes('Mobile')) {
      blocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length >= 3) {
          const donor: any = { fullName: lines[0] };
          
          lines.forEach(line => {
            if (line.includes('Blood Group')) donor.bloodType = normalizeBloodGroup(line.split('Blood Group')[1]);
            if (line.includes('Mobile')) donor.phone = line.split('Mobile')[1].trim();
            if (line.includes('District')) {
              const parts = line.split(/District|PS/i);
              donor.district = parts[1]?.trim() || '';
              donor.area = parts[2]?.trim() || ''; // PS is Upozila/Area
            }
          });

          if (donor.fullName && donor.phone) parsed.push(donor);
        }
      });
    } else {
      // Fallback to CSV/Tab format
      const lines = text.trim().split('\n');
      lines.forEach(line => {
        const parts = line.split(/[,\t]/);
        if (parts.length >= 2) {
          parsed.push({
            fullName: parts[0]?.trim() || '',
            phone: parts[1]?.trim() || '',
            bloodType: parts[2]?.trim() || '',
            district: parts[3]?.trim() || '',
            area: parts[4]?.trim() || '',
          });
        }
      });
    }
    return parsed;
  };

  const handleParse = async () => {
    if (inputText.trim() === '') {
      toast({ variant: "destructive", title: "No data found", description: "Please enter donor information." });
      return;
    }

    setIsAnalyzing(true);
    setDuplicatesCount(0);
    try {
      const parsedData = parseInput(inputText);

      if (parsedData.length === 0) {
        toast({ variant: "destructive", title: "Parsing failed", description: "Check input format." });
        setIsAnalyzing(false);
        return;
      }

      // Check for duplicates from existing database
      const existingDonors = await getDonors();
      const uniqueNewData: any[] = [];
      let dupes = 0;

      parsedData.forEach(newDonor => {
        const isDuplicate = existingDonors.some(
          ext => ext.fullName.toLowerCase() === newDonor.fullName.toLowerCase() && 
                 ext.phone.replace(/\s/g, '') === newDonor.phone.replace(/\s/g, '')
        );
        if (isDuplicate) {
          dupes++;
        } else {
          uniqueNewData.push(newDonor);
        }
      });

      setDuplicatesCount(dupes);

      // AI Correction Step for locations
      const uniqueRawDistricts = Array.from(new Set(uniqueNewData.map(d => d.district).filter(Boolean)));
      if (uniqueRawDistricts.length > 0) {
        const { corrections } = await correctLocations({ rawLocations: uniqueRawDistricts });
        
        const correctedData = uniqueNewData.map(donor => {
          const match = corrections.find(c => c.original === donor.district);
          return {
            ...donor,
            district: match ? match.corrected : donor.district,
            wasCorrected: match ? match.isChanged : false
          };
        });
        setPreview(correctedData);
      } else {
        setPreview(uniqueNewData);
      }

      toast({
        title: "Analysis Complete",
        description: `Parsed ${parsedData.length} records. Found ${dupes} duplicates.`,
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Analysis error", description: "Could not process data." });
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
          title: "Import Successful!",
          description: `${result.count} new donors added.`,
        });
        router.push('/admin');
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Import Failed", description: "An error occurred." });
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
        <h1 className="text-3xl font-bold font-headline">Smart Bulk Import</h1>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-xl rounded-3xl overflow-hidden border-t-8 border-t-purple-600">
          <CardHeader className="bg-purple-50/50">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <CardTitle>Intelligent Import</CardTitle>
                <CardDescription>
                  Supports multi-line, CSV, or Tab formats. 
                  <span className="text-primary font-bold ml-1 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Duplicate protection active.
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-bold">New Format Supported!</AlertTitle>
              <AlertDescription className="text-amber-700">
                You can now paste blocks like: <br />
                <strong>Name</strong> <br />
                <strong>Blood Group B Positive</strong> <br />
                <strong>Mobile 01XXXXXXXXX</strong> <br />
                <strong>District Coxbazar PS Maheshkhali</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="bulkData">Donor Data Area</Label>
              <Textarea 
                id="bulkData" 
                placeholder="Paste donor info here..." 
                className="min-h-[300px] font-mono text-sm rounded-2xl bg-muted/20 focus:bg-white transition-colors"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleParse} 
              disabled={isAnalyzing}
              className="w-full h-14 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg gap-2"
            >
              {isAnalyzing ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> AI Processing & De-duplicating...</>
              ) : (
                <><Wand2 className="h-5 w-5" /> Analyze Data</>
              )}
            </Button>
          </CardContent>
        </Card>

        {duplicatesCount > 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Duplicate Detection</AlertTitle>
            <AlertDescription>
              We found <strong>{duplicatesCount}</strong> records that already exist in your system. These have been automatically excluded from the import list to keep your data clean.
            </AlertDescription>
          </Alert>
        )}

        {preview.length > 0 && (
          <Card className="border-green-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Clean Data Preview</CardTitle>
                <CardDescription>Ready to import {preview.length} unique records.</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                Verified Data
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="border rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Blood</th>
                      <th className="px-4 py-2 text-left">Location (District & Area)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {preview.slice(0, 20).map((d, i) => (
                      <tr key={i} className={d.wasCorrected ? "bg-amber-50/30" : ""}>
                        <td className="px-4 py-2 font-medium">{d.fullName}</td>
                        <td className="px-4 py-2 font-mono text-xs">{d.phone}</td>
                        <td className="px-4 py-2 font-bold text-primary">{d.bloodType}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              {d.district}
                              {d.wasCorrected && (
                                <Badge variant="outline" className="h-4 text-[9px] bg-amber-50 text-amber-700 border-amber-200 py-0 px-1">
                                  <Sparkles className="h-2 w-2 mr-1" /> AI Corrected
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{d.area || 'N/A'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {preview.length > 20 && (
                      <tr className="bg-muted/30">
                        <td colSpan={4} className="px-4 py-2 text-center italic text-muted-foreground">
                          ... and {preview.length - 20} more records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-green-50/50 pt-6">
              <Button onClick={handleImport} disabled={isSubmitting} className="w-full h-16 bg-green-600 hover:bg-green-700 rounded-2xl text-xl font-bold shadow-lg shadow-green-200">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Updating Google Sheets...
                  </>
                ) : (
                  <>Complete Import <CheckCircle2 className="ml-2 h-6 w-6" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
