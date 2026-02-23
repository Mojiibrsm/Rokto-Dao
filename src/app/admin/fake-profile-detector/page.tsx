'use client';

import { useState } from 'react';
import { analyzeProfile, type FakeProfileOutput } from '@/ai/flows/fake-profile-detector-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ShieldAlert, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function FakeProfileDetectorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FakeProfileOutput | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bloodType: '',
    age: 25,
    weightKg: 65,
    lastDonationDate: '',
    district: '',
    area: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const output = await analyzeProfile(formData);
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Fake Profile Detector (Admin)</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-amber-600" />
              Donor Profile Analysis
            </CardTitle>
            <CardDescription>
              Enter donor details to evaluate if the profile is potentially fake using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName} 
                    onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter donor name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select onValueChange={val => setFormData(prev => ({ ...prev, bloodType: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number"
                    value={formData.age} 
                    onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number"
                    value={formData.weightKg} 
                    onChange={e => setFormData(prev => ({ ...prev, weightKg: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input 
                    id="district" 
                    value={formData.district} 
                    onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    placeholder="e.g. Dhaka"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area/Upazila</Label>
                  <Input 
                    id="area" 
                    value={formData.area} 
                    onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    placeholder="e.g. Shahbag"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastDonation">Last Donation Date (if any)</Label>
                <Input 
                  id="lastDonation" 
                  type="date"
                  value={formData.lastDonationDate} 
                  onChange={e => setFormData(prev => ({ ...prev, lastDonationDate: e.target.value }))}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : 'Analyze Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-t-4 ${result.riskScore > 50 ? 'border-t-red-500' : 'border-t-green-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analysis Results</span>
                {result.isSuspicious ? (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                )}
              </CardTitle>
              <CardDescription>
                AI-driven probability of this profile being illegitimate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Risk Score</span>
                  <span>{result.riskScore}%</span>
                </div>
                <Progress value={result.riskScore} className={`h-2 ${result.riskScore > 50 ? 'bg-red-100' : 'bg-green-100'}`} />
              </div>
              
              <div className="p-4 bg-muted rounded-lg border">
                <h4 className="font-bold mb-2">AI Analysis:</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setResult(null)}>
                Clear and Check Another
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
