'use client';

import { useState } from 'react';
import { createBloodDrive } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, CalendarCheck, MapPin, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ManageDrivesPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '10:00 AM - 4:00 PM',
    distance: '0 km'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBloodDrive(formData);
      toast({
        title: "ড্রাইভ সফলভাবে যোগ হয়েছে!",
        description: "নতুন রক্তদান ক্যাম্পেইনটি এখন লাইভ দেখা যাবে।",
      });
      router.push('/admin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: "ক্যাম্পেইনটি সেভ করা যায়নি। আবার চেষ্টা করুন।"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">নতুন ব্লাড ড্রাইভ যোগ করুন</h1>
      </div>

      <Card className="shadow-xl rounded-3xl border-t-8 border-t-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-green-600" />
            ড্রাইভের তথ্য
          </CardTitle>
          <CardDescription>
            আসন্ন রক্তদান ক্যাম্পেইন বা ক্যাম্পের বিস্তারিত তথ্য দিন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">ক্যাম্পেইনের নাম *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="যেমন: শাহবাগ গণ-রক্তদান ক্যাম্প"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">স্থান/ঠিকানা *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  className="pl-10"
                  value={formData.location} 
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="যেমন: ঢাকা মেডিকেল কলেজ প্রাঙ্গণ"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">তারিখ *</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={formData.date} 
                  onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">সময়</Label>
                <Input 
                  id="time" 
                  value={formData.time} 
                  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-xl bg-green-600 hover:bg-green-700 rounded-2xl gap-2" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Plus className="h-5 w-5" /> ড্রাইভ পাবলিশ করুন</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
