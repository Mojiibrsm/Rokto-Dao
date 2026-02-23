
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
        <h1 className="text-3xl font-bold font-headline">Eligibility Checker</h1>
      </div>

      {!result ? (
        <Card className="border-t-4 border-t-secondary shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-secondary" />
              Quick Assessment
            </CardTitle>
            <CardDescription>
              Answer these questions for a preliminary AI-powered determination of your eligibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    value={formData.weightLbs} 
                    onChange={e => setFormData(prev => ({ ...prev, weightLbs: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="sick" className="flex-1 cursor-pointer">Felt sick recently (last 7 days)?</Label>
                  <Switch 
                    id="sick" 
                    checked={formData.feltSickRecently} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, feltSickRecently: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="meds" className="flex-1 cursor-pointer">Taking prescription medications?</Label>
                  <Switch 
                    id="meds" 
                    checked={formData.takingMedications} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, takingMedications: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="tattoo" className="flex-1 cursor-pointer">New tattoo or piercing (last 4 months)?</Label>
                  <Switch 
                    id="tattoo" 
                    checked={formData.receivedTattooOrPiercing} 
                    onCheckedChange={val => setFormData(prev => ({ ...prev, receivedTattooOrPiercing: val }))}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <Label htmlFor="travel" className="flex-1 cursor-pointer">Traveled to malaria-risk area (3 yrs)?</Label>
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
                    Checking Eligibility...
                  </>
                ) : 'Check My Eligibility'}
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
              {result.isEligible ? 'You appear eligible!' : 'Review Required'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">{result.reason}</p>
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-left">
              <strong>Note:</strong> This is a preliminary assessment powered by AI. A final determination will be made by a medical professional at the donation site during your full screening.
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {result.isEligible && (
              <Button asChild className="w-full bg-primary h-12 text-lg">
                <Link href="/drives">Schedule an Appointment</Link>
              </Button>
            )}
            <Button variant="outline" className="w-full h-12" onClick={() => setResult(null)}>
              Start Over
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
