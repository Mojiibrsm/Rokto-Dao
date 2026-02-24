'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplet, Loader2, ArrowRight, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getDonors } from '@/lib/sheets';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Can be email or phone
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const donors = await getDonors();
      const user = donors.find((d: any) => 
        d.email?.toLowerCase() === identifier.toLowerCase() || 
        d.phone?.toString() === identifier.toString()
      );

      if (user) {
        localStorage.setItem('roktodao_user', JSON.stringify({
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          bloodType: user.bloodType
        }));
        
        toast({
          title: "লগইন সফল!",
          description: `স্বাগতম, ${user.fullName}`,
        });
        
        window.dispatchEvent(new Event('storage'));
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "লগইন ব্যর্থ",
          description: "এই ইমেইল বা ফোন নম্বরটি আমাদের সিস্টেমে পাওয়া যায়নি।",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Droplet className="h-8 w-8 text-primary fill-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">লগইন করুন</CardTitle>
          <CardDescription>আপনার নিবন্ধিত ফোন নম্বর অথবা ইমেইল দিয়ে প্রবেশ করুন।</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">ইমেইল বা ফোন নম্বর</Label>
              <div className="relative">
                <Input 
                  id="identifier" 
                  placeholder="01XXXXXXXXX / example@mail.com" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required 
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-40">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs">/</span>
                  <Mail className="h-4 w-4" />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg bg-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>প্রবেশ করুন <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 py-6 rounded-b-3xl">
          <p className="text-sm text-muted-foreground">
            আপনার একাউন্ট নেই? <Link href="/register" className="text-primary font-bold">নতুন একাউন্ট খুলুন</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}