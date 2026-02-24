'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Search, Users, 
  CheckCircle, Phone, Share2, Clock, Loader2, 
  ImageIcon, Smartphone, HandHeart, 
  HelpCircle, Mail, Globe, Zap, Star, Quote, MessageSquare, Plus, Hospital, Award, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getBloodRequests, getDonors, type BloodRequest, type Donor } from '@/lib/sheets';
import { DISTRICTS } from '@/lib/bangladesh-data';
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
    if (selectedDistrict !== 'যেকোনো জেলা' && selectedDistrict !== 'all') params.set('district', selectedDistrict);
    router.push(`/donors?${params.toString()}`);
  };

  const bloodTable = [
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
      {/* SEO Headline Section */}
      <section className="sr-only">
        <h1>রক্তদাও - বাংলাদেশের অনলাইন রক্তদাতা খুঁজে পাওয়ার সহজ প্ল্যাটফর্ম</h1>
        <p>জরুরি মুহূর্তে রক্তদাতা খুঁজুন অথবা নিজে একজন দাতা হিসেবে নিবন্ধন করে মানবতার সেবা করুন। RoktoDao বাংলাদেশে বিনামূল্যে রক্তদাতা এবং গ্রহীতাদের মধ্যে সংযোগ স্থাপন করে।</p>
      </section>

      {/* 1. হিরো সেকশন */}
      <section className="relative w-full py-10 md:py-16 flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto relative z-10 max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <Droplet className="h-10 w-10 md:h-14 md:w-14 text-primary fill-primary drop-shadow-xl" />
            <h2 className="text-3xl md:text-[56px] font-black tracking-tight text-primary font-headline leading-tight">
              “আপনার রক্তে বাঁচবে অন্যের স্বপ্ন!”
            </h2>
          </div>
          
          <p className="text-lg md:text-[20px] text-muted-foreground/80 max-w-4xl mx-auto leading-relaxed font-medium">
            জরুরী মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন। আপনার সামান্য ত্যাগই পারে অন্যের জীবনে বিশাল পরিবর্তন আনতে।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 h-14 md:h-16 px-10 rounded-xl text-xl font-bold shadow-xl shadow-primary/20 gap-3 group transition-all hover:scale-[1.02]"
              asChild
            >
              <NextLink href="/register">
                <Heart className="h-6 w-6 text-white group-hover:scale-110 transition-transform" /> রক্ত দিতে চাই
              </NextLink>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white hover:bg-muted/50 h-14 md:h-16 px-10 rounded-xl text-xl font-bold border-none shadow-md gap-3 group transition-all hover:scale-[1.02]"
              asChild
            >
              <NextLink href="/donors">
                <Search className="h-6 w-6 text-muted-foreground group-hover:scale-110 transition-transform" /> রক্ত খুঁজছি
              </NextLink>
            </Button>
          </div>

          {/* ছোট্ট সার্চ বার */}
          <div className="max-w-2xl mx-auto pt-4 animate-in fade-in slide-in-from-bottom-5 delay-500 duration-1000">
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-primary/5 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="h-11 border-none bg-transparent focus:ring-0 text-base font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="রক্তের গ্রুপ" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-px bg-border/50 hidden md:block"></div>
              <div className="flex-1">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="h-11 border-none bg-transparent focus:ring-0 text-base font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="জেলা" />
                    </div>
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
                size="icon"
                className="h-11 w-11 md:w-14 bg-primary hover:bg-primary/90 rounded-xl shrink-0 shadow-lg shadow-primary/10"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. পরিসংখ্যান সেকশন */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-500" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-2 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl md:text-3xl font-black font-headline mb-0.5">{stat.val}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. আমাদের রক্তযোদ্ধারা */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-lg text-muted-foreground font-medium italic">"Our active and available donors"</p>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-3"></div>
          </div>

          {loadingDonors ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-[2rem] group border-t-4 border-t-primary/20 bg-muted/5">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                          {(donor.fullName || 'D').substring(0, 1)}
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{donor.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-[11px]">
                            <MapPin className="h-3 w-3 text-primary" /> {donor.area && donor.area !== 'N/A' ? donor.area + ', ' : ''} {donor.district}
                          </CardDescription>
                          {donor.organization && (
                            <div className="flex items-center gap-1.5 text-secondary font-bold text-[10px] bg-secondary/5 px-2 py-0.5 rounded-md border border-secondary/10 w-fit">
                              <Users className="h-3 w-3" /> {donor.organization}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-primary text-white text-lg font-black h-10 w-10 flex items-center justify-center p-0 rounded-xl shadow-md">
                        {donor.bloodType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 p-2 rounded-lg border border-green-100 w-fit">
                      <ShieldCheck className="h-3.5 w-3.5" /> ভেরিফাইড রক্তদাতা
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-white/50 rounded-xl border">
                        <p className="text-muted-foreground uppercase text-[8px] font-bold">শেষ রক্তদান</p>
                        <p className="font-bold">{donor.lastDonationDate || 'N/A'}</p>
                      </div>
                      <div className="p-2.5 bg-white/50 rounded-xl border">
                        <p className="text-muted-foreground uppercase text-[8px] font-bold">মোট রক্তদান</p>
                        <p className="font-bold">{donor.totalDonations || 0} বার</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 border-t">
                    <Button className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 text-base font-bold gap-3" asChild>
                      <a href={`tel:${donor.phone}`}>
                        <Phone className="h-4 w-4" /> যোগাযোগ করুন
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-primary text-primary hover:bg-primary/5" asChild>
              <NextLink href="/donors">সব রক্তদাতা দেখুন <ArrowRight className="ml-2 h-4 w-4" /></NextLink>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. কাজের প্রক্রিয়া */}
      <section className="bg-muted/10 py-10 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 space-y-1">
            <Badge variant="outline" className="text-primary border-primary">প্রক্রিয়া</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-headline">রক্তদান প্রক্রিয়া মাত্র ৩ ধাপে</h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-3"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "নিবন্ধন", desc: "আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী ডেটাবেজে যুক্ত হোন।", icon: Users },
              { title: "অনুরোধ বা অনুসন্ধান", desc: "জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।", icon: Search },
              { title: "জীবন বাঁচান", desc: "হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুম্মুর্ষু রোগীর প্রাণ বাঁচান।", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 rounded-[2.5rem] border-2 border-muted hover:border-primary/20 transition-all group bg-white shadow-sm hover:shadow-xl text-center">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg">
                  {idx + 1}
                </div>
                <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. সরাসরি অনুরোধসমূহ */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold font-headline flex items-center gap-3 justify-center md:justify-start">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                সরাসরি অনুরোধসমূহ
              </h2>
              <p className="text-muted-foreground mt-1 text-base">জরুরি ভিত্তিতে যাদের রক্তের প্রয়োজন।</p>
            </div>
            <Button variant="outline" className="rounded-full px-6 h-10 text-sm" asChild>
              <NextLink href="/requests">সব অনুরোধ দেখুন <ArrowRight className="ml-2 h-4 w-4" /></NextLink>
            </Button>
          </div>

          {loadingRequests ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-3xl bg-white group border">
                  <div className={`h-1.5 ${req.isUrgent ? 'bg-primary' : 'bg-slate-800'}`}></div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{req.patientName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1.5 font-medium text-xs">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {req.hospitalName}
                        </CardDescription>
                      </div>
                      <Badge className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white text-[10px] py-0 px-2`}>
                        {req.isUrgent ? 'জরুরি' : 'Approved'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="flex items-center gap-4 py-3 border-y border-dashed my-3">
                      <div className="text-center">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">গ্রুপ</p>
                        <p className="text-xl font-black text-primary">{req.bloodType}</p>
                      </div>
                      <div className="h-6 w-px bg-border"></div>
                      <div className="text-center">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">ব্যাগ</p>
                        <p className="text-xl font-black">{req.bagsNeeded}</p>
                      </div>
                      <div className="h-6 w-px bg-border"></div>
                      <div className="flex-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">কখন</p>
                        <p className="text-sm font-bold truncate">{req.neededWhen}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-xl h-10 gap-2 text-sm" asChild>
                        <a href={`tel:${req.phone}`}><Phone className="h-3.5 w-3.5" /> যোগাযোগ</a>
                      </Button>
                      <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. কেন রক্ত দেবেন? */}
      <section className="py-10 bg-primary/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[350px] lg:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={PlaceHolderImages.find(img => img.id === 'why-donate')?.imageUrl || 'https://picsum.photos/seed/benefits/800/800'} 
                fill 
                alt="রক্তদানের স্বাস্থ্য উপকারিতা - RoktoDao" 
                className="object-cover"
                data-ai-hint="blood donation benefits"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
                <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl">
                  <p className="text-primary font-black text-2xl">১টি</p>
                  <p className="font-bold text-slate-800">রক্তদান ৩ জন মানুষের প্রাণ বাঁচাতে পারে!</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <Badge className="bg-primary text-white border-none">কেন রক্ত দেবেন?</Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-headline leading-tight">রক্তদানের কিছু বিস্ময়কর <span className="text-primary">স্বাস্থ্য উপকারিতা</span></h2>
              </div>
              <div className="grid gap-6">
                {[
                  { title: "হার্টের স্বাস্থ্য ভালো রাখে", desc: "রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে, যা হৃদরোগের ঝুঁকি কমায়।", icon: Heart },
                  { title: "নতুন রক্তকণিকা তৈরি", desc: "রক্ত দেওয়ার পর শরীর নতুন রক্তকণিকা তৈরি করে, যা আপনাকে আরও সতেজ রাখে।", icon: Zap },
                  { title: "বিনামূল্যে স্বাস্থ্য পরীক্ষা", desc: "রক্তদানের সময় আপনার হিমোগ্লোবিন, রক্তচাপ ও অন্যান্য পরীক্ষা বিনামূল্যে করা হয়।", icon: ShieldCheck },
                  { title: "মানসিক প্রশান্তি", desc: "কারো জীবন বাঁচানোর চেয়ে বড় মানসিক তৃপ্তি আর কিছু হতে পারে না।", icon: Star }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-primary rounded-full px-10 h-14 text-xl font-bold" asChild>
                <NextLink href="/register">রক্তদাতা হতে চাই</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI Eligibility CTA */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-[40px] font-black text-white font-headline leading-tight">আপনি কি আজ রক্তদান করতে পারবেন?</h2>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                  আমাদের AI ভিত্তিক কুইজের মাধ্যমে মাত্র ১ মিনিটে আপনার শারীরিক যোগ্যতা যাচাই করুন।
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 h-14 px-10 rounded-full text-xl font-bold" asChild>
                  <NextLink href="/eligibility">আমার যোগ্যতা যাচাই করুন <ArrowRight className="ml-2 h-5 w-5" /></NextLink>
                </Button>
              </div>
              <div className="relative h-[250px] md:h-[350px]">
                <Image 
                  src={PlaceHolderImages.find(img => img.id === 'can-you-donate')?.imageUrl || 'https://picsum.photos/seed/doctor/600/400'} 
                  fill 
                  alt="রক্তদানের যোগ্যতা যাচাই - RoktoDao AI" 
                  className="object-contain"
                  data-ai-hint="blood donor"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. রক্তের গ্রুপের সামঞ্জস্যতা */}
      <section className="py-10 bg-muted/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-3">রক্তের গ্রুপের সামঞ্জস্যতা</h2>
            <p className="text-muted-foreground">জেনে নিন আপনি কাকে রক্ত দিতে পারবেন এবং কার থেকে নিতে পারবেন।</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">রক্তের গ্রুপ</th>
                    <th className="px-6 py-4 font-bold">রক্ত দিতে পারবেন</th>
                    <th className="px-6 py-4 font-bold">রক্ত নিতে পারবেন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bloodTable.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-black text-primary text-lg">{row.type}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{row.give}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{row.take}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 10. পরিচালকের বার্তা */}
      <section className="py-10 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" 
                fill 
                alt="Mujibur Rahman - Founder of RoktoDao" 
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Quote className="h-6 w-6 fill-primary" />
              </div>
              <h2 className="text-3xl font-bold font-headline">পরিচালকের বার্তা</h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                "RoktoDao একটি অলাভজনক উদ্যোগ যা রক্তদাতা এবং গ্রহীতাদের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্যে কাজ করে। প্রযুক্তি ব্যবহার করে জীবন বাঁচানোর এই যাত্রায় আমাদের সঙ্গী হওয়ার জন্য আপনাকে ধন্যবাদ।"
              </p>
              <div>
                <h4 className="text-2xl font-bold text-primary">মুজিবুর রহমান</h4>
                <p className="text-slate-500 font-medium">প্রতিষ্ঠাতা, RoktoDao</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. রক্তদাতাদের কথা */}
      <section className="py-10 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="text-primary border-primary">প্রেরণা</Badge>
            <h2 className="text-3xl font-bold font-headline mt-2">রক্তদাতাদের কথা</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "রাসেল আহমেদ", role: "১০ বার রক্তদাতা", text: "রক্তদান করলে মনের মধ্যে যে অদ্ভুত এক প্রশান্তি আসে, তা আর কিছুতে পাই না। RoktoDao এর মাধ্যমে যোগাযোগ করা এখন অনেক সহজ।", initial: "র" },
              { name: "সুমাইয়া জান্নাত", role: "শিক্ষার্থী", text: "প্রথমবার রক্ত দেওয়ার সময় ভয় লেগেছিল, কিন্তু একজনের প্রাণ বাঁচাতে পেরেছি জেনে এখন নিয়মিত রক্ত দেই।", initial: "স" },
              { name: "ডা. আরিফ হাসান", role: "সহযোগী অধ্যাপক", text: "একজন চিকিৎসক হিসেবে আমি জানি রক্ত কতটা মূল্যবান। RoktoDao এর এই উদ্যোগ সত্যিই প্রশংসনীয়।", initial: "ড" }
            ].map((item, i) => (
              <Card key={i} className="rounded-3xl border-none shadow-lg bg-white p-6 relative">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {item.initial}
                </div>
                <CardContent className="pt-6 px-0">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">"{item.text}"</p>
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-primary font-bold">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12. গ্যালারি */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline">আমাদের গ্যালারি</h2>
            <p className="text-muted-foreground mt-2">আমাদের সাম্প্রতিক ব্লাড ড্রাইভ ও ক্যাম্পেইনের কিছু মুহূর্ত।</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-64 rounded-2xl overflow-hidden group shadow-md">
                <Image 
                  src={`https://picsum.photos/seed/rokto_gallery${i}/600/600`} 
                  fill 
                  alt={`Blood Donation Camp - ${i}`} 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  data-ai-hint="blood donation"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. মোবাইল অ্যাপ ও ভলান্টিয়ার */}
      <section className="py-10 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-primary hover:bg-primary border-none text-white">শীঘ্রই আসছে</Badge>
                <h2 className="text-4xl md:text-5xl font-black font-headline">RoktoDao মোবাইল অ্যাপ</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  এখন পকেটেই থাকবে আপনার এলাকার সব রক্তদাতার তথ্য। জরুরি নোটিফিকেশন ও দ্রুত যোগাযোগের জন্য আমাদের অ্যাপটি হবে আপনার সেরা সঙ্গী।
                </p>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur p-4 rounded-2xl flex items-center gap-3 border border-white/10 w-48">
                  <Smartphone className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Download on</p>
                    <p className="font-bold">Google Play</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur p-4 rounded-2xl flex items-center gap-3 border border-white/10 w-48 opacity-50">
                  <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center font-bold italic">A</div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Coming to</p>
                    <p className="font-bold">App Store</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <HandHeart className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">স্বেচ্ছাসেবক হিসেবে যোগ দিন</h4>
                    <p className="text-slate-400 text-sm">রক্তদান ছাড়াও আমাদের এই মহৎ কাজে আপনি স্বেচ্ছাসেবক হিসেবে অবদান রাখতে পারেন। আমরা আপনার অপেক্ষায় আছি।</p>
                  </div>
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 h-12 font-bold shrink-0">আবেদন করুন</Button>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[550px] hidden lg:block">
              <Image 
                src={PlaceHolderImages.find(img => img.id === 'mobile-app-promo')?.imageUrl || 'https://picsum.photos/seed/app/800/1200'} 
                fill 
                alt="RoktoDao App - Blood Donor Search Bangladesh" 
                className="object-contain"
                data-ai-hint="mobile app"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 14. সহযোগী প্রতিষ্ঠান */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground font-bold uppercase tracking-widest text-xs mb-8">আমাদের সহযোগী প্রতিষ্ঠানসমূহ</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-100 transition-all duration-500">
            {["ঢাকা মেডিকেল", "রেড ক্রিসেন্ট", "বঙ্গবন্ধু মেডিকেল", "ব্লাড ফাউন্ডেশন", "বেসরকারি ক্লিনিক"].map((name, i) => (
              <div key={i} className="flex items-center gap-2 font-black text-xl text-slate-800">
                <div className="h-8 w-8 bg-slate-200 rounded-lg"></div> {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. কেন বেছে নিবেন? */}
      <section className="py-10 bg-muted/5 border-y">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-10">কেন RoktoDao বেছে নিবেন?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "যাচাইকৃত রক্তদাতা", desc: "আমাদের সকল রক্তদাতা মোবাইল নম্বর ভেরিফাইড, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।", icon: ShieldCheck },
              { title: "দ্রুত যোগাযোগ", desc: "সরাসরি ফোন কল বা মেসেজের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।", icon: Zap },
              { title: "দেশব্যাপী নেটওয়ার্ক", desc: "সারাদেশে প্রতিটি জেলা ও উপজেলায় আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত।", icon: Globe },
              { title: "সম্পূর্ণ সুরক্ষিত", desc: "আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা কোনো তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না।", icon: Lock }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="h-16 w-16 bg-white shadow-md rounded-2xl flex items-center justify-center mx-auto">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. সাধারণ জিজ্ঞাসা ও নিউজলেটার */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold font-headline">সাধারণ জিজ্ঞাসা</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "সাধারণত ১৮ থেকে ৬০ বছর বয়সের যেকোনো সুস্থ মানুষ রক্ত দিতে পারেন। তবে ওজন অবশ্যই ৫০ কেজির উপরে হতে হবে।" },
                  { q: "কারা রক্তদান করতে পারবেন না?", a: "যাদের উচ্চ রক্তচাপ, ডায়াবেটিস (নিয়ন্ত্রিত না থাকলে), জন্ডিস বা অন্য কোনো রক্তবাহিত রোগ আছে তারা রক্ত দিতে পারবেন না।" },
                  { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ মানুষ প্রতি ৪ মাস (বা ১২০ দিন) অন্তর রক্তদান করতে পারেন।" },
                  { q: "রক্ত দিতে কি কোনো টাকা লাগে?", a: "না, রক্তদান একটি সম্পূর্ণ মানবিক ও বিনামূল্যে করার কাজ। রক্ত কেনাবেচা করা একটি দণ্ডনীয় অপরাধ।" },
                  { q: "রক্তদানের পর কি কোনো বিশ্রাম প্রয়োজন?", a: "রক্তদানের পর অন্তত ১৫-২০ মিনিট বিশ্রাম নেওয়া উচিত এবং প্রচুর পরিমাণে তরল খাবার পান করা ভালো।" }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b">
                    <AccordionTrigger className="text-left font-bold py-4 hover:text-primary transition-colors">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="bg-primary/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center space-y-8">
              <div className="h-16 w-16 bg-white shadow-sm rounded-2xl flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold font-headline">আপডেট থাকতে চান?</h3>
                <p className="text-muted-foreground text-lg">আমাদের আগামী রক্তদান ক্যাম্পেইন ও গুরুত্বপূর্ণ খবরাখবর ইমেইলে পেতে সাবস্ক্রাইব করুন।</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল ঠিকানা" 
                  className="flex-1 h-14 rounded-full px-6 border-2 border-primary/10 focus:border-primary outline-none transition-all"
                  suppressHydrationWarning
                />
                <Button className="h-14 rounded-full px-10 bg-primary hover:bg-primary/90 text-lg font-bold">সাবস্ক্ৰাইব</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 17. ইমার্জেন্সি সাপোর্ট বার */}
      <section className="bg-red-50 py-6 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-base">জরুরি কোনো সাহায্য প্রয়োজন?</h4>
              <p className="text-muted-foreground text-sm">আমাদের হেল্পলাইন নম্বরে কল করুন সরাসরি সাহায্যের জন্য।</p>
            </div>
          </div>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full h-12 px-8 text-lg font-black gap-2 transition-all" asChild>
            <a href="tel:+8801234567890"><Phone className="h-5 w-5" /> +৮৮০ ১২৩৪ ৫৬৭ ৮৯০</a>
          </Button>
        </div>
      </section>
    </div>
  );
}

// Helper icon
function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
