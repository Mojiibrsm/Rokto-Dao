
'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Search, Users, 
  CheckCircle, Phone, Share2, Clock, Loader2, 
  ImageIcon, Smartphone, HandHeart, 
  HelpCircle, Mail, Globe, Zap, Star, Quote, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBloodRequests, getDonors, type BloodRequest, type Donor } from '@/lib/sheets';
import { DISTRICTS } from '@/lib/bangladesh-data';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [selectedBloodType, setSelectedBloodType] = useState<string>('যেকোনো গ্রুপ');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('যেকোনো জেলা');
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      setLoadingRequests(true);
      setLoadingDonors(true);
      try {
        const [requestsData, donorsData] = await Promise.all([
          getBloodRequests(),
          getDonors()
        ]);
        setRequests(requestsData.slice(0, 4)); // Show only latest 4 requests
        setDonors(donorsData.slice(0, 6)); // Show only latest 6 donors
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
    if (selectedDistrict !== 'যেকোনো জেলা' && selectedDistrict !== 'all') params.set('district', selectedDistrict);
    router.push(`/donors?${params.toString()}`);
  };

  const whyDonateImage = PlaceHolderImages.find(img => img.id === 'why-donate')?.imageUrl || 'https://picsum.photos/seed/why-donate/800/600';
  const canYouDonateImage = PlaceHolderImages.find(img => img.id === 'can-you-donate')?.imageUrl || '';
  const mobileAppImage = PlaceHolderImages.find(img => img.id === 'mobile-app-promo')?.imageUrl || 'https://picsum.photos/seed/mobile/800/1000';

  return (
    <div className="flex flex-col gap-0 pb-0 overflow-x-hidden">
      {/* 1. হিরো সেকশন */}
      <section className="relative w-full py-20 md:py-32 bg-accent/30 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center gap-10">
          <div className="max-w-4xl space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm py-1 px-4 rounded-full mb-4">
              স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচান
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground font-headline leading-tight">
              আপনার নিকটবর্তী <span className="text-primary">রক্তদাতা</span> খুঁজুন
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              জরুরী মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।
            </p>
          </div>

          <Card className="w-full max-w-5xl shadow-2xl p-6 md:p-8 border-t-8 border-t-primary rounded-3xl bg-white/80 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-primary" /> রক্তের গ্রুপ
                </label>
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="h-14 text-lg border-2 focus:ring-primary">
                    <SelectValue placeholder="যেকোনো গ্রুপ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> জেলা
                </label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="h-14 text-lg border-2 focus:ring-primary">
                    <SelectValue placeholder="যেকোনো জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                    {DISTRICTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 h-14 text-xl font-bold gap-3 rounded-xl shadow-lg shadow-primary/20 w-full transition-all hover:scale-[1.02]"
              >
                <Search className="h-6 w-6" /> অনুসন্ধান করুন
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. পরিসংখ্যান সেকশন */}
      <section className="bg-white py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-500" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className={`h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-black font-headline mb-1">{stat.val}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. সাম্প্রতিক কার্যক্রম (Marquee) */}
      <div className="bg-primary text-white py-3 overflow-hidden whitespace-nowrap border-y">
        <div className="inline-block animate-marquee-slow hover-pause px-4 font-bold">
          {[
            "ঢাকা মেডিকেল কলেজে আজ সকালে ৩ ব্যাগ O+ রক্ত দেওয়া হয়েছে।",
            "চট্টগ্রামের পটিয়াতে একজন থ্যালাসেমিয়া রোগীর জন্য B- রক্ত প্রয়োজন।",
            "সিলেটে ৫ জন নতুন রক্তদাতা আজ নিবন্ধন করেছেন।",
            "রংপুরে আগামী শুক্রবার রক্তদান ক্যাম্প অনুষ্ঠিত হবে।"
          ].map((text, i) => (
            <span key={i} className="mx-12 flex items-center gap-2">
              <Zap className="h-4 w-4 fill-white" /> {text}
            </span>
          ))}
        </div>
      </div>

      {/* 4. আমাদের রক্তযোদ্ধারা (New Section) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-xl text-muted-foreground font-medium italic">"Our active and available donors"</p>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>

          {loadingDonors ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-[2.5rem] group border-t-4 border-t-primary/20 bg-muted/5">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20">
                          {(donor.fullName || 'D').substring(0, 1)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{donor.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-0.5 text-xs">
                            <MapPin className="h-3 w-3" /> {donor.district}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-primary text-white text-xl font-black h-12 w-12 flex items-center justify-center p-0 rounded-xl shadow-md">
                        {donor.bloodType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-2 rounded-lg border border-green-100 w-fit">
                      <ShieldCheck className="h-4 w-4" /> ভেরিফাইড রক্তদাতা
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> {donor.area || 'N/A'}, {donor.district}
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 border-t">
                    <Button className="w-full h-14 rounded-none bg-primary hover:bg-primary/90 text-lg font-bold gap-3" asChild>
                      <a href={`tel:${donor.phone}`}>
                        <Phone className="h-5 w-5" /> যোগাযোগ করুন
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-primary text-primary hover:bg-primary/5" asChild>
              <NextLink href="/donors">সব রক্তদাতা দেখুন <ArrowRight className="ml-2 h-5 w-5" /></NextLink>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. কিভাবে কাজ করে */}
      <section className="bg-muted/10 py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <Badge variant="outline" className="text-primary border-primary">প্রক্রিয়া</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-headline">রক্তদান প্রক্রিয়া মাত্র ৩ ধাপে</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { title: "নিবন্ধন", desc: "আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী ডেটাবেজে যুক্ত হোন।", icon: Users },
              { title: "অনুরোধ বা অনুসন্ধান", desc: "জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।", icon: Search },
              { title: "জীবন বাঁচান", desc: "হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুমূর্ষু রোগীর প্রাণ বাঁচান।", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-[2.5rem] border-2 border-muted hover:border-primary/20 transition-all group bg-white shadow-sm hover:shadow-xl text-center">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl border-4 border-white shadow-lg">
                  {idx + 1}
                </div>
                <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. জরুরি রক্তের রিকোয়েস্ট */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold font-headline flex items-center gap-3 justify-center md:justify-start">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                </span>
                সরাসরি অনুরোধসমূহ
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">জরুরি ভিত্তিতে যাদের রক্তের প্রয়োজন।</p>
            </div>
            <Button variant="outline" className="rounded-full px-8" asChild>
              <NextLink href="/requests">সব অনুরোধ দেখুন <ArrowRight className="ml-2 h-4 w-4" /></NextLink>
            </Button>
          </div>

          {loadingRequests ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-3xl bg-white group border">
                  <div className={`h-2 ${req.isUrgent ? 'bg-primary' : 'bg-slate-800'}`}></div>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{req.patientName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2 font-medium">
                          <MapPin className="h-4 w-4 text-primary" /> {req.hospitalName}
                        </CardDescription>
                      </div>
                      <Badge className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white`}>
                        {req.isUrgent ? 'জরুরি' : 'Approved'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <div className="flex items-center gap-6 py-4 border-y border-dashed my-4">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">গ্রুপ</p>
                        <p className="text-2xl font-black text-primary">{req.bloodType}</p>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">ব্যাগ</p>
                        <p className="text-2xl font-black">{req.bagsNeeded}</p>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">কখন</p>
                        <p className="text-lg font-bold truncate">{req.neededWhen}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-xl h-12 gap-2" asChild>
                        <a href={`tel:${req.phone}`}><Phone className="h-4 w-4" /> যোগাযোগ</a>
                      </Button>
                      <Button variant="secondary" size="icon" className="h-12 w-12 rounded-xl">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. রক্তদানের উপকারিতা */}
      <section className="py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <Image 
                src={whyDonateImage} 
                width={800} 
                height={600} 
                alt="Blood donation benefits" 
                className="rounded-[3rem] shadow-2xl"
                data-ai-hint="blood donation"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl border max-w-[250px] hidden md:block">
                <p className="text-primary font-black text-4xl mb-1">১টি</p>
                <p className="font-bold leading-tight">রক্তদান ৩ জন মানুষের প্রাণ বাঁচাতে পারে!</p>
              </div>
            </div>
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-none">কেন রক্ত দেবেন?</Badge>
              <h2 className="text-4xl md:text-5xl font-bold font-headline leading-tight">রক্তদানের কিছু বিস্ময়কর স্বাস্থ্য উপকারিতা</h2>
              <div className="space-y-6">
                {[
                  { title: "হার্টের স্বাস্থ্য ভালো রাখে", desc: "রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে, যা হৃদরোগের ঝুঁকি কমায়।" },
                  { title: "নতুন রক্তকণিকা তৈরি", desc: "রক্ত দেওয়ার পর শরীর নতুন রক্তকণিকা তৈরি করে, যা আপনাকে আরও সতেজ রাখে।" },
                  { title: "বিনামূল্যে স্বাস্থ্য পরীক্ষা", desc: "রক্তদানের সময় আপনার হিমোগ্লোবিন, রক্তচাপ ও অন্যান্য পরীক্ষা বিনামূল্যে করা হয়।" },
                  { title: "মানসিক প্রশান্তি", desc: "কারো জীবন বাঁচানোর চেয়ে বড় মানসিক তৃপ্তি আর কিছু হতে পারে না।" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-full px-10 h-14 text-lg" asChild>
                <NextLink href="/register">রক্তদাতা হতে চাই</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. রক্তদাতার যোগ্যতা কুইজ প্রোমো */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-[3rem] p-10 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black font-headline leading-tight">আপনি কি আজ রক্তদান করতে পারবেন?</h2>
              <p className="text-xl opacity-90">আমাদের AI ভিত্তিক কুইজের মাধ্যমে মাত্র ১ মিনিটে আপনার শারীরিক যোগ্যতা যাচাই করুন।</p>
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 h-14 text-lg font-bold" asChild>
                <NextLink href="/eligibility">আমার যোগ্যতা যাচাই করুন</NextLink>
              </Button>
            </div>
            {canYouDonateImage ? (
              <div className="shrink-0 relative h-64 w-64 md:h-80 md:w-80 rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image 
                  src={canYouDonateImage} 
                  fill 
                  alt="Can you donate" 
                  className="object-cover"
                  data-ai-hint="blood donor"
                />
              </div>
            ) : (
              <div className="h-48 w-48 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <ShieldCheck className="h-24 w-24 text-white" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. রক্তের গ্রুপের সামঞ্জস্যতা টেবিল */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline">রক্তের গ্রুপের সামঞ্জস্যতা</h2>
            <p className="text-muted-foreground text-lg">জেনে নিন আপনি কাকে রক্ত দিতে পারবেন এবং কার থেকে নিতে পারবেন।</p>
          </div>
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">রক্তের গ্রুপ</th>
                    <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">রক্ত দিতে পারবেন</th>
                    <th className="p-6 font-black uppercase text-xs tracking-widest text-muted-foreground">রক্ত নিতে পারবেন</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { g: "A+", give: "A+, AB+", receive: "A+, A-, O+, O-" },
                    { g: "O+", give: "O+, A+, B+, AB+", receive: "O+, O-" },
                    { g: "B+", give: "B+, AB+", receive: "B+, B-, O+, O-" },
                    { g: "AB+", give: "AB+ Only", receive: "সব গ্রুপ (Universal Receiver)" },
                    { g: "A-", give: "A+, A-, AB+, AB-", receive: "A-, O-" },
                    { g: "O-", give: "সব গ্রুপ (Universal Donor)", receive: "O- Only" },
                    { g: "B-", give: "B+, B-, AB+, AB-", receive: "B-, O-" },
                    { g: "AB-", give: "AB+, AB-", receive: "AB-, A-, B-, O-" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                      <td className="p-6"><Badge className="h-10 w-10 flex items-center justify-center text-lg font-black rounded-lg">{row.g}</Badge></td>
                      <td className="p-6 font-bold">{row.give}</td>
                      <td className="p-6 font-bold text-muted-foreground">{row.receive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 10. পরিচালকের বার্তা */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative">
            <Quote className="absolute top-10 right-10 h-24 w-24 text-primary/10 -rotate-12" />
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="shrink-0">
                <div className="h-48 w-48 rounded-full border-8 border-white shadow-2xl overflow-hidden relative">
                  <Image 
                    src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" 
                    fill 
                    alt="Mujibur Rahman" 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6 text-center md:text-left">
                <Badge className="bg-primary text-white mb-2">পরিচালকের বার্তা</Badge>
                <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-foreground/80">
                  "RoktoDao একটি অলাভজনক উদ্যোগ যা রক্তদাতা এবং গ্রহীতাদের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্যে কাজ করে। প্রযুক্তি ব্যবহার করে জীবন বাঁচানোর এই যাত্রায় আমাদের সঙ্গী হওয়ার জন্য আপনাকে ধন্যবাদ।"
                </p>
                <div className="pt-4">
                  <h4 className="text-2xl font-bold text-primary">মুজিবুর রহমান</h4>
                  <p className="text-muted-foreground font-bold uppercase tracking-wider">প্রতিষ্ঠাতা, RoktoDao</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. সফলতার গল্প (Testimonials) */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <Badge variant="outline" className="text-primary border-primary">প্রেরণা</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-headline">রক্তদাতাদের কথা</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { name: "রাসেল আহমেদ", role: "১০ বার রক্তদাতা", text: "রক্তদান করলে মনের মধ্যে যে অদ্ভুত এক প্রশান্তি আসে, তা আর কিছুতে পাই না। RoktoDao এর মাধ্যমে যোগাযোগ করা এখন অনেক সহজ।" },
              { name: "সুমাইয়া জান্নাত", role: "শিক্ষার্থী", text: "প্রথমবার রক্ত দেওয়ার সময় ভয় লেগেছিল, কিন্তু একজনের প্রাণ বাঁচাতে পেরেছি জেনে এখন নিয়মিত রক্ত দেই।" },
              { name: "ডা. আরিফ হাসান", role: "সহযোগী অধ্যাপক", text: "একজন চিকিৎসক হিসেবে আমি জানি রক্ত কতটা মূল্যবান। RoktoDao এর এই উদ্যোগ সত্যিই প্রশংসনীয়।" }
            ].map((test, i) => (
              <Card key={i} className="rounded-[2.5rem] p-8 bg-white border-none shadow-sm hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-6 text-amber-500">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-lg italic text-muted-foreground mb-8">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{test.name}</h4>
                    <p className="text-sm text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12. গ্যালারি সেকশন */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold font-headline flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-primary" /> আমাদের গ্যালারি
              </h2>
              <p className="text-muted-foreground text-lg">আমাদের সাম্প্রতিক ব্লাড ড্রাইভ ও ক্যাম্পেইনের কিছু মুহূর্ত।</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group relative overflow-hidden rounded-3xl aspect-square">
                <Image 
                  src={`https://picsum.photos/seed/gallery${i}/600/600`} 
                  fill 
                  alt="Gallery image" 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  data-ai-hint="blood donation"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur text-white border-none">Camp {i}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. মোবাইল অ্যাপ প্রোমো */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[4rem] overflow-hidden flex flex-col lg:flex-row items-center">
            <div className="p-12 lg:p-24 space-y-8 flex-1 text-white">
              <Badge className="bg-primary text-white border-none px-4">শীঘ্রই আসছে</Badge>
              <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">RoktoDao মোবাইল অ্যাপ</h2>
              <p className="text-xl text-slate-400">এখন পকেটেই থাকবে আপনার এলাকার সব রক্তদাতার তথ্য। জরুরি নোটিফিকেশন ও দ্রুত যোগাযোগের জন্য আমাদের অ্যাপটি হবে আপনার সেরা সঙ্গী।</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="h-16 w-48 bg-slate-800 rounded-2xl flex items-center justify-center gap-3 border border-slate-700 opacity-50 grayscale">
                  <Smartphone className="h-8 w-8" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold">Download on</p>
                    <p className="font-bold">Google Play</p>
                  </div>
                </div>
                <div className="h-16 w-48 bg-slate-800 rounded-2xl flex items-center justify-center gap-3 border border-slate-700 opacity-50 grayscale">
                  <Smartphone className="h-8 w-8" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold">Coming to</p>
                    <p className="font-bold">App Store</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative h-[400px] lg:h-[600px] w-full">
              <Image 
                src={mobileAppImage} 
                fill 
                alt="RoktoDao Mobile App Promo" 
                className="object-contain lg:object-cover"
                data-ai-hint="mobile app"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 14. স্বেচ্ছাসেবক হওয়ার আহ্বান */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center space-y-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <HandHeart className="h-10 w-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-headline">স্বেচ্ছাসেবক হিসেবে যোগ দিন</h2>
            <p className="text-xl text-muted-foreground">রক্তদান ছাড়াও আমাদের এই মহৎ কাজে আপনি স্বেচ্ছাসেবক হিসেবে অবদান রাখতে পারেন। আমরা আপনার অপেক্ষায় আছি।</p>
            <Button size="lg" className="rounded-full px-12 h-14 text-lg font-bold bg-secondary hover:bg-secondary/90 shadow-xl" asChild>
              <NextLink href="/contact">আবেদন করুন</NextLink>
            </Button>
          </div>
        </div>
      </section>

      {/* 15. আমাদের পার্টনার (Trust indicators) */}
      <section className="py-16 bg-muted/20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-10">আমাদের সহযোগী প্রতিষ্ঠানসমূহ</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center">
            {['ঢাকা মেডিকেল', 'রেড ক্রিসেন্ট', 'বঙ্গবন্ধু মেডিকেল', 'ব্লাড ফাউন্ডেশন', 'বেসরকারি ক্লিনিক'].map((p, i) => (
              <span key={i} className="text-2xl font-black font-headline text-slate-400">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 16. কেন RoktoDao বেছে নিবেন? */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-headline">কেন RoktoDao বেছে নিবেন?</h2>
          <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CheckCircle, title: "যাচাইকৃত রক্তদাতা", desc: "আমাদের সকল রক্তদাতা মোবাইল নম্বর ভেরিফাইড, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।" },
            { icon: MessageSquare, title: "দ্রুত যোগাযোগ", desc: "সরাসরি ফোন কল বা মেসেজের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।" },
            { icon: MapPin, title: "দেশব্যাপী নেটওয়ার্ক", desc: "সারাদেশে প্রতিটি জেলা ও উপজেলায় আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত।" },
            { icon: ShieldCheck, title: "সম্পূর্ণ সুরক্ষিত", desc: "আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা কোনো তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না।" }
          ].map((feat, i) => (
            <Card key={i} className="border-none shadow-lg text-center p-10 hover:-translate-y-3 transition-all duration-500 rounded-[2.5rem] bg-white group hover:shadow-primary/10">
              <CardHeader className="p-0 space-y-6">
                <div className="h-20 w-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                  <feat.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl font-bold">{feat.title}</CardTitle>
                <CardDescription className="text-lg leading-relaxed">{feat.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* 17. সাধারণ জিজ্ঞাসা (FAQ) */}
      <section className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-primary text-white border-none">সহযোগিতা</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">সাধারণ জিজ্ঞাসা</h2>
          <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-6">
          {[
            { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "রক্তদানের জন্য সর্বনিম্ন বয়স ১৮ বছর এবং ওজন কমপক্ষে ৫০ কেজি হতে হবে।" },
            { q: "কারা রক্তদান করতে পারবেন না?", a: "গুরুতর অসুস্থতা, যেমন হৃদরোগ, ক্যান্সার, এইচআইভি/এইডস, বা রক্তবাহিত রোগে আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না।" },
            { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস পর পর এবং একজন সুস্থ নারী প্রতি ৪ মাস পর পর রক্তদান করতে পারেন।" },
            { q: "রক্ত দিতে কি কোনো টাকা লাগে?", a: "না, রক্তদান একটি মানবিক ও স্বেচ্ছাসেবী কাজ। রক্ত দেওয়া বা নেওয়ার জন্য কোনো টাকা লেনদেন করা দণ্ডনীয় অপরাধ।" },
            { q: "রক্তদানের পর কি কোনো বিশ্রাম প্রয়োজন?", a: "হ্যাঁ, রক্তদানের পর অন্তত ১৫-২০ মিনিট শুয়ে থাকা এবং প্রচুর পরিমাণে পানি ও তরল জাতীয় খাবার খাওয়া উচিত।" }
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-2 border-primary/10 rounded-3xl px-8 bg-white shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
              <AccordionTrigger className="text-xl font-bold hover:no-underline hover:text-primary py-8 text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="text-lg text-muted-foreground pb-8 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 18. নিউজলেটার সাবস্ক্রিপশন */}
      <section className="py-24 bg-primary text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <Mail className="h-16 w-16 mx-auto opacity-50" />
            <h2 className="text-4xl font-black font-headline">আপডেট থাকতে চান?</h2>
            <p className="text-xl opacity-90">আমাদের আগামী রক্তদান ক্যাম্পেইন ও গুরুত্বপূর্ণ খবরাখবর ইমেইলে পেতে সাবস্ক্রাইব করুন।</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input suppressHydrationWarning placeholder="আপনার ইমেইল ঠিকানা" className="h-14 rounded-full bg-white text-slate-900 px-8 text-lg" type="email" />
              <Button className="h-14 px-10 rounded-full bg-slate-900 hover:bg-slate-800 text-lg font-bold">সাবস্ক্রাইব</Button>
            </form>
          </div>
        </div>
      </section>

      {/* 19. ইমার্জেন্সি সাপোর্ট বার */}
      <section className="bg-red-50 py-10 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">জরুরি কোনো সাহায্য প্রয়োজন?</h4>
              <p className="text-muted-foreground">আমাদের হেল্পলাইন নম্বরে কল করুন সরাসরি সাহায্যের জন্য।</p>
            </div>
          </div>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full h-14 px-10 text-xl font-black gap-3 transition-all" asChild>
            <a href="tel:+8801234567890"><Phone className="h-6 w-6" /> +৮৮০ ১২৩৪ ৫৬৭ ৮৯০</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
