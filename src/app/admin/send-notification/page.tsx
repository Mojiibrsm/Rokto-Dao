'use client';

import { useState } from 'react';
import { generateNotification, type NotificationOutput } from '@/ai/flows/urgent-notification-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BellRing, Copy, Check, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SendNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NotificationOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    donorName: '',
    patientName: '',
    bloodType: '',
    hospitalName: '',
    contactPhone: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const output = await generateNotification(formData);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate notification message."
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.message);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Notification text copied to clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Notification Generator</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-6 w-6 text-primary" />
              Request Details
            </CardTitle>
            <CardDescription>
              Fill in the request details to generate a personalized Bengali message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Donor Name (Personalization)</Label>
                <Input 
                  id="donorName" 
                  value={formData.donorName} 
                  onChange={e => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                  placeholder="e.g. Akbar Hossain"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Required Blood</Label>
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
                  <Label htmlFor="patientName">Patient/Case</Label>
                  <Input 
                    id="patientName" 
                    value={formData.patientName} 
                    onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="e.g. Surgery patient"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital Name</Label>
                <Input 
                  id="hospital" 
                  value={formData.hospitalName} 
                  onChange={e => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                  placeholder="e.g. Dhaka Medical College"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Area)</Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Shahbag, Dhaka"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Phone</Label>
                  <Input 
                    id="contact" 
                    value={formData.contactPhone} 
                    onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg bg-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Bengali Message <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Preview Notification</CardTitle>
            <CardDescription>
              Copy the generated message to send via SMS or WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            {result ? (
              <div className="relative flex-grow bg-muted/50 p-6 rounded-xl border-2 border-dashed border-primary/20">
                <p className="text-lg leading-relaxed whitespace-pre-wrap font-body">
                  {result.message}
                </p>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-muted/20 rounded-xl border-2 border-dashed">
                <BellRing className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground">Fill the form and click generate to see the message here.</p>
              </div>
            )}
          </CardContent>
          {result && (
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => setResult(null)}>
                Clear and New
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
