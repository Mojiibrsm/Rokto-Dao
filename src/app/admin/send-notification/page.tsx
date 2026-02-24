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
        title: "ব্যর্থ হয়েছে",
        description: "মেসেজ জেনারেট করা সম্ভব হয়নি।"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      // Modern way
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result.message);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = result.message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      toast({
        title: "কপি হয়েছে!",
        description: "মেসেজটি ক্লিপবোর্ডে কপি করা হয়েছে।"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: "দুঃখিত, লেখাটি কপি করা সম্ভব হয়নি।"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">নোটিফিকেশন জেনারেটর</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-6 w-6 text-primary" />
              অনুরোধের বিস্তারিত
            </CardTitle>
            <CardDescription>
              রক্তদাতার জন্য একটি পারসোনালাইজড মেসেজ তৈরি করতে নিচের ফর্মটি পূরণ করুন।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">দাতার নাম (সম্বোধনের জন্য)</Label>
                <Input 
                  id="donorName" 
                  value={formData.donorName} 
                  onChange={e => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                  placeholder="যেমন: আকবর হোসেন"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>প্রয়োজনীয় গ্রুপ</Label>
                  <Select onValueChange={val => setFormData(prev => ({ ...prev, bloodType: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="সিলেক্ট" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName">রোগীর তথ্য/কেস</Label>
                  <Input 
                    id="patientName" 
                    value={formData.patientName} 
                    onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="যেমন: থ্যালাসেমিয়া রোগী"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">হাসপাতালের নাম</Label>
                <Input 
                  id="hospital" 
                  value={formData.hospitalName} 
                  onChange={e => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
                  placeholder="যেমন: ঢাকা মেডিকেল কলেজ"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">স্থান (এলাকা)</Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="যেমন: শাহবাগ, ঢাকা"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">যোগাযোগের নম্বর</Label>
                  <Input 
                    id="contact" 
                    value={formData.contactPhone} 
                    onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    জেনারেট হচ্ছে...
                  </>
                ) : (
                  <>
                    মেসেজ তৈরি করুন <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>মেসেজ প্রিভিউ</CardTitle>
            <CardDescription>
              মেসেজটি কপি করে এসএমএস বা হোয়াটসঅ্যাপে পাঠান।
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
                  className="absolute top-2 right-2 bg-primary text-white hover:bg-primary/90 shadow-lg"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-muted/20 rounded-xl border-2 border-dashed">
                <BellRing className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground">তথ্য পূরণ করে বাটনটি ক্লিক করলে এখানে মেসেজ দেখা যাবে।</p>
              </div>
            )}
          </CardContent>
          {result && (
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => setResult(null)}>
                নতুন মেসেজ তৈরি করুন
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
