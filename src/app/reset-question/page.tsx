'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplet, User, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
import { DISTRICTS } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';

export default function ResetQuestionPage() {
  const [user, setUser] = useState<any>(null);
  const [resetData, setResetData] = useState({
    fullName: '',
    bloodType: '',
    district: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const data = sessionStorage.getItem('roktodao_reset_user');
    if (!data) {
      router.push('/forgot');
      return;
    }
    setUser(JSON.parse(data));
  }, [router]);

  const handleSecurityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let correctCount = 0;
    if (resetData.fullName.toLowerCase().trim() === user.fullName.toLowerCase().trim()) correctCount++;
    if (resetData.bloodType === user.bloodType) correctCount++;
    if (resetData.district === user.district) correctCount++;

    if (correctCount >= 2) {
      router.push('/reset-password');
    } else {
      toast({
        variant: "destructive",
        title: "তথ্য মেলেনি",
        description: "কমপক্ষে ২টি তথ্য সঠিক হতে হবে। আবার চেষ্টা করুন।"
      });
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 pb-8 pt-10">
          <CardTitle className="text-2xl font-black font-headline">সিকিউরিটি প্রশ্ন</CardTitle>
          <CardDescription className="text-sm font-bold">নিচের ৩টি তথ্যের মধ্যে যেকোনো ২টি সঠিক হলে আপনি পাসওয়ার্ড রিসেট করতে পারবেন।</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          <form onSubmit={handleSecurityCheck} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-xs font-bold text-primary flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> নিবন্ধন করার সময় আপনি যে তথ্যগুলো দিয়েছিলেন সেগুলো এখানে লিখুন।
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="h-4 w-4" /> আপনার পুরো নাম</Label>
              <Input placeholder="নিবন্ধনকৃত নাম" value={resetData.fullName} onChange={e => setResetData({...resetData, fullName: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Droplet className="h-4 w-4" /> রক্তের গ্রুপ</Label>
              <Select value={resetData.bloodType} onValueChange={v => setResetData({...resetData, bloodType: v})}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="গ্রুপ নির্বাচন করুন" /></SelectTrigger>
                <SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> আপনার জেলা</Label>
              <Select value={resetData.district} onValueChange={v => setResetData({...resetData, district: v})}>
                <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="জেলা নির্বাচন করুন" /></SelectTrigger>
                <SelectContent className="max-h-[300px]">{DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl">তথ্য যাচাই করুন</Button>
            <Button variant="ghost" onClick={() => router.push('/forgot/method')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}