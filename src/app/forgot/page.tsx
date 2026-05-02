'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, ArrowRight, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getDonors } from '@/lib/sheets';
import { normalizePhone } from '@/lib/utils';

export default function ForgotPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const donors = await getDonors();
      const inputId = identifier.trim().toLowerCase();
      const inputPhone = normalizePhone(identifier);
      
      const user = donors.find((d: any) => {
        if (d.email?.toLowerCase() === inputId) return true;
        return inputPhone && normalizePhone(d.phone) === inputPhone;
      });

      if (user) {
        // Save user data to session storage for the reset flow
        sessionStorage.setItem('roktodao_reset_user', JSON.stringify(user));
        router.push('/forgot/method');
      } else {
        toast({
          variant: "destructive",
          title: "ইউজার পাওয়া যায়নি",
          description: "এই তথ্যটি আমাদের সিস্টেমে নিবন্ধিত নেই।",
        });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <Droplet className="h-10 w-10 text-white fill-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline">অ্যাকাউন্ট খুঁজুন</CardTitle>
          <CardDescription className="text-base">পাসওয়ার্ড রিসেট করতে আপনার ইমেইল বা ফোন নম্বর দিন।</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          <form onSubmit={handleCheckAccount} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="identifier" className="text-lg font-bold">ইমেইল বা ফোন নম্বর</Label>
              <div className="relative">
                <Input 
                  id="identifier" 
                  placeholder="01XXXXXXXXX" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-14 rounded-2xl pl-12 text-lg border-2 focus:border-primary"
                  required 
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                  <Phone className="h-5 w-5" />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full h-14 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <>পরবর্তী ধাপ <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login"><ArrowLeft className="h-4 w-4 mr-2" /> লগইনে ফিরে যান</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}