'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Search, Users, 
  CheckCircle, Phone, Share2, Clock, Loader2, 
  ImageIcon, Smartphone, HandHeart, 
  HelpCircle, Mail, Globe, Zap, Star, Quote, MessageSquare, Plus, Hospital, Award, Info, Facebook
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
    if (selectedDistrict !== 'যেকোনো জেলা') params.set('district', selectedDistrict);
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
      <section className="relative w-full py-8 md:py-12 flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden border-b border-primary/5">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto relative z-10 max-w-5xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <Droplet className="h-8 w-8 md:h-12 md:w-12 text-primary fill-primary drop-shadow-xl" />
            <h2 className="text-3xl md:text-[48px] font-black tracking-tight text-primary font-headline leading-tight">“আপনার রক্তে বাঁচবে অন্যের স্বপ্ন!”</h2>
          </div>
          <p className="text-lg md:text-[18px] text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium">জরুরী মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 md:h-14 px-8 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group transition-all hover:scale-[1.02]" asChild>
              <NextLink href="/register"><Heart className="h-5 w-5 text-white group-hover:scale-110 transition-transform" /> রক্ত দিতে চাই</NextLink>
            </Button>
            <Button size="lg" variant="outline" className="bg-white hover:bg-muted/50 h-12 md:h-14 px-8 rounded-xl text-lg font-bold border-none shadow-md gap-3 group transition-all hover:scale-[1.02]" asChild>
              <NextLink href="/donors"><Search className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform" /> রক্ত খুঁজছি</NextLink>
            </Button>
          </div>
          <div className="max-w-xl mx-auto pt-2">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-primary/5 flex flex-col md:flex-row gap-1.5">
              <div className="flex-1">
                <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                  <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-sm font-bold text-muted-foreground"><div className="flex items-center gap-2"><Droplet className="h-4 w-4 text-primary" /><SelectValue placeholder="রক্তের গ্রুপ" /></div></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-px bg-border/50 hidden md:block"></div>
              <div className="flex-1">
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 text-sm font-bold text-muted-foreground"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><SelectValue placeholder="জেলা" /></div></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} size="icon" className="h-10 w-10 md:w-12 bg-primary hover:bg-primary/90 rounded-xl shrink-0 shadow-lg shadow-primary/10"><Search className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { val: "২৫,০০০+", label: "নিবন্ধিত দাতা", icon: Users, color: "text-blue-600" },
              { val: "১৫,০০০+", label: "রক্তের অনুরোধ", icon: Droplet, color: "text-primary" },
              { val: "১২,৫০০+", label: "সফল রক্তদান", icon: Heart, color: "text-red-500" },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: Globe, color: "text-green-600" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-1.5 rounded-2xl hover:bg-muted/30 transition-colors">
                <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-1.5 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
                <div className="text-xl md:text-2xl font-black font-headline mb-0.5">{stat.val}</div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 space-y-0.5">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h2>
            <p className="text-base text-muted-foreground font-medium italic">"Our active and available donors"</p>
            <div className="h-1 w-12 bg-primary mx-auto rounded-full mt-2"></div>
          </div>
          {loadingDonors ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
              {donors.map((donor, idx) => (
                <Card key={idx} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all rounded-[1.5rem] group border-t-4 border-t-primary/20 bg-muted/5">
                  <CardHeader className="bg-primary/5 pb-3 pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">{(donor.fullName || 'D').substring(0, 1)}</div>
                        <div className="space-y-0.5">
                          <CardTitle className="text-base font-bold">{donor.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-[10px]"><MapPin className="h-2.5 w-2.5 text-primary" /> {donor.area}, {donor.district}</CardDescription>
                          {donor.organization && <div className="flex items-center gap-1.5 text-secondary font-bold text-[9px] bg-secondary/5 px-1.5 py-0.5 rounded-md border border-secondary/10 w-fit"><Users className="h-2.5 w-2.5" /> {donor.organization}</div>}
                        </div>
                      </div>
                      <Badge className="bg-primary text-white text-base font-black h-8 w-8 flex items-center justify-center p-0 rounded-xl shadow-md">{donor.bloodType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-3">
                    {donor.totalDonations && donor.totalDonations > 0 ? (
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-white/50 rounded-xl border">
                          <p className="text-muted-foreground uppercase text-[7px] font-bold">শেষ রক্তদান</p>
                          <p className="font-bold">{donor.lastDonationDate || 'N/A'}</p>
                        </div>
                        <div className="p-2 bg-white/50 rounded-xl border">
                          <p className="text-muted-foreground uppercase text-[7px] font-bold">মোট রক্তদান</p>
                          <p className="font-bold">{donor.totalDonations} বার</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-lg border border-green-100 w-fit"><ShieldCheck className="h-3 w-3" /> ভেরিফাইড রক্তদাতা</div>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 border-t">
                    <Button className="w-full h-10 rounded-none bg-primary hover:bg-primary/90 text-sm font-bold gap-2" asChild>
                      <a href={`tel:${donor.phone}`}><Phone className="h-3.5 w-3.5" /> যোগাযোগ করুন</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center"><Button size="sm" variant="outline" className="rounded-full px-6 h-10 text-sm border-primary text-primary hover:bg-primary/5" asChild><NextLink href="/donors">সব রক্তদাতা দেখুন <ArrowRight className="ml-1 h-3.5 w-3.5" /></NextLink></Button></div>
        </div>
      </section>

      <section className="bg-muted/10 py-8 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 space-y-0.5">
            <Badge variant="outline" className="text-primary border-primary py-0 text-[10px]">প্রক্রিয়া</Badge>
            <h2 className="text-2xl md:text-3xl font-bold font-headline">রক্তদান প্রক্রিয়া মাত্র ৩ ধাপে</h2>
            <div className="h-1 w-12 bg-primary mx-auto rounded-full mt-2"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "নিবন্ধন", desc: "আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী ডেটাবেজে যুক্ত হোন।", icon: Users },
              { title: "অনুরোধ বা অনুসন্ধান", desc: "জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।", icon: Search },
              { title: "জীবন বাঁচান", desc: "হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুম্মুর্ষু রোগীর প্রাণ বাঁচান।", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="relative p-5 rounded-[2rem] border border-muted hover:border-primary/20 transition-all group bg-white shadow-sm hover:shadow-md text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-md">{idx + 1}</div>
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"><item.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-2 justify-center md:justify-start"><span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span></span>সরাসরি অনুরোধসমূহ</h2>
              <p className="text-muted-foreground text-sm">জরুরি ভিত্তিতে যাদের রক্তের প্রয়োজন।</p>
            </div>
            <Button variant="outline" className="rounded-full px-4 h-8 text-xs" asChild><NextLink href="/requests">সব অনুরোধ দেখুন <ArrowRight className="ml-1 h-3 w-3" /></NextLink></Button>
          </div>
          {loadingRequests ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all rounded-2xl bg-white group border">
                  <div className={`h-1 ${req.isUrgent ? 'bg-primary' : 'bg-slate-800'}`}></div>
                  <CardHeader className="p-4 pb-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold">{req.patientName}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1 font-medium text-[10px]"><MapPin className="h-3 w-3 text-primary" /> {req.hospitalName}</CardDescription>
                      </div>
                      <Badge className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white text-[9px] py-0 px-1.5 h-5`}>{req.isUrgent ? 'জরুরি' : 'Approved'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex items-center gap-3 py-2 border-y border-dashed my-2">
                      <div className="text-center">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">গ্রুপ</p>
                        <p className="text-lg font-black text-primary">{req.bloodType}</p>
                      </div>
                      <div className="h-5 w-px bg-border"></div>
                      <div className="text-center">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">ব্যাগ</p>
                        <p className="text-lg font-black">{req.bagsNeeded}</p>
                      </div>
                      <div className="h-5 w-px bg-border"></div>
                      <div className="flex-1">
                        <p className="text-[8px] uppercase font-bold text-muted-foreground">কখন</p>
                        <p className="text-xs font-bold truncate">{req.neededWhen}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-lg h-9 gap-1.5 text-xs font-bold" asChild><a href={`tel:${req.phone}`}><Phone className="h-3 w-3" /> যোগাযোগ</a></Button>
                      <Button variant="secondary" size="icon" className="h-9 w-9 rounded-lg"><Share2 className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rest of home page components... */}
      <section className="py-8 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-[250px] lg:h-[400px] rounded-[2rem] overflow-hidden shadow-xl">
              <Image src="https://image.mojib.me/uploads/General/1771907154_%E0%A6%95%E0%A7%87%E0%A6%A8%20%E0%A6%B0%E0%A6%95%E0%A7%8D%E0%A6%A4%20%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A7%87%E0%A6%A8.png" fill alt="রক্তদানের স্বাস্থ্য উপকারিতা" className="object-cover" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold font-headline leading-tight">রক্তদানের <span className="text-primary">স্বাস্থ্য উপকারিতা</span></h2>
              <div className="grid gap-3">
                {[
                  { title: "হার্টের স্বাস্থ্য ভালো রাখে", desc: "রক্তদান করলে শরীরে আয়রনের ভারসাম্য বজায় থাকে, যা হৃদরোগের ঝুঁকি কমায়।", icon: Heart },
                  { title: "বিনামূল্যে স্বাস্থ্য পরীক্ষা", desc: "রক্তদানের সময় আপনার হিমোগ্লোবিন, রক্তচাপ ও অন্যান্য পরীক্ষা বিনামূল্যে করা হয়।", icon: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white shadow-sm"><div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><item.icon className="h-5 w-5 text-primary" /></div><div><h4 className="font-bold text-sm">{item.title}</h4><p className="text-muted-foreground text-[11px]">{item.desc}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-muted/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-6"><h2 className="text-2xl font-bold font-headline mb-2">রক্তের গ্রুপের সামঞ্জস্যতা</h2></div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary text-white"><tr><th className="px-4 py-3">রক্তের গ্রুপ</th><th className="px-4 py-3">রক্ত দিতে পারবেন</th><th className="px-4 py-3">রক্ত নিতে পারবেন</th></tr></thead>
              <tbody className="divide-y">{bloodTable.map((row, i) => (<tr key={i}><td className="px-4 py-3 font-black text-primary">{row.type}</td><td className="px-4 py-3">{row.give}</td><td className="px-4 py-3">{row.take}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[300px] rounded-[2rem] overflow-hidden shadow-lg"><Image src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" fill alt="Founder" className="object-cover" /></div>
            <div className="space-y-4"><Quote className="h-10 w-10 text-primary opacity-20" /><h2 className="text-2xl font-bold font-headline">পরিচালকের বার্তা</h2><p className="text-lg text-muted-foreground italic">"রক্তদাতা এবং গ্রহীতাদের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্যে আমরা কাজ করি।"</p><div><h4 className="text-xl font-bold text-primary">মুজিবুর রহমান</h4><p className="text-slate-500 text-sm">প্রতিষ্ঠাতা, RoktoDao</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black font-headline">RoktoDao মোবাইল অ্যাপ</h2>
              <p className="text-slate-400">এখন পকেটেই থাকবে আপনার এলাকার সব রক্তদাতার তথ্য। শীঘ্রই আসছে।</p>
              <div className="flex gap-3"><div className="bg-white/10 p-3 rounded-xl flex items-center gap-2"><Smartphone className="h-6 w-6 text-primary" /><div><p className="text-[8px] uppercase">Download on</p><p className="font-bold text-sm">Google Play</p></div></div></div>
            </div>
            <div className="relative h-[300px] hidden lg:block"><Image src="https://image.mojib.me/uploads/General/1771910851_ROktoDao%20app.png" fill alt="App" className="object-contain" /></div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white"><div className="container mx-auto px-4 text-center"><h2 className="text-2xl font-bold font-headline mb-8">কেন RoktoDao বেছে নিবেন?</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{[{ title: "যাচাইকৃত রক্তদাতা", icon: ShieldCheck }, { title: "দ্রুত যোগাযোগ", icon: Zap }, { title: "দেশব্যাপী নেটওয়ার্ক", icon: Globe }, { title: "সম্পূর্ণ সুরক্ষিত", icon: ShieldCheck }].map((item, i) => (<div key={i} className="space-y-3"><div className="h-12 w-12 bg-white shadow-sm rounded-xl flex items-center justify-center mx-auto"><item.icon className="h-6 w-6 text-primary" /></div><h4 className="font-bold text-sm">{item.title}</h4></div>))}</div></div></section>

      <section className="bg-red-50 py-4 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div><h4 className="font-bold text-sm">জরুরি কোনো সাহায্য প্রয়োজন?</h4><p className="text-muted-foreground text-[11px]">কল করুন সরাসরি সাহায্যের জন্য।</p></div></div>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white"><Facebook className="h-5 w-5" /></a>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full h-10 px-6 text-base font-black" asChild><a href="tel:+8801600151907">+8801600151907</a></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
