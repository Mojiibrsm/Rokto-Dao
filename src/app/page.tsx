'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Search, Users, 
  CheckCircle, Phone, Share2, Clock, Loader2, 
  Smartphone, HandHeart, 
  Globe, Zap, Quote, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
      {/* 1. Hero Section - Compact */}
      <section className="relative w-full py-10 md:py-16 flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden border-b border-primary/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto relative z-10 max-w-5xl space-y-6">
          <Badge variant="outline" className="text-primary border-primary px-4 py-1 uppercase tracking-widest font-black text-[10px] bg-primary/5">স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচান</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary font-headline leading-tight">আপনার নিকটবর্তী <br />রক্তদাতা খুঁজুন</h1>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-medium">জরুরী মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।</p>
          </div>
          
          <div className="max-w-2xl mx-auto pt-4">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-primary/10 flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="h-12 border-none bg-transparent focus:ring-0 text-base font-bold text-muted-foreground"><div className="flex items-center gap-2"><Droplet className="h-5 w-5 text-primary" /><SelectValue placeholder="রক্তের গ্রুপ" /></div></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-px bg-border/50 hidden md:block"></div>
              <div className="flex-1">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="h-12 border-none bg-transparent focus:ring-0 text-base font-bold text-muted-foreground"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><SelectValue placeholder="জেলা" /></div></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-xl shrink-0 shadow-lg shadow-primary/10 transition-all font-bold text-lg">অনুসন্ধান করুন</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-500" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-2 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                <div className="text-2xl md:text-3xl font-black font-headline mb-0.5">{stat.val}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Active Donors Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-base text-muted-foreground font-medium">"Our active and available donors"</p>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full mt-3"></div>
          </div>
          {loadingDonors ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all rounded-[1.5rem] group border-t-4 border-t-primary/20 bg-muted/5">
                  <CardHeader className="bg-primary/5 pb-4 pt-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">{(donor.fullName || 'D').substring(0, 1)}</div>
                        <div className="space-y-0.5">
                          <CardTitle className="text-lg font-bold">{donor.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-1.5 text-xs"><MapPin className="h-3 w-3 text-primary" /> {donor.area}, {donor.district}</CardDescription>
                          {donor.organization && <div className="flex items-center gap-1.5 text-secondary font-bold text-[10px] bg-secondary/5 px-2 py-0.5 rounded-md border border-secondary/10 w-fit mt-1"><Users className="h-3 w-3" /> {donor.organization}</div>}
                        </div>
                      </div>
                      <Badge className="bg-primary text-white text-lg font-black h-10 w-10 flex items-center justify-center p-0 rounded-xl shadow-md">{donor.bloodType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {donor.totalDonations && donor.totalDonations > 0 ? (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white/50 rounded-xl border">
                          <p className="text-muted-foreground uppercase text-[8px] font-bold mb-1">শেষ রক্তদান</p>
                          <p className="font-bold">{donor.lastDonationDate || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-xl border">
                          <p className="text-muted-foreground uppercase text-[8px] font-bold mb-1">মোট রক্তদান</p>
                          <p className="font-bold">{donor.totalDonations} বার</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-3 py-2 rounded-lg border border-green-100 w-fit"><ShieldCheck className="h-4 w-4" /> ভেরিফাইড রক্তদাতা</div>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 border-t">
                    <Button className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 text-base font-bold gap-2 transition-all" asChild>
                      <a href={`tel:${donor.phone}`}><Phone className="h-4 w-4" /> যোগাযোগ করুন</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center"><Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-primary text-primary hover:bg-primary/5 font-bold" asChild><NextLink href="/donors">সব রক্তদাতা দেখুন <ArrowRight className="ml-2 h-4 w-4" /></NextLink></Button></div>
        </div>
      </section>

      {/* 4. Process Section */}
      <section className="bg-muted/10 py-12 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-1">
            <Badge variant="outline" className="text-primary border-primary py-0.5 text-xs uppercase font-bold tracking-widest">প্রক্রিয়া</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-headline mt-2">রক্তদান প্রক্রিয়া মাত্র ৩ ধাপে</h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full mt-3"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { title: "নিবন্ধন", desc: "আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী দেশব্যাপী ডেটাবেজে যুক্ত হোন।", icon: Users },
              { title: "অনুরোধ বা অনুসন্ধান", desc: "জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।", icon: Search },
              { title: "জীবন বাঁচান", desc: "হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুম্মুর্ষু রোগীর প্রাণ বাঁচান।", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 rounded-[2.5rem] border border-muted hover:border-primary/20 transition-all group bg-white shadow-sm hover:shadow-md text-center">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-md">{idx + 1}</div>
                <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><item.icon className="h-7 w-7 text-primary" /></div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Requests Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold font-headline flex items-center gap-3 justify-center md:justify-start">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
                </span>
                সরাসরি অনুরোধসমূহ
              </h2>
              <p className="text-muted-foreground text-base mt-1">জরুরি ভিত্তিতে যাদের রক্তের প্রয়োজন।</p>
            </div>
            <Button variant="outline" className="rounded-full px-6 h-10 text-sm font-bold border-primary text-primary hover:bg-primary/5" asChild><NextLink href="/requests">সব অনুরোধ দেখুন <ArrowRight className="ml-2 h-4 w-4" /></NextLink></Button>
          </div>
          {loadingRequests ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all rounded-2xl bg-white group border">
                  <div className={`h-1.5 ${req.isUrgent ? 'bg-primary' : 'bg-slate-800'}`}></div>
                  <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold">{req.patientName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1.5 font-medium text-xs"><MapPin className="h-4 w-4 text-primary" /> {req.hospitalName}</CardDescription>
                      </div>
                      <Badge className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white text-[10px] uppercase font-black py-0.5 px-2.5 h-6`}>{req.isUrgent ? 'জরুরি' : 'Approved'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center gap-4 py-3 border-y border-dashed my-3">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">গ্রুপ</p>
                        <p className="text-2xl font-black text-primary">{req.bloodType}</p>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">ব্যাগ</p>
                        <p className="text-2xl font-black">{req.bagsNeeded}</p>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">কখন</p>
                        <p className="text-sm font-bold truncate">{req.neededWhen}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-xl h-11 gap-2 text-sm font-bold shadow-lg shadow-primary/10" asChild><a href={`tel:${req.phone}`}><Phone className="h-4 w-4" /> যোগাযোগ</a></Button>
                      <Button onClick={() => handleShare(req)} variant="secondary" size="icon" className="h-11 w-11 rounded-xl transition-colors"><Share2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Donate / Health Benefits */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[300px] lg:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image src={PlaceHolderImages.find(img => img.id === 'why-donate')?.imageUrl || "https://picsum.photos/seed/benefits/800/600"} fill alt="রক্তদানের স্বাস্থ্য উপকারিতা" className="object-cover" data-ai-hint="blood donation benefits" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-headline leading-tight">কেন রক্ত দেবেন?</h2>
              <p className="text-muted-foreground text-lg italic">১টি রক্তদান ৩ জন মানুষের প্রাণ বাঁচাতে পারে!</p>
              <div className="grid gap-4">
                {[
                  { title: "হার্টের স্বাস্থ্য ভালো রাখে", desc: "রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে, যা হৃদরোগের ঝুঁকি কমায়।", icon: Heart },
                  { title: "নতুন রক্তকণিকা তৈরি", desc: "রক্ত দেওয়ার পর শরীর নতুন রক্তকণিকা তৈরি করে, যা আপনাকে আরও সতেজ রাখে।", icon: Zap },
                  { title: "বিনামূল্যে স্বাস্থ্য পরীক্ষা", desc: "রক্তদানের সময় আপনার হিমোগ্লোবিন, রক্তচাপ ও অন্যান্য পরীক্ষা বিনামূল্যে করা হয়।", icon: ShieldCheck },
                  { title: "মানসিক প্রশান্তি", desc: "কারো জীবন বাঁচানোর চেয়ে বড় মানসিক তৃপ্তি আর কিছু হতে পারে না।", icon: Award }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><item.icon className="h-6 w-6 text-primary" /></div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-full px-10 h-12 text-lg font-bold bg-primary shadow-lg shadow-primary/20" asChild>
                <NextLink href="/register">রক্তদাতা হতে চাই</NextLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Eligibility Quiz Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-slate-950 rounded-[3rem] p-8 md:p-16 overflow-hidden relative group border border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black font-headline text-white leading-[1.1]">
                আপনি কি আজ রক্তদান করতে পারবেন?
              </h2>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
                আমাদের AI ভিত্তিক কুইজের মাধ্যমে মাত্র ১ মিনিটে আপনার শারীরিক যোগ্যতা যাচাই করুন।
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-16 px-10 rounded-full text-xl font-bold gap-3 group shadow-2xl shadow-primary/30 transition-all active:scale-95" asChild>
                <NextLink href="/eligibility">
                  আমার যোগ্যতা যাচাই করুন <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </NextLink>
              </Button>
            </div>
            
            <div className="relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[6px] border-white/5 group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                <Image 
                  src={PlaceHolderImages.find(img => img.id === 'can-you-donate')?.imageUrl || "https://picsum.photos/seed/eligibility/600/800"} 
                  fill 
                  alt="Can You Donate Blood Today?" 
                  className="object-cover"
                  data-ai-hint="blood donor"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Blood Compatibility Section */}
      <section className="py-12 bg-muted/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline mb-3">রক্তের গ্রুপের সামঞ্জস্যতা</h2>
            <p className="text-muted-foreground">জেনে নিন আপনি কাকে রক্ত দিতে পারবেন এবং কার থেকে নিতে পারবেন।</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-primary/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">রক্তের গ্রুপ</th>
                    <th className="px-6 py-4 font-bold">রক্ত দিতে পারবেন</th>
                    <th className="px-6 py-4 font-bold">রক্ত নিতে পারবেন</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bloodTable.map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-black text-primary text-xl">{row.type}</td>
                      <td className="px-6 py-4 font-medium">{row.give}</td>
                      <td className="px-6 py-4 font-medium">{row.take}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Founder's Message */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[350px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" fill alt="Founder" className="object-cover" />
            </div>
            <div className="space-y-6">
              <Quote className="h-12 w-12 text-primary opacity-20 mb-2" />
              <h2 className="text-3xl md:text-4xl font-bold font-headline">পরিচালকের বার্তা</h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic font-medium">
                "RoktoDao একটি অলাভজনক উদ্যোগ যা রক্তদাতা এবং গ্রহীতাদের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্যে কাজ করে। প্রযুক্তি ব্যবহার করে জীবন বাঁচানোর এই যাত্রায় আমাদের সঙ্গী হওয়ার জন্য আপনাকে ধন্যবাদ।"
              </p>
              <div className="pt-4">
                <h4 className="text-2xl font-bold text-primary">মুজিবুর রহমান</h4>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-1">প্রতিষ্ঠাতা, RoktoDao</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-primary border-primary mb-2">প্রেরণা</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-headline">রক্তদাতাদের কথা</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "রাসেল আহমেদ", role: "১০ বার রক্তদাতা", text: "রক্তদান করলে মনের মধ্যে যে অদ্ভুত এক প্রশান্তি আসে, তা আর কিছুতে পাই না। RoktoDao এর মাধ্যমে যোগাযোগ করা এখন অনেক সহজ।" },
              { name: "সুমাইয়া জান্নাত", role: "শিক্ষার্থী", text: "প্রথমবার রক্ত দেওয়ার সময় ভয় লেগেছিল, কিন্তু একজনের প্রাণ বাঁচাতে পেরেছি জেনে এখন নিয়মিত রক্ত দেই।" },
              { name: "ডা. আরিফ হাসান", role: "সহযোগী অধ্যাপক", text: "একজন চিকিৎসক হিসেবে আমি জানি রক্ত কতটা মূল্যবান। RoktoDao এর এই উদ্যোগ সত্যিই প্রশংসনীয়।" }
            ].map((t, i) => (
              <Card key={i} className="rounded-3xl p-6 border-none shadow-lg bg-white relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary opacity-10" />
                <CardContent className="p-0 space-y-4">
                  <p className="text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 border-t pt-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{t.name[0]}</div>
                    <div>
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Gallery - Compact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-headline">আমাদের গ্যালারি</h2>
            <p className="text-muted-foreground mt-2">আমাদের সাম্প্রতিক ব্লাড ড্রাইভ ও ক্যাম্পেইনের কিছু মুহূর্ত।</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-md group">
                <Image 
                  src={PlaceHolderImages.find(img => img.id === `gallery-${i % 2 === 0 ? 2 : 1}`)?.imageUrl || `https://picsum.photos/seed/camp${i}/600/600`} 
                  fill 
                  alt={`Camp ${i}`} 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  data-ai-hint="blood donation"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. App Promo Section */}
      <section className="py-12 bg-slate-900 text-white overflow-hidden relative border-y border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary hover:bg-primary border-none text-xs px-4 py-1">শীঘ্রই আসছে</Badge>
              <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight">RoktoDao মোবাইল অ্যাপ</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                এখন পকেটেই থাকবে আপনার এলাকার সব রক্তদাতার তথ্য। জরুরি নোটিফিকেশন ও দ্রুত যোগাযোগের জন্য আমাদের অ্যাপটি হবে আপনার সেরা সঙ্গী।
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3 border border-white/5 hover:bg-white/20 transition-all cursor-pointer">
                  <Smartphone className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Download on</p>
                    <p className="font-bold text-lg">Google Play</p>
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-3 border border-white/5 hover:bg-white/20 transition-all cursor-pointer">
                  <Globe className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Coming to</p>
                    <p className="font-bold text-lg">App Store</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] hidden lg:block drop-shadow-2xl">
              <Image src={PlaceHolderImages.find(img => img.id === 'mobile-app-promo')?.imageUrl || "https://image.mojib.me/uploads/General/1771910851_ROktoDao%20app.png"} fill alt="RoktoDao Mobile App Promo" className="object-contain" data-ai-hint="mobile app" />
            </div>
          </div>
        </div>
      </section>

      {/* 13. Partner Logos / Trust */}
      <section className="py-12 bg-white grayscale opacity-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">আমাদের সহযোগী প্রতিষ্ঠানসমূহ</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["ঢাকা মেডিকেল", "রেড ক্রিসেন্ট", "বঙ্গবন্ধু মেডিকেল", "ব্লাড ফাউন্ডেশন", "বেসরকারি ক্লিনিক"].map((p, i) => (
              <span key={i} className="text-xl md:text-2xl font-black font-headline whitespace-nowrap">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Why Choose Us */}
      <section className="py-16 bg-muted/10 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">কেন RoktoDao বেছে নিবেন?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "যাচাইকৃত রক্তদাতা", desc: "আমাদের সকল রক্তদাতা মোবাইল নম্বর ভেরিফাইড, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।" },
              { icon: Zap, title: "দ্রুত যোগাযোগ", desc: "সরাসরি ফোন কল বা মেসেজের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।" },
              { icon: Globe, title: "দেশব্যাপী নেটওয়ার্ক", desc: "সারাদেশে প্রতিটি জেলা ও উপজেলায় আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত।" },
              { icon: Lock, title: "সম্পূর্ণ সুরক্ষিত", desc: "আপনার ব্যক্তিগত তথ্য আমাদের কাছে নিরাপদ। আমরা কোনো তথ্য তৃতীয় পক্ষের কাছে শেয়ার করি না।" }
            ].map((v, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto"><v.icon className="h-6 w-6" /></div>
                <h4 className="font-bold text-lg">{v.title}</h4>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-primary border-primary mb-2">সহযোগিতা</Badge>
            <h2 className="text-3xl font-bold font-headline mb-4">সাধারণ জিজ্ঞাসা</h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full"></div>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "১৮ থেকে ৬৫ বছর বয়সী যেকোনো সুস্থ ব্যক্তি যার ওজন অন্তত ৫০ কেজি, তিনি রক্ত দিতে পারেন।" },
              { q: "কারা রক্তদান করতে পারবেন না?", a: "যাদের রক্তে কোনো রোগ আছে, যারা গত ৪৮ ঘণ্টায় অ্যান্টিবায়োটিক নিয়েছেন বা কোনো বড় সার্জারি করেছেন, তারা রক্ত পারবেন না।" },
              { q: "কতদিন পর পর রক্তদান করা যায়?", a: "পুরুষেরা প্রতি ৩ মাস এবং মহিলারা প্রতি ৪ মাস অন্তর নিরাপদভাবে রক্তদান করতে পারেন।" },
              { q: "রক্ত দিতে কি কোনো টাকা লাগে?", a: "রক্তদান একটি সম্পূর্ণ মানবিক ও স্বেচ্ছাসেবী কাজ। RoktoDao কোনো আর্থিক লেনদেন সমর্থন করে না।" },
              { q: "রক্তদানের পর কি কোনো বিশ্রাম প্রয়োজন?", a: "রক্তদানের পর ১০-১৫ মিনিট বিশ্রাম নেওয়া এবং প্রচুর পানি বা জুস খাওয়া জরুরি।" }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-muted/5 border-primary/5">
                <AccordionTrigger className="text-lg font-bold hover:no-underline text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 16. Newsletter - Compact */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8">
          <h2 className="text-3xl font-bold font-headline">আপডেট থাকতে চান?</h2>
          <p className="text-muted-foreground text-lg">আমাদের আগামী রক্তদান ক্যাম্পেইন ও গুরুত্বপূর্ণ খবরাখবর ইমেইলে পেতে সাবস্ক্রাইব করুন।</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল ঠিকানা" 
              className="flex-1 h-14 rounded-full px-6 border-2 border-primary/10 focus:border-primary outline-none transition-all"
              suppressHydrationWarning
            />
            <Button className="h-14 rounded-full px-8 bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">সাবস্ক্রাইব</Button>
          </div>
        </div>
      </section>

      {/* 17. Final Emergency Contact - Compact */}
      <section className="bg-primary py-6 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Phone className="h-6 w-6" /></div>
            <div>
              <h4 className="font-bold text-lg">জরুরি কোনো সাহায্য প্রয়োজন?</h4>
              <p className="text-white/80 text-sm">আমাদের হেল্পলাইন নম্বরে কল করুন সরাসরি সাহায্যের জন্য।</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary hover:bg-slate-100 transition-all shadow-lg"><Facebook className="h-6 w-6" /></a>
            <Button variant="outline" className="bg-white border-none text-primary hover:bg-slate-100 rounded-full h-12 px-8 text-xl font-black shadow-lg" asChild>
              <a href="tel:+8801600151907">+8801600151907</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Lock, Facebook } from 'lucide-react';