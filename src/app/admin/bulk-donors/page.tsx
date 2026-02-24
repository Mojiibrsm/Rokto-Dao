'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bulkRegisterDonors } from '@/lib/sheets';
import { correctLocations } from '@/ai/flows/location-correction-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Users, FileJson, CheckCircle2, AlertTriangle, Info, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function BulkDonorsPage() {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const handleParse = async () => {
    if (inputText.trim() === '') {
      toast({ variant: "destructive", title: "No data found", description: "Please enter donor information." });
      return;
    }

    setIsAnalyzing(true);
    try {
      const lines = inputText.trim().split('\n');
      const parsed = lines.map(line => {
        const parts = line.split(/[,\t]/);
        return {
          fullName: parts[0]?.trim() || '',
          phone: parts[1]?.trim() || '',
          bloodType: parts[2]?.trim() || '',
          district: parts[3]?.trim() || '',
          email: parts[4]?.trim() || '',
        };
      }).filter(d => d.fullName && d.phone);

      if (parsed.length === 0) {
        toast({ variant: "destructive", title: "Parsing failed", description: "Format: Name, Phone, BloodType, District" });
        setIsAnalyzing(false);
        return;
      }

      // AI Correction Step
      const uniqueRawDistricts = Array.from(new Set(parsed.map(d => d.district).filter(Boolean)));
      if (uniqueRawDistricts.length > 0) {
        const { corrections } = await correctLocations({ rawLocations: uniqueRawDistricts });
        
        // Apply corrections to the parsed data
        const correctedData = parsed.map(donor => {
          const match = corrections.find(c => c.original === donor.district);
          return {
            ...donor,
            district: match ? match.corrected : donor.district,
            wasCorrected: match ? match.isChanged : false
          };
        });
        setPreview(correctedData);
      } else {
        setPreview(parsed);
      }

      toast({
        title: "Analysis Complete",
        description: `Successfully parsed ${parsed.length} records. AI standardizing locations.`,
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
          description: `${result.count} donors have been added.`,
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
        <h1 className="text-3xl font-bold font-headline">Bulk Donor Import</h1>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-xl rounded-3xl overflow-hidden border-t-8 border-t-purple-600">
          <CardHeader className="bg-purple-50/50">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <CardTitle>Batch Donor Upload</CardTitle>
                <CardDescription>
                  Paste list from Excel or Sheets. 
                  <span className="text-primary font-bold ml-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI will auto-correct district names.
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 font-bold">Format Guide:</AlertTitle>
              <AlertDescription className="text-blue-700">
                Name, Phone, Blood, District (e.g. Alex, 01711223344, A+, Dhaka)<br />
                <span className="text-xs italic">*AI can handle English or misspelled districts like 'Daka' or 'Sylet'.</span>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="bulkData">Donor List (CSV or Tab separated)</Label>
              <Textarea 
                id="bulkData" 
                placeholder="Name, Phone, Blood, District..." 
                className="min-h-[250px] font-mono text-sm rounded-2xl bg-muted/20 focus:bg-white transition-colors"
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
                <><Loader2 className="h-5 w-5 animate-spin" /> AI Analyzing Data...</>
              ) : (
                <><Wand2 className="h-5 w-5" /> Analyze & AI Correct Data</>
              )}
            </Button>
          </CardContent>
        </Card>

        {preview.length > 0 && (
          <Card className="border-green-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Preview & Verification</CardTitle>
                <CardDescription>Found {preview.length} valid entries. Check AI corrections below.</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                Ready to Import
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
                      <th className="px-4 py-2 text-left">District (AI Standardized)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {preview.slice(0, 15).map((d, i) => (
                      <tr key={i} className={d.wasCorrected ? "bg-amber-50/30" : ""}>
                        <td className="px-4 py-2 font-medium">{d.fullName}</td>
                        <td className="px-4 py-2 font-mono text-xs">{d.phone}</td>
                        <td className="px-4 py-2 font-bold text-primary">{d.bloodType}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {d.district}
                            {d.wasCorrected && (
                              <Badge variant="outline" className="h-5 text-[10px] bg-amber-50 text-amber-700 border-amber-200 py-0 px-1">
                                <Sparkles className="h-2 w-2 mr-1" /> Corrected
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {preview.length > 15 && (
                      <tr className="bg-muted/30">
                        <td colSpan={4} className="px-4 py-2 text-center italic text-muted-foreground">
                          ... and {preview.length - 15} more rows.
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
                    Saving to Google Sheets...
                  </>
                ) : (
                  <>Start Bulk Import <CheckCircle2 className="ml-2 h-6 w-6" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
