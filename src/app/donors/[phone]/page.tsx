'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Phone, MapPin, Droplet, ShieldCheck, 
  ArrowLeft, Share2, Users, CheckCircle2, Info, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDonorByPhone, type Donor } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const DonorMap = dynamic(() => import('@/components/donor-map'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-2xl" />
});

/**
 * @fileOverview Individual public donor profile page.
 * Displays profile image and stats with a focused map.
 */

export default function DonorProfilePage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = use(params);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadDonor() {
      try {
        const data = await getDonorByPhone(phone);
        setDonor(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDonor();
  }, [phone]);

  const handleShare = async () => {
    if (!donor) return;
    const shareText = `🩸 রক্তদাতা প্রোফাইল 🩸\n\n👤 নাম: ${donor.fullName}\n💉 রক্তের গ্রুপ: *${donor.bloodType}*\n📍 এলাকা: ${donor.area ? donor.area + ', ' : ''}${donor.district}\n📞 ফোন: ${donor.phone}\n\n🙏 জরুরি প্রয়োজনে যোগাযোগ করুন।\n🔗 RoktoDao - মানবতার সেবায় আপনার পাশে।\nhttps://roktodao.pro.bd/donors/${donor.phone}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast({ title: "কপি হয়েছে!", description: "প্রোফাইল লিংক শেয়ার করার জন্য কপি করা হয়েছে।" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold">দুঃখিত! এই রক্তদাতার তথ্য পাওয়া যায়নি।</h1>
        <Button asChild className="rounded-xl bg-primary">
          <Link href="/donors"><ArrowLeft className="mr-2 h-4 w-4" /> তালিকায় ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/donors"><ArrowLeft className="mr-2 h-4 w-4" /> সব রক্তদাতা</Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-t-8 border-t-primary shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="bg-primary/5 p-10 flex flex-col items-center text-center gap-6">
              <div className="h-32 w-32 rounded-3xl bg-primary flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-primary/20 rotate-3 overflow-hidden relative">
                {donor.imageUrl ? (
                  <Image src={donor.imageUrl} fill alt={donor.fullName} className="object-cover -rotate-3 scale-110" />
                ) : (
                  donor.fullName.substring(0, 1)
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black font-headline leading-tight">{donor.fullName}</h1>
                <p className="text-muted-foreground font-bold mt-1">{donor.phone}</p>
              </div>
              <Badge className="bg-primary text-white text-3xl font-black h-20 w-20 flex items-center justify-center rounded-2xl shadow-xl border-4 border-white">
                {donor.bloodType}
              </Badge>
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-green-600 font-black text-sm bg-green-50 p-4 rounded-2xl border border-green-100">
                <ShieldCheck className="h-6 w-6" /> ভেরিফাইড রক্তদাতা
              </div>
              <Button onClick={handleShare} variant="outline" className="w-full h-12 rounded-xl font-bold border-2 gap-2">
                <Share2 className="h-4 w-4" /> প্রোফাইল শেয়ার করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-lg bg-slate-900 text-white p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> সরাসরি কল করুন
            </h3>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl text-xl font-black gap-3" asChild>
              <a href={`tel:${donor.phone}`}><Phone className="h-6 w-6" /> {donor.phone}</a>
            </Button>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-xl rounded-[2.5rem] border-none overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 pb-6 pt-8 px-10">
              <CardTitle className="text-2xl font-black">রক্তদাতার বিস্তারিত</CardTitle>
              <CardDescription>ডোনারের অবস্থান এবং রক্তদানের পরিসংখ্যান।</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-black text-primary uppercase tracking-widest">বর্তমান অবস্থান</p>
                  <div className="flex items-center gap-3 text-lg font-bold">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{donor.area ? donor.area + ', ' : ''}{donor.district}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-black text-primary uppercase tracking-widest">সংগঠন / টিম</p>
                  <div className="flex items-center gap-3 text-lg font-bold">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{donor.organization || 'কোনো সংগঠন নেই'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                <div className="p-6 rounded-3xl bg-accent/30 text-center space-y-1">
                  <p className="text-[11px] font-black text-muted-foreground uppercase">মোট রক্তদান</p>
                  <p className="text-4xl font-black text-primary">{donor.totalDonations || 0} বার</p>
                </div>
                <div className="p-6 rounded-3xl bg-accent/30 text-center space-y-1">
                  <p className="text-[11px] font-black text-muted-foreground uppercase">শেষ রক্তদান</p>
                  <p className="text-lg font-black">{donor.lastDonationDate || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                   <MapPin className="h-5 w-5 text-primary" /> এলাকা মানচিত্র
                </h4>
                <div className="h-[300px] w-full rounded-3xl overflow-hidden border-2 shadow-inner">
                  <DonorMap donors={[donor]} />
                </div>
              </div>

              <div className="p-8 bg-muted/30 rounded-[2.5rem] border-2 border-dashed">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" /> রক্তদান কেন জরুরি?
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  রক্তদান করলে শরীরে নতুন রক্তকণিকা তৈরি হয় এবং হৃদরোগের ঝুঁকি কমে। আপনার ১ ব্যাগ রক্ত ৩ জন মুমূর্ষু রোগীর প্রাণ বাঁচাতে পারে। আজই রক্তদান করে মানবতার পাশে দাঁড়ান।
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
             <Button className="flex-1 h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xl font-bold" asChild>
                <a href={`sms:${donor.phone}?body=আসসালামু আলাইকুম, RoktoDao থেকে আপনার নম্বরটি পেয়েছি। আমার জরুরি রক্ত প্রয়োজন। আপনি কি রক্ত দিতে পারবেন?`}>
                  <MessageSquare className="mr-3 h-6 w-6" /> এসএমএস দিন
                </a>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
