'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  Phone, MapPin, Droplet, ShieldCheck, 
  ArrowLeft, Share2, Users, CheckCircle2, Info, MessageSquare, Loader2, ShieldAlert, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDonorByPhone, sendMessage, submitReport, type Donor } from '@/lib/sheets';
import { useToast } from '@/hooks/use-toast';
import { normalizePhone } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DonorMap = dynamic(() => import('@/components/donor-map'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-2xl" />
});

// WhatsApp Icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.506-.173-.005-.371-.007-.57-.007-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.216 1.36.186 1.871.11.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function DonorProfilePage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = use(params);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMessaging, setIsMessaging] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Fake Profile');
  const [reportDetails, setReportDetails] = useState('');
  const { toast } = useToast();
  const router = useRouter();

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

  const handleStartChat = async () => {
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser) {
      toast({ title: "লগইন প্রয়োজন", description: "মেসেজ দিতে হলে আগে লগইন করুন।" });
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    if (user.phone === phone) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "আপনি নিজেকে মেসেজ দিতে পারবেন না।" });
      return;
    }

    setIsMessaging(true);
    try {
      const res = await sendMessage(user.phone, phone, "আসসালামু আলাইকুম, আমি আপনার সাথে যোগাযোগ করতে চাই।");
      if (res.success) {
        router.push(`/messages/${res.convoId}`);
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    } finally {
      setIsMessaging(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser) {
      toast({ title: "লগইন প্রয়োজন", description: "রিপোর্ট করতে আগে লগইন করুন।" });
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    
    setIsReporting(true);
    try {
      const res = await submitReport({
        type: 'Donor',
        targetId: phone,
        targetName: donor?.fullName || 'Unknown Donor',
        reporterPhone: user.phone,
        reason: reportReason,
        details: reportDetails
      });
      if (res.success) {
        toast({ title: "রিপোর্ট জমা হয়েছে", description: "আমরা আপনার রিপোর্টটি পর্যালোচনা করে ব্যবস্থা নেব।" });
        setReportDialogOpen(false);
        setReportDetails('');
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    } finally {
      setIsReporting(false);
    }
  };

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

  const cleanPhone = normalizePhone(donor.phone);
  const waLink = `https://wa.me/880${cleanPhone}?text=আসসালামু আলাইকুম, আমি RoktoDao থেকে আপনার সাথে রক্তদানের বিষয়ে যোগাযোগ করছি।`;
  const smsLink = `sms:+880${cleanPhone}?body=আসসালামু আলাইকুম, আমি RoktoDao থেকে আপনার সাথে রক্তদানের বিষয়ে যোগাযোগ করছি।`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/donors"><ArrowLeft className="mr-2 h-4 w-4" /> সব রক্তদাতা</Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 border-red-200 hover:bg-red-50 font-bold rounded-xl gap-2"
          onClick={() => setReportDialogOpen(true)}
        >
          <AlertTriangle className="h-4 w-4" /> রিপোর্ট করুন
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-t-8 border-t-primary shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="bg-primary/5 p-10 flex flex-col items-center text-center gap-6">
              <div className="h-32 w-32 rounded-3xl bg-primary text-white flex items-center justify-center text-5xl font-black shadow-xl shadow-primary/20 rotate-3 overflow-hidden relative">
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
              <Button onClick={handleStartChat} disabled={isMessaging} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-lg font-bold gap-3">
                {isMessaging ? <Loader2 className="animate-spin" /> : <><MessageSquare className="h-5 w-5" /> সরাসরি মেসেজ দিন</>}
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full h-12 rounded-xl font-bold border-2 gap-2">
                <Share2 className="h-4 w-4" /> প্রোফাইল শেয়ার করুন
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-lg bg-slate-900 text-white p-6 space-y-4">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> সরাসরি যোগাযোগ
            </h3>
            
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl text-xl font-black gap-3 shadow-xl shadow-primary/20" asChild>
              <a href={`tel:${donor.phone}`}><Phone className="h-6 w-6" /> কল করুন</a>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-green-500/50 bg-green-500/5 text-green-500 hover:bg-green-500 hover:text-white transition-all font-bold gap-2" asChild>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-6 w-6" /> WhatsApp
                </a>
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-blue-500/50 bg-blue-500/5 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold gap-2" asChild>
                <a href={smsLink}>
                  <MessageSquare className="h-6 w-6" /> SMS
                </a>
              </Button>
            </div>
          </Card>
        </div>

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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-red-600" /> রিপোর্ট করুন
            </DialogTitle>
            <DialogDescription className="font-bold">
              কেন এই ডোনার প্রোফাইলটি রিপোর্ট করছেন? আমাদের বিস্তারিত জানান।
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="font-bold">রিপোর্টের ধরণ</Label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fake Profile">ফেক প্রোফাইল (ভুয়া তথ্য)</SelectItem>
                  <SelectItem value="Inappropriate Content">অশোভন ছবি বা লেখা</SelectItem>
                  <SelectItem value="Spam/Harassment">হ্যারাসমেন্ট বা বিরক্ত করা</SelectItem>
                  <SelectItem value="Asking for Money">টাকা দাবি করা (রক্তের বিনিময়ে)</SelectItem>
                  <SelectItem value="Other">অন্যান্য</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold">বিস্তারিত বর্ণনা</Label>
              <Textarea 
                value={reportDetails} 
                onChange={e => setReportDetails(e.target.value)}
                placeholder="এখানে বিস্তারিত লিখুন..." 
                className="rounded-xl min-h-[100px]"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setReportDialogOpen(false)}>বাতিল</Button>
              <Button type="submit" disabled={isReporting} className="bg-red-600 hover:bg-red-700 font-bold rounded-xl h-12 px-8">
                {isReporting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ShieldAlert className="h-4 w-4 mr-2" />}
                রিপোর্ট পাঠান
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
