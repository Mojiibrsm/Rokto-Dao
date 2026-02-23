
'use client';

import { useState } from 'react';
import { checkDonorEligibility, type DonorEligibilityCheckOutput } from '@/ai/flows/donor-eligibility-check-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle, CheckCircle2, ClipboardCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EligibilityPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DonorEligibilityCheckOutput | null>(null);
  const [formData, setFormData] = useState({
    age: 25,
    weightLbs: 150,
    feltSickRecently: false,
    takingMedications: false,
    receivedTattooOrPiercing: false,
    traveledToMalariaRiskArea: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const output = await checkDonorEligibility(formData);
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">রক্তদানের যোগ্যতা যাচাই</h1>
      </div>

      {!result ? (
        <Card className="border-t-4 border-t-secondary shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-secondary" />
              দ্রুত যাচাইকরণ
            </CardTitle>
            <CardDescription>
              রক্তদানের প্রাথমিক যোগ্যতার জন্য এই প্রশ্নগুলোর উত্তর দিন (AI ভিত্তিক)।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">বয়স (বছর)</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">ওজন (কেজি)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    value={formData.weightLbs / 2.2} // Converting to KG for display if needed
                    onChange={e => setFormData(prev => ({ ...prev, weightLbs: parseInt(e.target.value) * 2.2 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="sick" className="flex-1 cursor-pointer">সম্প্রতি অসুস্থ বোধ করেছেন? (গত ৭ দিন)</Label>
                  <Switch 
                    id="sick" 
                    checked={formData.feltSickRecently} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, feltSickRecently: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="meds" className="flex-1 cursor-pointer">কোনো প্রেসক্রিপশন ওষুধ খাচ্ছেন?</Label>
                  <Switch 
                    id="meds" 
                    checked={formData.takingMedications} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, takingMedications: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="tattoo" className="flex-1 cursor-pointer">ট্যাটু বা পিয়ার্সিং করেছেন? (গত ৪ মাস)</Label>
                  <Switch 
                    id="tattoo" 
                    checked={formData.receivedTattooOrPiercing} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, receivedTattooOrPiercing: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="travel" className="flex-1 cursor-pointer">ম্যালেরিয়া ঝুকিপূর্ণ এলাকায় ভ্রমণ করেছেন? (৩ বছর)</Label>
                  <Switch 
                    id="travel" 
                    checked={formData.traveledToMalariaRiskArea} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, traveledToMalariaRiskArea: val }))}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg bg-secondary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    যাচাই করা হচ্ছে...
                  </>
                ) : 'আমার যোগ্যতা যাচাই করুন'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className={`border-t-4 shadow-xl ${result.isEligible ? 'border-t-green-500' : 'border-t-amber-500'}`}>
          <CardHeader className="text-center">
            <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${result.isEligible ? 'bg-green-100' : 'bg-amber-100'}`}>
              {result.isEligible ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <AlertCircle className="h-10 w-10 text-amber-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {result.isEligible ? 'আপনি রক্তদান করতে পারেন!' : 'পর্যবেক্ষণ প্রয়োজন'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">{result.reason}</p>
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-left">
              <strong>বিঃদ্রঃ:</strong> এটি একটি প্রাথমিক AI ভিত্তিক মূল্যায়ন। রক্তদান কেন্দ্রে একজন পেশাদার চিকিৎসক দ্বারা আপনার চূড়ান্ত শারীরিক পরীক্ষা করা হবে।
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {result.isEligible && (
              <Button asChild className="w-full bg-primary h-12 text-lg">
                <Link href="/drives">রক্তদাতার তালিকা দেখুন</Link>
              </Button>
            )}
            <Button variant="outline" className="w-full h-12" onClick={() => setResult(null)}>
              আবার শুরু করুন
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
