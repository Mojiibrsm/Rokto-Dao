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
  Info, MessageSquare, ExternalLink, ChevronDown, CheckCircle2,
  UserPlus, HeartPulse, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBloodRequests, getDonors, getGallery, type BloodRequest, type Donor, type GalleryItem } from '@/lib/sheets';
import { DISTRICTS } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [selectedBloodType, setSelectedBloodType] = useState<string>('যেকোনো গ্রুপ');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('যেকোনো জেলা');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoadingRequests(true);
      setLoadingDonors(true);
      setLoadingGallery(true);
      try {
        const [requestsData, donorsData, galleryData] = await Promise.all([
          getBloodRequests(),
          getDonors(),
          getGallery()
        ]);
        setRequests(requestsData.slice(0, 4));
        setDonors(donorsData.slice(0, 6));
        setGalleryItems(galleryData.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRequests(false);
        setLoadingDonors(false);
        setLoadingGallery(false);
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
    const diseasePart = req.disease ? `\n🩺 রোগ: ${req.disease}${req.diseaseInfo ? ` (${req.diseaseInfo})` : ''}` : '';
    const shareText = `🚨 জরুরী রক্তের অনুরোধ (Blood Request) 🚨\n\n🩸 রক্তের গ্রুপ: *${req.bloodType}*\n👤 রোগী: ${req.patientName || 'নাম প্রকাশে অনিচ্ছুক'}${diseasePart}\n🏥 হাসপাতাল: ${req.hospitalName}\n📍 স্থান: ${req.area ? req.area + ', ' : ''}${req.district}\n🎒 রক্তের পরিমাণ: ${req.bagsNeeded} ব্যাগ\n⏰ কখন প্রয়োজন: ${req.neededWhen}\n📞 যোগাযোগ করুন: ${req.phone}\n\n🙏 রক্ত দিয়ে জীবন বাঁচাতে এগিয়ে আসুন। শেয়ার করে অন্যদের জানাবেন।\n🔗 RoktoDao - মানবতার সেবায় আপনার পাশে।`;

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
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center bg-accent/30 text-center px-4 overflow-hidden border-b-4 border-primary/10">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] opacity-40"></div>
        
        <div className="container mx-auto relative z-10 max-w-5xl space-y-10">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-primary/20 px-6 py-2 rounded-full shadow-md animate-bounce">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="text-primary font-black uppercase tracking-widest text-[12px]">স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচান</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-primary font-headline leading-tight drop-shadow-sm">
              আপনার নিকটবর্তী <br /><span className="text-foreground">রক্তদাতা খুঁজুন</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-bold leading-relaxed">
              সারা বাংলাদেশে জরুরি মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto pt-8">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border-4 border-primary/10 flex flex-col md:row gap-4">
              <div className="flex flex-col md:flex-row flex-1 divide-y md:divide-y-0 md:divide-x-2 divide-primary/5">
                <div className="flex-1 px-6 py-3">
                  <label className="block text-[11px] font-black text-primary uppercase text-left mb-2 tracking-wider">রক্তের গ্রুপ</label>
                  <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                    <SelectTrigger className="h-12 border-none bg-accent/50 rounded-xl focus:ring-2 focus:ring-primary text-lg font-black text-foreground px-4">
                      <div className="flex items-center gap-3">
                        <Droplet className="h-6 w-6 text-primary fill-primary" />
                        <SelectValue placeholder="রক্তের গ্রুপ" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="যেকোনো গ্রুপ" className="font-bold">যেকোনো গ্রুপ</SelectItem>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                        <SelectItem key={g} value={g} className="font-bold">{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 px-6 py-3">
                  <label className="block text-[11px] font-black text-primary uppercase text-left mb-2 tracking-wider">আপনার জেলা</label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="h-12 border-none bg-accent/50 rounded-xl focus:ring-2 focus:ring-primary text-lg font-black text-foreground px-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-primary" />
                        <SelectValue placeholder="জেলা নির্বাচন করুন" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="যেকোনো জেলা" className="font-bold">যেকোনো জেলা</SelectItem>
                      {DISTRICTS.map(d => (
                        <SelectItem key={d} value={d} className="font-bold">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSearch} className="h-16 md:h-auto px-12 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/30 transition-all font-black text-2xl gap-3">
                <Search className="h-7 w-7" /> অনুসন্ধান
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white py-16 border-b-2 border-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary", bg: "bg-primary/5" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600", bg: "bg-green-50" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-accent/20 hover:bg-primary/5 transition-all duration-500 group border-2 border-transparent hover:border-primary/10">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-md ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl md:text-5xl font-black font-headline mb-2 text-foreground">{stat.val}</div>
                <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Process Section */}
      <section className="py-24 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <Badge className="bg-primary text-white border-none px-6 py-1.5 rounded-full text-sm font-black shadow-lg">রক্তদান প্রক্রিয়া</Badge>
            <h2 className="text-4xl md:text-6xl font-black font-headline">মাত্র ৩টি সহজ ধাপে</h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full mt-6 shadow-sm"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { id: "1", title: "নিবন্ধন", desc: "আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী দেশব্যাপী ডেটাবেজে যুক্ত হোন।", icon: UserPlus },
              { id: "2", title: "অনুরোধ বা অনুসন্ধান", desc: "জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।", icon: Search },
              { id: "3", title: "জীবন বাঁচান", desc: "হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুম্মুর্ষু রোগীর প্রাণ বাঁচান।", icon: HeartPulse }
            ].map((step, i) => (
              <Card key={i} className="relative p-10 rounded-[3rem] border-none shadow-2xl bg-white hover:-translate-y-3 transition-all duration-500 overflow-hidden group">
                <div className="absolute -top-6 -right-6 text-[10rem] font-black text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">{step.id}</div>
                <div className="relative z-10 space-y-6">
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <step.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-xl leading-relaxed font-medium">{step.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Active Donors Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-xl text-muted-foreground font-bold italic opacity-70">"নিঃস্বার্থভাবে জীবন বাঁচানোর কারিগর"</p>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full mt-6"></div>
          </div>
          {loadingDonors ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-16 w-16 text-primary" /></div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-2 border-primary/5 shadow-xl hover:shadow-primary/10 transition-all rounded-[2.5rem] group bg-accent/5">
                  <CardHeader className="bg-primary/5 pb-6 pt-8 px-8">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">{(donor.fullName || 'D').substring(0, 1)}</div>
                        <div className="space-y-1">
                          <CardTitle className="text-2xl font-black text-foreground">{donor.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-2 text-base font-bold text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> {donor.area ? donor.area + ', ' : ''}{donor.district}</CardDescription>
                          {donor.organization && <div className="flex items-center gap-2 text-primary font-black text-[11px] bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit mt-2 uppercase tracking-tighter"><Users className="h-3 w-3" /> {donor.organization}</div>}
                        </div>
                      </div>
                      <Badge className="bg-primary text-white text-2xl font-black h-14 w-14 flex items-center justify-center p-0 rounded-2xl shadow-xl border-4 border-white">{donor.bloodType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 px-8 space-y-6">
                    {donor.totalDonations && donor.totalDonations > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-white rounded-3xl border-2 border-primary/5 shadow-sm text-center">
                          <p className="text-primary uppercase text-[10px] font-black mb-2 tracking-widest">শেষ রক্তদান</p>
                          <p className="font-black text-lg text-foreground">{donor.lastDonationDate || 'N/A'}</p>
                        </div>
                        <div className="p-5 bg-white rounded-3xl border-2 border-primary/5 shadow-sm text-center">
                          <p className="text-primary uppercase text-[10px] font-black mb-2 tracking-widest">মোট রক্তদান</p>
                          <p className="font-black text-3xl text-primary">{donor.totalDonations} বার</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-primary font-black text-base bg-white px-6 py-4 rounded-2xl border-2 border-primary/10 w-full shadow-sm"><ShieldCheck className="h-6 w-6 text-green-600" /> ভেরিফাইড রক্তদাতা</div>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 mt-4">
                    <Button className="w-full h-16 rounded-none bg-primary hover:bg-secondary text-xl font-black gap-4 transition-all" asChild>
                      <a href={`tel:${donor.phone}`}><Phone className="h-6 w-6" /> যোগাযোগ করুন</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center">
            <Button size="lg" className="rounded-full px-16 h-16 text-2xl bg-white border-4 border-primary text-primary hover:bg-primary hover:text-white font-black transition-all shadow-xl shadow-primary/10" asChild>
              <NextLink href="/donors">সব রক্তদাতা দেখুন <ArrowRight className="ml-3 h-7 w-7" /></NextLink>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Requests Section */}
      <section className="bg-primary/5 py-24 border-y-4 border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black font-headline text-foreground flex items-center gap-6 justify-center md:justify-start">
                <span className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-primary"></span>
                </span>
                জরুরী অনুরোধসমূহ
              </h2>
              <p className="text-xl text-muted-foreground font-bold">এখনই যাদের রক্ত প্রয়োজন — একটি শেয়ার বাঁচাতে পারে একটি প্রাণ।</p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-secondary text-white rounded-full px-10 h-14 text-xl font-black shadow-2xl shadow-primary/30 gap-3" asChild>
              <NextLink href="/requests">সব অনুরোধ দেখুন <ArrowRight className="h-6 w-6" /></NextLink>
            </Button>
          </div>
          
          {loadingRequests ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-16 w-16 text-primary" /></div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-primary/20 transition-all rounded-[3.5rem] bg-white group">
                  <div className={`h-4 ${req.isUrgent ? 'bg-primary animate-pulse' : 'bg-slate-800'}`}></div>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-3xl font-black group-hover:text-primary transition-colors">{req.patientName || 'নাম প্রকাশে অনিচ্ছুক'}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 font-bold text-lg text-muted-foreground leading-snug">
                          <MapPin className="h-6 w-6 text-primary shrink-0" /> {req.hospitalName}
                        </CardDescription>
                      </div>
                      <Badge className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white text-sm uppercase font-black py-2 px-6 h-10 rounded-full shadow-lg`}>
                        {req.isUrgent ? 'জরুরি' : 'Approved'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-10">
                    {req.disease && (
                      <div className="flex items-center gap-4 mb-6 text-lg font-bold text-primary bg-primary/5 p-5 rounded-3xl border-2 border-primary/10">
                        <Activity className="h-7 w-7 text-primary" />
                        <span>রোগ: {req.disease}{req.diseaseInfo ? ` (${req.diseaseInfo})` : ''}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-6 py-8 border-y-4 border-dashed border-accent my-6">
                      <div className="text-center">
                        <p className="text-[11px] uppercase font-black text-muted-foreground mb-2 tracking-[0.2em]">রক্তের গ্রুপ</p>
                        <p className="text-5xl font-black text-primary drop-shadow-sm">{req.bloodType}</p>
                      </div>
                      <div className="text-center border-x-4 border-accent px-4">
                        <p className="text-[11px] uppercase font-black text-muted-foreground mb-2 tracking-[0.2em]">পরিমাণ</p>
                        <p className="text-5xl font-black text-foreground">{req.bagsNeeded}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase">ব্যাগ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] uppercase font-black text-muted-foreground mb-2 tracking-[0.2em]">প্রয়োজন</p>
                        <p className="text-lg font-black text-foreground leading-tight">{req.neededWhen}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button className="flex-1 bg-primary hover:bg-secondary rounded-[2rem] h-16 gap-4 text-xl font-black shadow-2xl shadow-primary/30 transition-all active:scale-95" asChild>
                        <a href={`tel:${req.phone}`}><Phone className="h-6 w-6" /> যোগাযোগ করুন</a>
                      </Button>
                      <Button onClick={() => handleShare(req)} variant="outline" className="h-16 w-16 sm:w-20 rounded-[2rem] hover:bg-accent border-4 border-accent transition-all shadow-md flex items-center justify-center shrink-0">
                        <Share2 className="h-8 w-8 text-primary" />
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
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            <div className="relative h-[500px] lg:h-[700px] rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(211,29,42,0.4)] border-8 border-accent">
              <Image 
                src="https://image.mojib.me/uploads/General/1771907154_%E0%A6%95%E0%A7%87%E0%A6%A8%20%E0%A6%B0%E0%A6%95%E0%A7%8D%E0%A6%A4%20%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A7%87%E0%A6%A8.png" 
                fill 
                alt="রক্তদানের স্বাস্থ্য উপকারিতা" 
                className="object-cover" 
                data-ai-hint="blood donation benefits" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-l-8 border-primary">
                <p className="text-3xl font-black text-primary leading-tight">১ ব্যাগ রক্ত <br /><span className="text-foreground">৩ জনের প্রাণ বাঁচায়!</span></p>
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full text-sm font-black">কেন রক্ত দেবেন?</Badge>
                <h2 className="text-5xl md:text-7xl font-black font-headline leading-tight">রক্তদানের <br /><span className="text-primary">উপকারিতা</span></h2>
              </div>
              <div className="grid gap-8">
                {[
                  { title: "হার্টের স্বাস্থ্য ভালো রাখে", desc: "রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে, যা হৃদরোগের ঝুঁকি কমায়।", icon: Heart },
                  { title: "নতুন রক্তকণিকা তৈরি", desc: "রক্ত দেওয়ার পর শরীর নতুন রক্তকণিকা তৈরি করে, যা আপনাকে আরও সতেজ রাখে।", icon: Zap },
                  { title: "বিনামূল্যে স্বাস্থ্য পরীক্ষা", desc: "রক্তদানের সময় আপনার হিমোগ্লোবিন, রক্তচাপ ও অন্যান্য পরীক্ষা বিনামূল্যে করা হয়।", icon: ShieldCheck },
                  { title: "মানসিক প্রশান্তি", desc: "কারো জীবন বাঁচানোর চেয়ে বড় মানসিক তৃপ্তি আর কিছু হতে পারে না।", icon: Award }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 p-8 rounded-[2.5rem] bg-accent/20 hover:bg-white shadow-sm hover:shadow-2xl transition-all duration-500 group border-2 border-transparent hover:border-primary/10">
                    <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0 transition-all group-hover:bg-primary group-hover:scale-110"><item.icon className="h-8 w-8 text-primary group-hover:text-white" /></div>
                    <div>
                      <h4 className="font-black text-2xl mb-2 text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-lg leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-full px-16 h-16 text-2xl font-black bg-primary shadow-[0_20px_50px_rgba(211,29,42,0.4)] transition-all hover:scale-105 active:scale-95" asChild>
                <NextLink href="/register">রক্তদাতা হতে চাই</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Gallery Section */}
      <section className="py-24 bg-accent/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <Badge className="bg-primary text-white border-none px-8 py-2 rounded-full text-sm font-black shadow-lg">গ্যালারি</Badge>
            <h2 className="text-4xl md:text-6xl font-black font-headline">আমাদের কার্যক্রম</h2>
            <p className="text-2xl text-muted-foreground font-bold">সাম্প্রতিক রক্তদান ক্যাম্পেইন ও আমাদের স্বেচ্ছাসেবকদের কিছু মুহূর্ত।</p>
          </div>
          {loadingGallery ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-16 w-16 text-primary" /></div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center p-20 bg-white rounded-[3rem] shadow-xl">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-xl font-bold text-muted-foreground">গ্যালারি আপাতত খালি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative h-80 md:h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-700 cursor-pointer group border-4 border-white">
                  <Image src={item.imageurl} fill alt={item.title} className="object-cover" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm p-6 text-center">
                    <div className="bg-white p-4 rounded-full text-primary shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 mb-4">
                      <ExternalLink className="h-8 w-8 font-black" />
                    </div>
                    <p className="text-white font-black text-lg line-clamp-2">{item.title}</p>
                    <Badge className="mt-2 bg-white/20 text-white backdrop-blur border-none font-bold uppercase text-[10px] tracking-widest">{item.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. Eligibility Banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 overflow-hidden relative group border-4 border-primary/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="grid md:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-12 text-center md:text-left">
              <h2 className="text-5xl md:text-8xl font-black font-headline text-white leading-tight">
                আপনি কি আজ <br /><span className="text-primary">রক্তদান করতে পারবেন?</span>
              </h2>
              <p className="text-2xl text-slate-400 max-w-xl leading-relaxed font-bold italic">
                আমাদের AI ভিত্তিক কুইজের মাধ্যমে মাত্র ১ মিনিটে আপনার শারীরিক যোগ্যতা যাচাই করুন।
              </p>
              <Button size="lg" className="bg-primary hover:bg-secondary h-20 px-16 rounded-full text-3xl font-black gap-6 group shadow-[0_30px_60px_rgba(211,29,42,0.4)] transition-all active:scale-95 border-4 border-white/10" asChild>
                <NextLink href="/eligibility">
                  যোগ্যতা যাচাই করুন <ArrowRight className="h-9 w-9 group-hover:translate-x-3 transition-transform" />
                </NextLink>
              </Button>
            </div>
            
            <div className="relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-[450px] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-[12px] border-white/5 group-hover:scale-105 group-hover:rotate-2 transition-all duration-700 ease-out">
                <Image 
                  src="https://image.mojib.me/uploads/General/1771907823_Can%20You%20Donate%20Blood%20Today.png" 
                  fill 
                  alt="Can You Donate Blood Today?" 
                  className="object-cover"
                  data-ai-hint="blood donor"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Blood Compatibility Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20 space-y-6">
            <Badge className="bg-blue-600 text-white border-none px-8 py-2 rounded-full text-sm font-black shadow-md">রক্তের গ্রুপের সামঞ্জস্যতা</Badge>
            <h2 className="text-4xl md:text-6xl font-black font-headline">কে কাকে রক্ত দিতে পারবে?</h2>
            <p className="text-2xl text-muted-foreground font-bold">নিচের চার্টটি দেখে আপনার প্রয়োজনীয় গ্রুপটি নিশ্চিত করুন।</p>
          </div>
          <Card className="rounded-[3.5rem] overflow-hidden border-none shadow-[0_30px_80px_rgba(0,0,0,0.1)] border-t-[12px] border-t-primary">
            <Table>
              <TableHeader className="bg-primary text-white">
                <TableRow className="hover:bg-primary border-none">
                  <TableHead className="text-white font-black h-20 text-2xl px-10 text-center">রক্তের গ্রুপ</TableHead>
                  <TableHead className="text-white font-black h-20 text-2xl px-10 text-center">রক্ত দিতে পারবেন</TableHead>
                  <TableHead className="text-white font-black h-20 text-2xl px-10 text-center">রক্ত নিতে পারবেন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodCompatibility.map((row, i) => (
                  <TableRow key={i} className="hover:bg-primary/5 h-20 text-xl border-b-2 border-accent transition-colors">
                    <TableCell className="font-black text-primary text-3xl text-center">{row.type}</TableCell>
                    <TableCell className="font-bold text-slate-700 text-center">{row.give}</TableCell>
                    <TableCell className="font-bold text-slate-700 text-center">{row.take}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* 10. Founder's Message */}
      <section className="py-24 bg-accent/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-10">
              <div className="inline-flex h-20 w-20 bg-primary rounded-3xl items-center justify-center text-white mb-4 shadow-2xl shadow-primary/30 animate-pulse">
                <Quote className="h-10 w-10 fill-white" />
              </div>
              <h2 className="text-5xl font-black font-headline tracking-tight leading-tight">পরিচালকের <span className="text-primary">বার্তা</span></h2>
              <p className="text-3xl md:text-4xl font-bold text-foreground leading-snug italic border-l-8 border-primary pl-8 py-4">
                "RoktoDao একটি অলাভজনক উদ্যোগ যা রক্তদাতা এবং গ্রহীতাদের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্যে কাজ করে। প্রযুক্তি ব্যবহার করে জীবন বাঁচানোর এই যাত্রায় আমাদের সঙ্গী হওয়ার জন্য আপনাকে ধন্যবাদ।"
              </p>
              <div className="flex items-center gap-6 pt-8">
                <div className="h-24 w-24 rounded-full border-4 border-primary shadow-2xl overflow-hidden relative">
                  <Image src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" fill alt="Mujibur Rahman" className="object-cover" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-primary">মুজিবুর রহমান</h4>
                  <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-sm">প্রতিষ্ঠাতা ও পরিচালক, RoktoDao</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] opacity-40"></div>
              <div className="relative h-[550px] w-full max-w-[450px] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-[15px] border-white group hover:scale-105 transition-all duration-700">
                <Image src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" fill alt="Mujibur Rahman" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <Badge className="bg-green-600 text-white border-none px-8 py-2 rounded-full text-sm font-black shadow-md">রক্তদাতাদের প্রেরণা</Badge>
            <h2 className="text-4xl md:text-6xl font-black font-headline text-foreground">আমাদের রক্তদাতারা কি বলছেন?</h2>
            <div className="h-2 w-24 bg-green-600 mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              { name: "রাসেল আহমেদ", role: "১০ বার রক্তদাতা", text: "রক্তদান করলে মনের মধ্যে যে অদ্ভুত এক প্রশান্তি আসে, তা আর কিছুতে পাই না। RoktoDao এর মাধ্যমে যোগাযোগ করা এখন অনেক সহজ।", initial: "র" },
              { name: "সুমাইয়া জান্নাত", role: "শিক্ষার্থী", text: "প্রথমবার রক্ত দেওয়ার সময় ভয় লেগেছিল, কিন্তু একজনের প্রাণ বাঁচাতে পেরেছি জেনে এখন নিয়মিত রক্ত দেই।", initial: "স" },
              { name: "ডা. আরিফ হাসান", role: "সহযোগী অধ্যাপক", text: "একজন চিকিৎসক হিসেবে আমি জানি রক্ত কতটা মূল্যবান। RoktoDao এর এই উদ্যোগ সত্যিই প্রশংসনীয়।", initial: "ড" }
            ].map((t, i) => (
              <Card key={i} className="p-10 rounded-[3.5rem] border-none shadow-[0_30px_60px_rgba(0,0,0,0.05)] bg-accent/10 hover:bg-white hover:shadow-2xl transition-all duration-500 group text-center space-y-8 border-b-8 border-transparent hover:border-primary">
                <div className="h-20 w-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto text-3xl font-black text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">{t.initial}</div>
                <p className="text-xl text-foreground/80 leading-relaxed font-bold italic">"{t.text}"</p>
                <div>
                  <h4 className="text-2xl font-black text-foreground">{t.name}</h4>
                  <p className="text-sm text-primary font-black uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Mobile App Promo */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-slate-900 rounded-[5rem] p-12 md:p-32 overflow-hidden relative text-white border-8 border-primary/10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[180px] opacity-60"></div>
          <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12 text-center lg:text-left">
              <Badge className="bg-primary hover:bg-primary border-none text-base px-8 py-2 rounded-full font-black shadow-lg shadow-primary/30 animate-pulse">শীঘ্রই আসছে</Badge>
              <h2 className="text-5xl md:text-8xl font-black font-headline leading-tight">RoktoDao <br /><span className="text-primary">মোবাইল অ্যাপ</span></h2>
              <p className="text-2xl md:text-3xl text-slate-400 max-w-2xl leading-relaxed font-bold">
                এখন পকেটেই থাকবে আপনার এলাকার সব রক্তদাতার তথ্য। দ্রুত যোগাযোগের জন্য অ্যাপটি হবে আপনার সেরা সঙ্গী।
              </p>
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-6">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] flex items-center gap-6 border-2 border-white/10 hover:bg-primary/20 hover:border-primary/40 transition-all cursor-pointer group shadow-2xl">
                  <div className="bg-primary p-4 rounded-2xl group-hover:scale-110 transition-transform"><Smartphone className="h-10 w-10 text-white" /></div>
                  <div className="text-left">
                    <p className="text-xs uppercase font-black text-slate-400 tracking-widest">Download on</p>
                    <p className="text-2xl font-black">Google Play</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] flex items-center gap-6 border-2 border-white/10 hover:bg-slate-700/50 transition-all cursor-pointer opacity-60 shadow-2xl">
                  <div className="bg-slate-700 p-4 rounded-2xl"><Smartphone className="h-10 w-10 text-white" /></div>
                  <div className="text-left">
                    <p className="text-xs uppercase font-black text-slate-400 tracking-widest">Coming to</p>
                    <p className="text-2xl font-black">App Store</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] md:h-[750px] flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px] h-full shadow-[0_60px_120px_rgba(0,0,0,0.6)] border-[15px] border-slate-800 rounded-[4rem] overflow-hidden group hover:scale-105 transition-all duration-700">
                <Image src="https://image.mojib.me/uploads/General/1771910851_ROktoDao%20app.png" fill alt="RoktoDao Mobile App Promo" className="object-cover" data-ai-hint="mobile app" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Partners */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-12">আমাদের সহযোগী প্রতিষ্ঠানসমূহ</p>
            <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 grayscale opacity-40 hover:grayscale-0 transition-all duration-700">
              {['ঢাকা মেডিকেল', 'রেড ক্রিসেন্ট', 'বঙ্গবন্ধু মেডিকেল', 'ব্লাড ফাউন্ডেশন', 'বেসরকারি ক্লিনিক'].map((p, i) => (
                <div key={i} className="text-3xl md:text-5xl font-black font-headline text-slate-400 hover:text-primary transition-all cursor-default transform hover:scale-110">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 14. Why Choose Us */}
      <section className="py-24 bg-accent/10 border-y-4 border-primary/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-7xl font-black font-headline">কেন RoktoDao বেছে নিবেন?</h2>
            <div className="h-2 w-32 bg-primary mx-auto rounded-full mt-8"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "যাচাইকৃত রক্তদাতা", desc: "আমাদের সকল রক্তদাতা মোবাইল নম্বর ভেরিফাইড, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।", icon: CheckCircle2 },
              { title: "দ্রুত যোগাযোগ", desc: "সরাসরি ফোন কল বা মেসেজের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।", icon: Zap },
              { title: "দেশব্যাপী নেটওয়ার্ক", desc: "সারাদেশে প্রতিটি জেলা ও উপজেলায় আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত।", icon: Globe },
              { title: "সম্পূর্ণ সুরক্ষিত", desc: "আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা কোনো তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না।", icon: ShieldCheck }
            ].map((item, i) => (
              <Card key={i} className="p-10 rounded-[3.5rem] border-none shadow-2xl bg-white text-center hover:-translate-y-4 transition-all duration-500 border-b-[10px] border-primary/10 hover:border-primary">
                <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 shadow-inner group-hover:bg-primary transition-all">
                  <item.icon className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-black mb-4 text-foreground">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed font-bold text-lg">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-20 space-y-6">
            <Badge className="bg-primary/10 text-primary border-none px-10 py-2 rounded-full text-base font-black">সহযোগিতা</Badge>
            <h2 className="text-4xl md:text-6xl font-black font-headline">সাধারণ জিজ্ঞাসা (FAQ)</h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full mt-6"></div>
          </div>
          <Accordion type="single" collapsible className="space-y-6">
            {[
              { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "রক্তদানের জন্য আপনার বয়স ১৮-৬০ বছর এবং ওজন কমপক্ষে ৫০ কেজি হতে হবে।" },
              { q: "কারা রক্তদান করতে পারবেন না?", a: "গর্ভবতী মহিলা, সম্প্রতি বড় কোনো অস্ত্রোপচার হওয়া ব্যক্তি এবং কিছু ছোঁয়াচে রোগে আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না। বিস্তারিত জানতে যোগ্যতা যাচাই কুইজটি দিন।" },
              { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস অন্তর এবং একজন সুস্থ মহিলা প্রতি ৪ মাস অন্তর রক্তদান করতে পারেন।" },
              { q: "রক্ত দিতে কি কোনো টাকা লাগে?", a: "না, রক্তদান একটি সম্পূর্ণ স্বেচ্ছাসেবী ও মানবিক কাজ। রক্ত দেওয়া বা নেওয়ার জন্য কোনো অর্থ লেনদেন আমাদের প্ল্যাটফর্মে নিষিদ্ধ।" },
              { q: "রক্তদানের পর কি কোনো বিশ্রাম প্রয়োজন?", a: "হ্যাঁ, রক্তদানের পর অন্তত ১৫-২০ মিনিট বিশ্রাম নেওয়া এবং প্রচুর পানি পান করা প্রয়োজন।" }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-none shadow-xl rounded-[2.5rem] bg-accent/20 px-10 overflow-hidden group hover:bg-white transition-all duration-500 border-l-8 border-primary/20 hover:border-primary">
                <AccordionTrigger className="text-2xl font-black hover:no-underline py-8 text-foreground group-data-[state=open]:text-primary">{item.q}</AccordionTrigger>
                <AccordionContent className="text-xl text-foreground/70 pb-10 leading-relaxed font-bold">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 16. Newsletter */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-[4rem] p-12 md:p-24 text-center text-white space-y-12 relative overflow-hidden shadow-[0_40px_80px_rgba(211,29,42,0.4)]">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-7xl font-black font-headline tracking-tight drop-shadow-lg">আমাদের সাথে আপডেট থাকুন</h2>
            <p className="text-2xl md:text-3xl opacity-90 leading-relaxed font-bold italic">
              আমাদের আগামী রক্তদান ক্যাম্পেইন ও গুরুত্বপূর্ণ খবরাখবর ইমেইলে পেতে সাবস্ক্রাইব করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 max-w-3xl mx-auto">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল ঠিকানা" 
                className="flex-1 h-20 rounded-[2.5rem] px-10 bg-white/15 border-4 border-white/30 text-white placeholder:text-white/70 outline-none focus:bg-white/20 focus:border-white transition-all text-2xl font-bold shadow-inner"
                suppressHydrationWarning
              />
              <Button className="h-20 rounded-[2.5rem] px-16 bg-white text-primary hover:bg-accent text-3xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">সাবস্ক্রাইব</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 17. Help Section */}
      <section className="py-24 bg-slate-950 text-white text-center relative border-t-8 border-primary">
        <div className="container mx-auto px-4 space-y-12">
          <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-xl border-4 border-primary/30 animate-pulse shadow-2xl">
            <Phone className="h-12 w-12 text-primary fill-primary" />
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black font-headline">জরুরি কোনো সাহায্য প্রয়োজন?</h2>
            <p className="text-2xl text-slate-400 font-bold">আমাদের হেল্পলাইন নম্বরে কল করুন সরাসরি সাহায্যের জন্য।</p>
            <a href="tel:+8801600151907" className="text-5xl md:text-9xl font-black text-primary block hover:scale-105 transition-transform drop-shadow-[0_10px_30px_rgba(211,29,42,0.5)]">+8801600151907</a>
          </div>
          <div className="pt-10 flex justify-center gap-6">
            <Button variant="outline" size="lg" className="rounded-full bg-white/5 border-2 border-white/10 hover:bg-primary hover:border-primary text-xl font-bold transition-all px-10" asChild>
              <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-3 h-6 w-6" /> মেসেজ দিন
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
