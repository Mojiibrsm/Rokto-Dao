'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Search, Users, 
  CheckCircle, Phone, Share2, Clock, Loader2, 
  Smartphone, HandHeart, 
  Globe, Zap, Quote, Award, Activity,
  Info, MessageSquare, ExternalLink, ChevronDown, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBloodRequests, getDonors, type BloodRequest, type Donor } from '@/lib/sheets';
import { DISTRICTS } from '@/lib/bangladesh-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [selectedBloodType, setSelectedBloodType] = useState<string>('যেকোনো গ্রুপ');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('যেকোনো জেলা');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoadingRequests(true);
      setLoadingDonors(true);
      try {
        const [requestsData, donorsData] = await Promise.all([
          getBloodRequests(),
          getDonors()
        ]);
        setRequests(requestsData.slice(0, 4));
        setDonors(donorsData.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRequests(false);
        setLoadingDonors(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBloodType !== 'যেকোনো গ্রুপ') params.set('bloodType', selectedBloodType);
    if (selectedDistrict !== 'যেকোনো জেলা') params.set('district', selectedDistrict);
    router.push(`/donors?${params.toString()}`);
  };

  const handleShare = async (req: BloodRequest) => {
    const shareText = `🚨 জরুরী রক্তের অনুরোধ (Blood Request) 🚨

🩸 রক্তের গ্রুপ: *${req.bloodType}*
👤 রোগী: ${req.patientName}
🩺 রোগ: ${req.disease || 'উল্লেখ নেই'}${req.diseaseInfo ? ` (${req.diseaseInfo})` : ''}
🏥 হাসপাতাল: ${req.hospitalName}
📍 স্থান: ${req.area ? req.area + ', ' : ''}${req.district}
🎒 রক্তের পরিমাণ: ${req.bagsNeeded} ব্যাগ
⏰ কখন প্রয়োজন: ${req.neededWhen}
📞 যোগাযোগ করুন: ${req.phone}

🙏 রক্ত দিয়ে জীবন বাঁচাতে এগিয়ে আসুন। শেয়ার করে অন্যদের জানাবেন।
🔗 RoktoDao - মানবতার সেবায় আপনার পাশে।`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast({
        title: "কপি হয়েছে!",
        description: "রক্তের অনুরোধটি শেয়ার করার জন্য ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "ব্যর্থ হয়েছে",
        description: "লেখাটি কপি করা সম্ভব হয়নি।",
      });
    }
  };

  const bloodCompatibility = [
    { type: 'A+', give: 'A+, AB+', take: 'A+, A-, O+, O-' },
    { type: 'O+', give: 'O+, A+, B+, AB+', take: 'O+, O-' },
    { type: 'B+', give: 'B+, AB+', take: 'B+, B-, O+, O-' },
    { type: 'AB+', give: 'AB+ Only', take: 'সব গ্রুপ (Universal Receiver)' },
    { type: 'A-', give: 'A+, A-, AB+, AB-', take: 'A-, O-' },
    { type: 'O-', give: 'সব গ্রুপ (Universal Donor)', take: 'O- Only' },
    { type: 'B-', give: 'B+, B-, AB+, AB-', take: 'B-, O-' },
    { type: 'AB-', give: 'AB+, AB-', take: 'AB-, A-, B-, O-' },
  ];

  return (
    <div className="flex flex-col gap-0 pb-0 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative w-full py-16 md:py-24 flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden border-b border-primary/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto relative z-10 max-w-5xl space-y-8">
          <Badge variant="outline" className="text-primary border-primary px-4 py-1.5 uppercase tracking-widest font-black text-[10px] bg-primary/5 rounded-full">স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচান</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-primary font-headline leading-tight">আপনার নিকটবর্তী <br />রক্তদাতা খুঁজুন</h1>
            <p className="text-lg md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto font-medium">সারা বাংলাদেশে জরুরি মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।</p>
          </div>
          
          <div className="max-w-3xl mx-auto pt-6">
            <div className="bg-white p-3 rounded-[2rem] shadow-2xl border border-primary/10 flex flex-col md:row gap-2">
              <div className="flex flex-col md:flex-row flex-1 divide-y md:divide-y-0 md:divide-x divide-border/50">
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase text-left mb-1">রক্তের গ্রুপ</label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-base font-bold text-foreground p-0">
                      <div className="flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-primary" />
                        <SelectValue placeholder="রক্তের গ্রুপ" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 px-4 py-2">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase text-left mb-1">জেলা</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-base font-bold text-foreground p-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <SelectValue placeholder="জেলা" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                      {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSearch} className="h-14 md:h-full px-10 bg-primary hover:bg-primary/90 rounded-2xl shrink-0 shadow-lg shadow-primary/20 transition-all font-bold text-xl">
                <Search className="mr-2 h-6 w-6" /> অনুসন্ধান করুন
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary", bg: "bg-primary/5" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600", bg: "bg-green-50" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-[2rem] hover:bg-muted/30 transition-all group">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-headline mb-1">{stat.val}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Process Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1 rounded-full">কীভাবে কাজ করে</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">রক্তদান প্রক্রিয়া মাত্র ৩ ধাপে</h2>
            <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { id: "1", title: "নিবন্ধন", desc: "আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী দেশব্যাপী ডেটাবেজে যুক্ত হোন।", icon: UserPlus },
              { id: "2", title: "অনুরোধ বা অনুসন্ধান", desc: "জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।", icon: Search },
              { id: "3", title: "জীবন বাঁচান", desc: "হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুম্মুর্ষু রোগীর প্রাণ বাঁচান।", icon: HeartPulse }
            ].map((step, i) => (
              <Card key={i} className="relative p-8 rounded-[2.5rem] border-none shadow-xl bg-white hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
                <div className="absolute -top-4 -right-4 text-9xl font-black text-muted/10 group-hover:text-primary/5 transition-colors">{step.id}</div>
                <div className="relative z-10 space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    {i === 0 ? <Users className="h-8 w-8" /> : i === 1 ? <Search className="h-8 w-8" /> : <Heart className="h-8 w-8" />}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Active Donors Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-lg text-muted-foreground font-medium">"Our active and available donors"</p>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4"></div>
          </div>
          {loadingDonors ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] group border-t-4 border-t-primary/20 bg-muted/5">
                  <CardHeader className="bg-primary/5 pb-4 pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-3">{(donor.fullName || 'D').substring(0, 1)}</div>
                        <div className="space-y-0.5">
                          <CardTitle className="text-xl font-bold">{donor.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-1.5 text-sm font-medium"><MapPin className="h-4 w-4 text-primary" /> {donor.area ? donor.area + ', ' : ''}{donor.district}</CardDescription>
                          {donor.organization && <div className="flex items-center gap-1.5 text-secondary font-bold text-[10px] bg-secondary/5 px-2 py-0.5 rounded-md border border-secondary/10 w-fit mt-1"><Users className="h-3 w-3" /> {donor.organization}</div>}
                        </div>
                      </div>
                      <Badge className="bg-primary text-white text-xl font-black h-12 w-12 flex items-center justify-center p-0 rounded-2xl shadow-md">{donor.bloodType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {donor.totalDonations && donor.totalDonations > 0 ? (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-white rounded-2xl border shadow-sm">
                          <p className="text-muted-foreground uppercase text-[9px] font-black mb-1">শেষ রক্তদান</p>
                          <p className="font-bold text-sm text-foreground">{donor.lastDonationDate || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border shadow-sm">
                          <p className="text-muted-foreground uppercase text-[9px] font-black mb-1">মোট রক্তদান</p>
                          <p className="font-bold text-sm text-foreground">{donor.totalDonations} বার</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-3 rounded-2xl border border-green-100 w-fit"><ShieldCheck className="h-5 w-5" /> ভেরিফাইড রক্তদাতা</div>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 border-t">
                    <Button className="w-full h-14 rounded-none bg-primary hover:bg-primary/90 text-lg font-bold gap-3 transition-all" asChild>
                      <a href={`tel:${donor.phone}`}><Phone className="h-5 w-5" /> যোগাযোগ করুন</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center"><Button size="lg" className="rounded-full px-12 h-14 text-xl border-primary text-primary hover:bg-primary hover:text-white bg-transparent font-bold border-2 transition-all" asChild><NextLink href="/donors">সব রক্তদাতা দেখুন <ArrowRight className="ml-2 h-5 w-5" /></NextLink></Button></div>
        </div>
      </section>

      {/* 5. Requests Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold font-headline flex items-center gap-4 justify-center md:justify-start">
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-primary"></span>
                </span>
                সরাসরি অনুরোধসমূহ
              </h2>
              <p className="text-muted-foreground text-lg font-medium">জরুরি ভিত্তিতে যাদের রক্তের প্রয়োজন।</p>
            </div>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-bold border-primary text-primary hover:bg-primary/5" asChild><NextLink href="/requests">সব অনুরোধ দেখুন <ArrowRight className="ml-2 h-4 w-4" /></NextLink></Button>
          </div>
          {loadingRequests ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] bg-white group border">
                  <div className={`h-2 ${req.isUrgent ? 'bg-primary' : 'bg-slate-800'}`}></div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{req.patientName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 font-medium text-base text-muted-foreground"><MapPin className="h-5 w-5 text-primary" /> {req.hospitalName}</CardDescription>
                      </div>
                      <Badge className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white text-xs uppercase font-black py-1 px-4 h-8 rounded-full shadow-lg`}>{req.isUrgent ? 'জরুরি' : 'Approved'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-4">
                    {req.disease && (
                      <div className="flex items-center gap-3 mb-4 text-base font-bold text-muted-foreground bg-muted/40 p-3 rounded-2xl border border-primary/5">
                        <Activity className="h-5 w-5 text-secondary" />
                        <span>রোগ: {req.disease}{req.diseaseInfo ? ` (${req.diseaseInfo})` : ''}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 py-5 border-y border-dashed my-4">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-wider">গ্রুপ</p>
                        <p className="text-3xl font-black text-primary">{req.bloodType}</p>
                      </div>
                      <div className="text-center border-x">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-wider">ব্যাগ</p>
                        <p className="text-3xl font-black text-foreground">{req.bagsNeeded}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-wider">কখন</p>
                        <p className="text-base font-bold text-foreground truncate px-1">{req.neededWhen}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-2xl h-14 gap-3 text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-95" asChild>
                        <a href={`tel:${req.phone}`}><Phone className="h-5 w-5" /> যোগাযোগ করুন</a>
                      </Button>
                      <Button onClick={() => handleShare(req)} variant="secondary" size="icon" className="h-14 w-14 rounded-2xl hover:bg-muted transition-all shadow-md">
                        <Share2 className="h-6 w-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Donate Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] lg:h-[600px] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
              <Image 
                src={PlaceHolderImages.find(img => img.id === 'why-donate')?.imageUrl || "https://picsum.photos/seed/benefits/800/600"} 
                fill 
                alt="রক্তদানের স্বাস্থ্য উপকারিতা" 
                className="object-cover" 
                data-ai-hint="blood donation benefits" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-none px-4 py-1">উপকারিতা</Badge>
                <h2 className="text-4xl md:text-6xl font-bold font-headline leading-tight">কেন রক্ত দেবেন?</h2>
                <p className="text-muted-foreground text-xl italic font-medium">১টি রক্তদান ৩ জন মানুষের প্রাণ বাঁচাতে পারে!</p>
              </div>
              <div className="grid gap-6">
                {[
                  { title: "হার্টের স্বাস্থ্য ভালো রাখে", desc: "রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে, যা হৃদরোগের ঝুঁকি কমায়।", icon: Heart },
                  { title: "নতুন রক্তকণিকা তৈরি", desc: "রক্ত দেওয়ার পর শরীর নতুন রক্তকণিকা তৈরি করে, যা আপনাকে আরও সতেজ রাখে।", icon: Zap },
                  { title: "বিনামূল্যে স্বাস্থ্য পরীক্ষা", desc: "রক্তদানের সময় আপনার হিমোগ্লোবিন, রক্তচাপ ও অন্যান্য পরীক্ষা বিনামূল্যে করা হয়।", icon: ShieldCheck },
                  { title: "মানসিক প্রশান্তি", desc: "কারো জীবন বাঁচানোর চেয়ে বড় মানসিক তৃপ্তি আর কিছু হতে পারে না।", icon: Award }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-primary/10">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3"><item.icon className="h-7 w-7 text-primary" /></div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-full px-12 h-14 text-xl font-bold bg-primary shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95" asChild>
                <NextLink href="/register">রক্তদাতা হতে চাই</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Eligibility Quiz Banner (Premium Dark) */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-slate-950 rounded-[3.5rem] p-10 md:p-20 overflow-hidden relative group border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-10 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black font-headline text-white leading-[1.1]">
                আপনি কি আজ রক্তদান করতে পারবেন?
              </h2>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
                আমাদের AI ভিত্তিক কুইজের মাধ্যমে মাত্র ১ মিনিটে আপনার শারীরিক যোগ্যতা যাচাই করুন।
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-16 px-12 rounded-full text-2xl font-bold gap-4 group shadow-[0_20px_50px_rgba(211,29,42,0.3)] transition-all active:scale-95" asChild>
                <NextLink href="/eligibility">
                  আমার যোগ্যতা যাচাই করুন <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
                </NextLink>
              </Button>
            </div>
            
            <div className="relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)] border-[8px] border-white/5 group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                <Image 
                  src={PlaceHolderImages.find(img => img.id === 'can-you-donate')?.imageUrl || "https://picsum.photos/seed/eligibility/600/800"} 
                  fill 
                  alt="Can You Donate Blood Today?" 
                  className="object-cover"
                  data-ai-hint="blood donor"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Blood Compatibility Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1">রক্তের গ্রুপের সামঞ্জস্যতা</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">রক্তের গ্রুপ ও সামঞ্জস্যতা</h2>
            <p className="text-xl text-muted-foreground">জেনে নিন আপনি কাকে রক্ত দিতে পারবেন এবং কার থেকে নিতে পারবেন।</p>
          </div>
          <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl border-t-8 border-t-primary">
            <Table>
              <TableHeader className="bg-primary text-white">
                <TableRow className="hover:bg-primary border-none">
                  <TableHead className="text-white font-bold h-16 text-lg">রক্তের গ্রুপ</TableHead>
                  <TableHead className="text-white font-bold h-16 text-lg">রক্ত দিতে পারবেন</TableHead>
                  <TableHead className="text-white font-bold h-16 text-lg">রক্ত নিতে পারবেন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodCompatibility.map((row, i) => (
                  <TableRow key={i} className="hover:bg-primary/5 h-16 text-base border-b border-muted">
                    <TableCell className="font-black text-primary text-xl">{row.type}</TableCell>
                    <TableCell className="font-medium text-slate-700">{row.give}</TableCell>
                    <TableCell className="font-medium text-slate-700">{row.take}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* 9. Founder's Message */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <div className="inline-flex h-16 w-16 bg-primary/10 rounded-3xl items-center justify-center text-primary mb-2">
                <Quote className="h-8 w-8 fill-primary" />
              </div>
              <h2 className="text-4xl font-bold font-headline tracking-tight">পরিচালকের বার্তা</h2>
              <p className="text-2xl md:text-3xl font-medium text-slate-700 leading-relaxed italic">
                "RoktoDao একটি অলাভজনক উদ্যোগ যা রক্তদাতা এবং গ্রহীতাদের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্যে কাজ করে। প্রযুক্তি ব্যবহার করে জীবন বাঁচানোর এই যাত্রায় আমাদের সঙ্গী হওয়ার জন্য আপনাকে ধন্যবাদ।"
              </p>
              <div className="flex items-center gap-5 pt-4">
                <div className="h-20 w-20 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
                  <Image src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" fill alt="Mujibur Rahman" className="object-cover" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-primary">মুজিবুর রহমান</h4>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">প্রতিষ্ঠাতা ও পরিচালক, RoktoDao</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] opacity-50"></div>
              <div className="relative h-[450px] w-full max-w-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white">
                <Image src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" fill alt="Mujibur Rahman" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <Badge className="bg-green-100 text-green-700 border-none px-4 py-1">প্রেরণা</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">রক্তদাতাদের কথা</h2>
            <div className="h-1.5 w-20 bg-green-500 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { name: "রাসেল আহমেদ", role: "১০ বার রক্তদাতা", text: "রক্তদান করলে মনের মধ্যে যে অদ্ভুত এক প্রশান্তি আসে, তা আর কিছুতে পাই না। RoktoDao এর মাধ্যমে যোগাযোগ করা এখন অনেক সহজ।", initial: "র" },
              { name: "সুমাইয়া জান্নাত", role: "শিক্ষার্থী", text: "প্রথমবার রক্ত দেওয়ার সময় ভয় লেগেছিল, কিন্তু একজনের প্রাণ বাঁচাতে পেরেছি জেনে এখন নিয়মিত রক্ত দেই।", initial: "স" },
              { name: "ডা. আরিফ হাসান", role: "সহযোগী অধ্যাপক", text: "একজন চিকিৎসক হিসেবে আমি জানি রক্ত কতটা মূল্যবান। RoktoDao এর এই উদ্যোগ সত্যিই প্রশংসনীয়।", initial: "ড" }
            ].map((t, i) => (
              <Card key={i} className="p-8 rounded-[2.5rem] border-none shadow-xl bg-slate-50 hover:bg-white transition-all duration-500 group text-center space-y-6">
                <div className="h-16 w-16 bg-white shadow-md rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">{t.initial}</div>
                <p className="text-lg text-slate-600 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <h4 className="text-xl font-bold">{t.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Gallery Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <Badge className="bg-primary/10 text-primary border-none px-4 py-1">আমাদের কার্যক্রম</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">আমাদের গ্যালারি</h2>
            <p className="text-lg text-muted-foreground">আমাদের সাম্প্রতিক ব্লাড ড্রাইভ ও ক্যাম্পেইনের কিছু মুহূর্ত।</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-xl hover:scale-105 transition-transform duration-500 cursor-pointer group">
                <Image src={`https://picsum.photos/seed/camp${i}/600/800`} fill alt={`Camp ${i}`} className="object-cover" data-ai-hint="blood donation camp" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 p-3 rounded-full text-primary shadow-lg"><ExternalLink className="h-6 w-6" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Mobile App Promo */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 overflow-hidden relative text-white border border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50"></div>
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-10 text-center lg:text-left">
              <Badge className="bg-primary hover:bg-primary border-none text-sm px-6 py-1 rounded-full">শীঘ্রই আসছে</Badge>
              <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">RoktoDao মোবাইল অ্যাপ</h2>
              <p className="text-xl md:text-2xl text-slate-400 max-w-xl leading-relaxed">
                এখন পকেটেই থাকবে আপনার এলাকার সব রক্তদাতার তথ্য। জরুরি নোটিফিকেশন ও দ্রুত যোগাযোগের জন্য আমাদের অ্যাপটি হবে আপনার সেরা সঙ্গী।
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl flex items-center gap-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                  <div className="bg-primary p-2 rounded-xl"><Smartphone className="h-8 w-8" /></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Download on</p>
                    <p className="text-xl font-bold">Google Play</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl flex items-center gap-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                  <div className="bg-slate-700 p-2 rounded-xl"><Smartphone className="h-8 w-8" /></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Coming to</p>
                    <p className="text-xl font-bold">App Store</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[600px] flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[320px] h-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-[12px] border-slate-800 rounded-[3rem] overflow-hidden">
                <Image src={PlaceHolderImages.find(img => img.id === 'mobile-app-promo')?.imageUrl || "https://picsum.photos/seed/app/600/1200"} fill alt="RoktoDao Mobile App Promo" className="object-cover" data-ai-hint="mobile app" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Partners Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-8">আমাদের সহযোগী প্রতিষ্ঠানসমূহ</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 grayscale opacity-50 hover:grayscale-0 transition-all">
              {['ঢাকা মেডিকেল', 'রেড ক্রিসেন্ট', 'বঙ্গবন্ধু মেডিকেল', 'ব্লাড ফাউন্ডেশন', 'বেসরকারি ক্লিনিক'].map((p, i) => (
                <div key={i} className="text-2xl md:text-3xl font-black font-headline text-slate-400 hover:text-primary transition-colors cursor-default">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 14. Why Choose Us Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold font-headline">কেন RoktoDao বেছে নিবেন?</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "যাচাইকৃত রক্তদাতা", desc: "আমাদের সকল রক্তদাতা মোবাইল নম্বর ভেরিফাইড, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।", icon: CheckCircle2 },
              { title: "দ্রুত যোগাযোগ", desc: "সরাসরি ফোন কল বা মেসেজের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।", icon: Zap },
              { title: "দেশব্যাপী নেটওয়ার্ক", desc: "সারাদেশে প্রতিটি জেলা ও উপজেলায় আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত।", icon: Globe },
              { title: "সম্পূর্ণ সুরক্ষিত", desc: "আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা কোনো তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না।", icon: ShieldCheck }
            ].map((item, i) => (
              <Card key={i} className="p-8 rounded-[2.5rem] border-none shadow-lg bg-white text-center hover:-translate-y-2 transition-all duration-500">
                <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                  <item.icon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 space-y-3">
            <Badge className="bg-secondary/10 text-secondary border-none px-4 py-1">সহযোগিতা</Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">সাধারণ জিজ্ঞাসা</h2>
            <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full mt-4"></div>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "রক্তদানের জন্য আপনার বয়স ১৮-৬০ বছর এবং ওজন কমপক্ষে ৫০ কেজি হতে হবে।" },
              { q: "কারা রক্তদান করতে পারবেন না?", a: "গর্ভবতী মহিলা, সম্প্রতি বড় কোনো অস্ত্রোপচার হওয়া ব্যক্তি এবং কিছু ছোঁয়াচে রোগে আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না। বিস্তারিত জানতে যোগ্যতা যাচাই কুইজটি দিন।" },
              { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস অন্তর এবং একজন সুস্থ মহিলা প্রতি ৪ মাস অন্তর রক্তদান করতে পারেন।" },
              { q: "রক্ত দিতে কি কোনো টাকা লাগে?", a: "না, রক্তদান একটি সম্পূর্ণ স্বেচ্ছাসেবী ও মানবিক কাজ। রক্ত দেওয়া বা নেওয়ার জন্য কোনো অর্থ লেনদেন আমাদের প্ল্যাটফর্মে নিষিদ্ধ।" },
              { q: "রক্তদানের পর কি কোনো বিশ্রাম প্রয়োজন?", a: "হ্যাঁ, রক্তদানের পর অন্তত ১৫-২০ মিনিট বিশ্রাম নেওয়া এবং প্রচুর পানি পান করা প্রয়োজন।" }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none shadow-md rounded-[1.5rem] bg-slate-50 px-6 overflow-hidden">
                <AccordionTrigger className="text-lg font-bold hover:no-underline py-6">{item.q}</AccordionTrigger>
                <AccordionContent className="text-base text-slate-600 pb-6 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 16. Newsletter Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-center text-white space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-black/5"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold font-headline">আপডেট থাকতে চান?</h2>
            <p className="text-xl opacity-90 leading-relaxed font-medium">
              আমাদের আগামী রক্তদান ক্যাম্পেইন ও গুরুত্বপূর্ণ খবরাখবর ইমেইলে পেতে সাবস্ক্রাইব করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল ঠিকানা" 
                className="flex-1 h-14 rounded-2xl px-8 bg-white/10 border border-white/20 text-white placeholder:text-white/60 outline-none focus:bg-white/20 transition-all text-lg"
              />
              <Button className="h-14 rounded-2xl px-10 bg-white text-primary hover:bg-slate-100 text-lg font-bold shadow-xl">সাবস্ক্রাইব</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 17. Emergency Help Footer Section */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 space-y-8">
          <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
            <Phone className="h-10 w-10 text-primary" />
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">জরুরি কোনো সাহায্য প্রয়োজন?</h2>
            <p className="text-xl text-slate-400">আমাদের হেল্পলাইন নম্বরে কল করুন সরাসরি সাহায্যের জন্য।</p>
            <a href="tel:+8801600151907" className="text-4xl md:text-6xl font-black text-primary block hover:scale-105 transition-transform">+8801600151907</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Fixed missing icon imports
import { UserPlus, HeartPulse } from 'lucide-react';