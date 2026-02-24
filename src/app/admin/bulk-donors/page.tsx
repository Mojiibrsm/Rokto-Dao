'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bulkRegisterDonors } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Users, FileJson, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BulkDonorsPage() {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const handleParse = () => {
    try {
      // Logic to parse CSV-like or Tab-separated data
      const lines = inputText.trim().split('\n');
      if (lines.length === 0 || inputText.trim() === '') {
        toast({ variant: "destructive", title: "No data found", description: "Please enter donor information." });
        return;
      }

      const parsed = lines.map(line => {
        // Splitting by tab or comma
        const parts = line.split(/[,\t]/);
        return {
          fullName: parts[0]?.trim() || '',
          phone: parts[1]?.trim() || '',
          bloodType: parts[2]?.trim() || '',
          district: parts[3]?.trim() || '',
          email: parts[4]?.trim() || '', // Email is optional
        };
      }).filter(d => d.fullName && d.phone); // Minimum requirement: Name and Phone

      setPreview(parsed);
      
      if (parsed.length === 0) {
        toast({ variant: "destructive", title: "Parsing failed", description: "Make sure to follow the format: Name, Phone, BloodType, District" });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Parsing error", description: "Could not process the input text." });
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
          description: `${result.count} donors have been added to the system.`,
        });
        router.push('/admin');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "An error occurred while saving to Google Sheets.",
      });
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
                <CardDescription>Paste donor list from Excel or Sheets. Format: Name, Phone, Blood Group, District</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 font-bold">How to use:</AlertTitle>
              <AlertDescription className="text-blue-700">
                Paste your data row by row. Example:<br />
                <code className="text-xs font-mono bg-white/50 p-1 rounded">Alex, 01711223344, A+, Dhaka, alex@mail.com</code><br />
                <code className="text-xs font-mono bg-white/50 p-1 rounded">Rahim, 01888776655, O+, Khulna</code>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="bulkData">Donor List (CSV or Tab separated)</Label>
              <Textarea 
                id="bulkData" 
                placeholder="Name, Phone, Blood, District..." 
                className="min-h-[250px] font-mono text-sm rounded-2xl bg-muted/20"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
            </div>

            <Button onClick={handleParse} className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold">
              Analyze Data <FileJson className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {preview.length > 0 && (
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Preview Data</CardTitle>
                <CardDescription>We found {preview.length} valid entries.</CardDescription>
              </div>
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="border rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Blood</th>
                      <th className="px-4 py-2 text-left">District</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {preview.slice(0, 10).map((d, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2">{d.fullName}</td>
                        <td className="px-4 py-2">{d.phone}</td>
                        <td className="px-4 py-2 font-bold">{d.bloodType}</td>
                        <td className="px-4 py-2">{d.district}</td>
                      </tr>
                    ))}
                    {preview.length > 10 && (
                      <tr className="bg-muted/30">
                        <td colSpan={4} className="px-4 py-2 text-center italic text-muted-foreground">
                          ... and {preview.length - 10} more rows.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-green-50/50 pt-6">
              <Button onClick={handleImport} disabled={isSubmitting} className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-2xl text-xl font-bold">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Importing to Database...
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