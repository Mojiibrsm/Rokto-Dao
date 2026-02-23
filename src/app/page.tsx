
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet, Heart, ShieldCheck, MapPin, ArrowRight, Search, Users, CheckCircle, Phone, Share2, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBloodRequests, type BloodRequest } from '@/lib/sheets';
import { DISTRICTS } from '@/lib/bangladesh-data';

export default function Home() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoadingRequests(true);
      try {
        const data = await getBloodRequests();
        setRequests(data.slice(0, 4)); // Show only latest 4 on home
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRequests(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-0 pb-12 overflow-x-hidden">
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
                <Select>
                  <SelectTrigger className="h-14 text-lg border-2 focus:ring-primary">
                    <SelectValue placeholder="যেকোনো গ্রুপ" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select>
                  <SelectTrigger className="h-14 text-lg border-2 focus:ring-primary">
                    <SelectValue placeholder="যেকোনো জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">যেকোনো জেলা</SelectItem>
                    {DISTRICTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90 h-14 text-xl font-bold gap-3 rounded-xl shadow-lg shadow-primary/20 w-full transition-all hover:scale-[1.02]">
                <Search className="h-6 w-6" /> অনুসন্ধান করুন
              </Button>
            </div>
          </Card>

          <div className="flex flex-wrap justify-center gap-6">
            <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/5 h-14 px-10 text-lg rounded-full font-bold">
              <Link href="/requests">রক্তের অনুরোধ দেখুন</Link>
            </Button>
            <Button size="lg" asChild className="bg-secondary text-white hover:bg-secondary/90 h-14 px-10 text-lg rounded-full font-bold shadow-lg transition-transform hover:scale-105">
              <Link href="/register">রক্তদাতা হতে চাই</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. কিভাবে কাজ করে */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">কিভাবে কাজ করে?</h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-16 md:grid-cols-3 relative">
            {[
              { title: "নিবন্ধন করুন", desc: "একজন রক্তদাতা হিসেবে আপনার তথ্য দিয়ে আমাদের প্ল্যাটফর্মে নিবন্ধন সম্পন্ন করুন।", icon: Users },
              { title: "অনুসন্ধান বা পোস্ট", desc: "আপনার প্রয়োজনীয় রক্তের গ্রুপ ও এলাকা অনুযায়ী রক্তদাতা খুঁজুন অথবা অনুরোধ পোস্ট করুন।", icon: Search },
              { title: "সংযোগ ও জীবন বাঁচান", desc: "সঠিক রক্তদাতার সাথে যোগাযোগ করে জরুরি মুহূর্তে জীবন বাঁচাতে সাহায্য করুন।", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-6 group">
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center mx-auto text-white text-3xl font-black shadow-xl ring-8 ring-primary/5 group-hover:scale-110 transition-transform">
                  <item.icon className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. জরুরি রক্তের রিকোয়েস্ট */}
      <section className="bg-muted/30 py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-bold font-headline flex items-center justify-center md:justify-start gap-3">
                <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                জরুরি রক্তের রিকোয়েস্ট
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">এখনই যাদের সাহায্য প্রয়োজন</p>
            </div>
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/5 font-bold text-lg h-12 rounded-full px-8" asChild>
              <Link href="/requests">সব অনুরোধ দেখুন <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>

          {loadingRequests ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">কোনো বর্তমান অনুরোধ পাওয়া যায়নি।</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {requests.map((req) => (
                <Card key={req.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-3xl group">
                  <CardHeader className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white p-8`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl">{req.patientName}</CardTitle>
                      <Badge className="bg-white text-primary border-none font-black px-4">{req.isUrgent ? 'জরুরি' : 'Approved'}</Badge>
                    </div>
                    <CardDescription className="text-white/90 mt-3 flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5" /> {req.hospitalName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                        <p className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-widest">রক্তের গ্রুপ</p>
                        <p className="text-4xl font-black text-primary">{req.bloodType}</p>
                      </div>
                      <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                        <p className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-widest">ব্যাগ সংখ্যা</p>
                        <p className="text-4xl font-black text-primary">{req.bagsNeeded}</p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-2 text-muted-foreground">
                      <div className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-bold">{req.neededWhen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{req.area}, {req.district}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 border-t flex bg-muted/20">
                    <Button className="flex-1 h-16 rounded-none bg-primary hover:bg-primary/90 text-xl font-bold gap-3" asChild>
                      <a href={`tel:${req.phone}`}>
                        <Phone className="h-6 w-6" /> যোগাযোগ করুন
                      </a>
                    </Button>
                    <Button variant="ghost" className="flex-1 h-16 rounded-none text-xl font-bold gap-3 hover:bg-primary/5">
                      <Share2 className="h-6 w-6" /> শেয়ার করুন
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. পরিসংখ্যান */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: "১,২৫০+", label: "মোট রক্তদাতা", icon: Users },
              { val: "৩,২০০+", label: "রক্তের অনুরোধ", icon: Droplet },
              { val: "৯৫০+", label: "সফল রক্তদান", icon: Heart },
              { val: "৪৫+", label: "আজকের সক্রিয় দাতা", icon: CheckCircle }
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-primary/30">
                   <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-5xl md:text-6xl font-black font-headline text-primary">{stat.val}</div>
                <div className="text-xl text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. কেন RoktoDao বেছে নিবেন? */}
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

      {/* FAQ সেকশন */}
      <section className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">রক্তদান সম্পর্কে জানুন</h2>
          <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-6">
          {[
            { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "রক্তদানের জন্য সর্বনিম্ন বয়স ১৮ বছর এবং ওজন কমপক্ষে ৫০ কেজি হতে হবে।" },
            { q: "কারা রক্তদান করতে পারবেন না?", a: "গুরুতর অসুস্থতা, যেমন হৃদরোগ, ক্যান্সার, এইচআইভি/এইডস, বা রক্তবাহিত রোগে আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না।" },
            { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস পর পর এবং একজন সুস্থ নারী প্রতি ৪ মাস পর পর রক্তদান করতে পারেন।" }
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
    </div>
  );
}
