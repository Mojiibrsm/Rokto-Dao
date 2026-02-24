'use client';

import { useState } from 'react';
import { checkDonorEligibility, type DonorEligibilityCheckOutput } from '@/ai/flows/donor-eligibility-check-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertCircle, CheckCircle2, ClipboardCheck, ArrowLeft, Info, HeartPulse } from 'lucide-react';
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
    additionalNotes: '',
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
        <Card className="border-t-4 border-t-secondary shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/10">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-secondary" />
              দ্রুত যাচাইকরণ
            </CardTitle>
            <CardDescription>
              রক্তদানের প্রাথমিক যোগ্যতার জন্য এই প্রশ্নগুলোর উত্তর দিন। আমাদের AI ডাক্তার আপনার উত্তরগুলো বিশ্লেষণ করবে।
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">বয়স (বছর)</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">ওজন (কেজি)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    value={Math.round(formData.weightLbs / 2.20462)} 
                    onChange={e => setFormData(prev => ({ ...prev, weightLbs: (parseInt(e.target.value) || 0) * 2.20462 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'sick', label: 'সম্প্রতি অসুস্থ বোধ করেছেন? (গত ৭ দিন)', key: 'feltSickRecently' },
                  { id: 'meds', label: 'কোনো প্রেসক্রিপশন ওষুধ খাচ্ছেন?', key: 'takingMedications' },
                  { id: 'tattoo', label: 'ট্যাটু বা পিয়ার্সিং করেছেন? (গত ৪ মাস)', key: 'receivedTattooOrPiercing' },
                  { id: 'travel', label: 'ম্যালেরিয়া প্রবণ এলাকায় ভ্রমণ করেছেন? (৩ বছর)', key: 'traveledToMalariaRiskArea' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <Label htmlFor={item.id} className="flex-1 cursor-pointer font-medium">{item.label}</Label>
                    <Switch 
                      id={item.id} 
                      checked={(formData as any)[item.key]} 
                      onCheckedChange={val => setFormData(prev => ({ ...prev, [item.key]: val }))}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">অতিরিক্ত তথ্য বা কোনো রোগ (যদি থাকে)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="যেমন: ডায়াবেটিস, রক্তচাপ বা অন্য কোনো শারীরিক সমস্যা..."
                  className="rounded-2xl min-h-[100px]"
                  value={formData.additionalNotes}
                  onChange={e => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full h-14 text-xl bg-secondary hover:bg-secondary/90 rounded-2xl shadow-lg shadow-secondary/20" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    AI বিশ্লেষণ করছে...
                  </>
                ) : 'আমার যোগ্যতা যাচাই করুন'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className={`border-t-8 shadow-2xl rounded-[2.5rem] overflow-hidden ${result.isEligible ? 'border-t-green-500' : 'border-t-amber-500'}`}>
          <CardHeader className="text-center pt-10">
            <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 shadow-lg ${result.isEligible ? 'bg-green-100' : 'bg-amber-100'}`}>
              {result.isEligible ? (
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              ) : (
                <AlertCircle className="h-12 w-12 text-amber-600" />
              )}
            </div>
            <CardTitle className="text-3xl font-black">
              {result.isEligible ? 'আপনি রক্তদান করতে পারেন!' : 'পর্যবেক্ষণ প্রয়োজন'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-8">
            <div className="text-center">
              <p className="text-xl text-muted-foreground leading-relaxed italic">"{result.reason}"</p>
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-primary" /> আপনার জন্য পরামর্শ:
                </h4>
                <div className="grid gap-3">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-muted/30 rounded-2xl border border-primary/5">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="font-medium">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 bg-primary/5 rounded-2xl text-sm text-muted-foreground flex gap-3 border border-primary/10">
              <Info className="h-5 w-5 text-primary shrink-0" />
              <p>
                <strong>বিঃদ্রঃ:</strong> এটি একটি প্রাথমিক AI ভিত্তিক মূল্যায়ন। রক্তদান কেন্দ্রে একজন পেশাদার চিকিৎসক দ্বারা আপনার চূড়ান্ত শারীরিক পরীক্ষা করা হবে।
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-8 bg-muted/10">
            {result.isEligible && (
              <Button asChild className="w-full bg-primary h-14 text-xl font-bold rounded-2xl">
                <Link href="/donors">রক্তদাতার তালিকা দেখুন</Link>
              </Button>
            )}
            <Button variant="outline" className="w-full h-14 text-lg rounded-2xl" onClick={() => setResult(null)}>
              আবার শুরু করুন
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
