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

  const whyDonateImage = PlaceHolderImages.find(img => img.id === 'why-donate')?.imageUrl || 'https://picsum.photos/seed/why-donate/800/600';
  const canYouDonateImage = PlaceHolderImages.find(img => img.id === 'can-you-donate')?.imageUrl || '';
  const mobileAppImage = PlaceHolderImages.find(img => img.id === 'mobile-app-promo')?.imageUrl || 'https://picsum.photos/seed/mobile/800/1000';

  return (
    <div className="flex flex-col gap-0 pb-0 overflow-x-hidden">
      {/* 1. হিরো সেকশন */}
      <section className="relative w-full py-12 md:py-20 flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto relative z-10 max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <Droplet className="h-10 w-10 md:h-14 md:w-14 text-primary fill-primary drop-shadow-xl" />
            <h1 className="text-3xl md:text-[56px] font-black tracking-tight text-primary font-headline leading-tight">
              “আপনার রক্তে বাঁচবে অন্যের স্বপ্ন!”
            </h1>
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
          <div className="max-w-2xl mx-auto pt-8 animate-in fade-in slide-in-from-bottom-5 delay-500 duration-1000">
            <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-primary/5 flex flex-col md:flex-row gap-2">
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
      <section className="bg-white py-10 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-500" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl md:text-3xl font-black font-headline mb-1">{stat.val}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. আমাদের রক্তযোদ্ধারা */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-lg text-muted-foreground font-medium italic">"Our active and available donors"</p>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-4"></div>
          </div>

          {loadingDonors ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-[2.5rem] group border-t-4 border-t-primary/20 bg-muted/5">
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

      {/* 5. কিভাবে কাজ করে */}
      <section className="bg-muted/10 py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-2">
            <Badge variant="outline" className="text-primary border-primary">প্রক্রিয়া</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-headline">রক্তদান প্রক্রিয়া মাত্র ৩ ধাপে</h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-4"></div>
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

      {/* 6. জরুরি রক্তের রিকোয়েস্ট */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
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
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
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

      {/* 19. ইমার্জেন্সি সাপোর্ট বার */}
      <section className="bg-red-50 py-8 border-t">
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
