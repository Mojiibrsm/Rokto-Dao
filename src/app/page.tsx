import Link from 'next/link';
import { Droplet, Heart, ShieldCheck, MapPin, ArrowRight, History, Search, Users, CheckCircle, Phone, Share2, Calendar, Clock, Info, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-blood-donation');
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('blood-drive') || img.id.startsWith('gallery'));

  return (
    <div className="flex flex-col gap-0 pb-12 overflow-x-hidden">
      {/* 1. হিরো সেকশন (ব্যানার ও ডোনার খোঁজার সার্চ বার) */}
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
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
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

      {/* 2. কিভাবে কাজ করে (৩-ধাপের প্রক্রিয়া) */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">কিভাবে কাজ করে?</h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto pt-2">খুব সহজেই আপনি আমাদের প্ল্যাটফর্ম ব্যবহার করতে পারেন</p>
          </div>
          <div className="grid gap-16 md:grid-cols-3 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/3 left-0 w-full h-0.5 bg-dashed border-t-2 border-dashed border-primary/20 -z-10"></div>
            
            {[
              { step: "১", title: "নিবন্ধন করুন", desc: "একজন রক্তদাতা হিসেবে আপনার তথ্য দিয়ে আমাদের প্ল্যাটফর্মে নিবন্ধন সম্পন্ন করুন।", icon: Users },
              { step: "২", title: "অনুসন্ধান বা পোস্ট", desc: "আপনার প্রয়োজনীয় রক্তের গ্রুপ ও এলাকা অনুযায়ী রক্তদাতা খুঁজুন অথবা অনুরোধ পোস্ট করুন।", icon: Search },
              { step: "৩", title: "সংযোগ ও জীবন বাঁচান", desc: "সঠিক রক্তদাতার সাথে যোগাযোগ করে জরুরি মুহূর্তে জীবন বাঁচাতে সাহায্য করুন।", icon: Heart }
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

      {/* 3. জরুরি রক্তের রিকোয়েস্ট (লাইভ অনুরোধ) */}
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
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { name: "মেহেরুন্নেসা মুজিব", hospital: "কক্সবাজার সেন্ট্রাল হাসপাতাল", group: "AB+", bags: "1", location: "কক্সবাজার", date: "আজ প্রয়োজন" },
              { name: "খাইরুল ইসলাম", hospital: "আদ্-দ্বীন মেডিকেল কলেজ হাসপাতাল", group: "B-", bags: "2", location: "শরীয়তপুর", date: "জরুরি" }
            ].map((req, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-3xl group">
                <CardHeader className="bg-primary text-white p-8">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">{req.name}</CardTitle>
                    <Badge className="bg-white text-primary border-none font-black">জরুরি</Badge>
                  </div>
                  <CardDescription className="text-white/90 mt-3 flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" /> {req.hospital}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                      <p className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-widest">রক্তের গ্রুপ</p>
                      <p className="text-4xl font-black text-primary">{req.group}</p>
                    </div>
                    <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                      <p className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-widest">ব্যাগ সংখ্যা</p>
                      <p className="text-4xl font-black text-primary">{req.bags}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-bold">{req.date}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{req.location}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t flex bg-muted/20">
                  <Button className="flex-1 h-16 rounded-none bg-primary hover:bg-primary/90 text-xl font-bold gap-3">
                    <Phone className="h-6 w-6" /> যোগাযোগ করুন
                  </Button>
                  <Button variant="ghost" className="flex-1 h-16 rounded-none text-xl font-bold gap-3 hover:bg-primary/5">
                    <Share2 className="h-6 w-6" /> শেয়ার করুন
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. পরিসংখ্যান (অ্যানিমেটেড কাউন্টার) */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
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

      {/* 6. আমাদের রক্তযোদ্ধারা (ফিচার্ড ডোনারদের তালিকা) */}
      <section className="bg-primary/5 py-24 border-y">
        <div className="container mx-auto px-4 text-center">
           <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline">আমাদের রক্তযোদ্ধারা</h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground pt-2">যারা নিয়মিত রক্ত দিয়ে জীবন বাঁচাতে সাহায্য করছেন</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { name: "মুজিবুর রহমান", group: "AB+", location: "রামু, কক্সবাজার", count: 12 },
              { name: "আকবর হোসেন", group: "O+", location: "মিরপুর, ঢাকা", count: 8 },
              { name: "ফারিয়া আহমেদ", group: "B-", location: "সিলেট সদর", count: 5 },
              { name: "ইউনুছ উদ্দিন", group: "A+", location: "চট্টগ্রাম", count: 15 },
            ].map((donor, i) => (
              <Card key={i} className="overflow-hidden rounded-3xl border-none shadow-lg group hover:scale-[1.02] transition-all">
                <div className="h-32 bg-primary flex items-center justify-center relative">
                   <div className="absolute -bottom-10 h-20 w-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-primary text-2xl font-bold">
                     {donor.name.charAt(0)}
                   </div>
                </div>
                <CardHeader className="pt-14 pb-4">
                  <CardTitle className="text-xl">{donor.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> {donor.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex justify-between items-center bg-muted/50 p-3 rounded-xl mb-4">
                    <span className="text-sm font-bold">রক্তের গ্রুপ</span>
                    <Badge className="bg-primary text-lg px-3">{donor.group}</Badge>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                     মোট রক্ত দিয়েছেন: <span className="text-primary font-bold">{donor.count} বার</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold bg-primary shadow-xl shadow-primary/20" asChild>
            <Link href="/donors">সকল রক্তদাতা দেখুন</Link>
          </Button>
        </div>
      </section>

      {/* 7. সফলতার গল্প (ব্যবহারকারীদের অভিজ্ঞতা) */}
      <section className="container mx-auto px-4 py-24 overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 font-headline">সফলতার গল্প</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { text: "আমার মেয়ের জন্য জরুরি রক্তের প্রয়োজন ছিল। RoktoDao-এর মাধ্যমে মাত্র ১ ঘন্টার মধ্যে একজন দাতার সাথে যোগাযোগ করতে পারি। আমি তাদের কাছে চিরকৃতজ্ঞ।", author: "আকবর হোসেন", role: "রোগীর বাবা" },
            { text: "একজন নিয়মিত রক্তদাতা হিসেবে আমি RoktoDao ব্যবহার করে সহজেই রক্তদানের অনুরোধ খুঁজে পাই। এই প্ল্যাটফর্মটি আসলেই খুব কার্যকরী এবং জীবন বাঁচাতে সাহায্য করছে।", author: "ফারিয়া আহমেদ", role: "স্বেচ্ছাসেবী রক্তদাতা" }
          ].map((t, i) => (
            <Card key={i} className="p-10 italic text-muted-foreground bg-white border-none shadow-2xl rounded-[3rem] relative group hover:-translate-y-2 transition-transform">
              <div className="absolute top-8 left-8 text-primary opacity-20 group-hover:opacity-40 transition-opacity">
                <Star className="h-12 w-12 fill-primary" />
              </div>
              <p className="text-xl leading-relaxed relative z-10 pt-6">"{t.text}"</p>
              <div className="mt-10 flex items-center gap-5 border-t pt-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground text-xl">{t.author}</div>
                  <div className="text-sm font-medium text-primary">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. রক্তদাতা হোন (রেজিস্ট্রেশনের জন্য বড় আহ্বান) */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto bg-slate-900 text-white p-12 md:p-24 rounded-[4rem] shadow-2xl text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-secondary/30 transition-all duration-700"></div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">জীবন বাঁচানোর এই <span className="text-primary">মহৎ কাজে</span> আমাদের সঙ্গী হোন</h2>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              আজই একজন দাতা হিসাবে নিবন্ধন করুন এবং কারো গল্পের নায়ক হয়ে উঠুন। এটি সম্পূর্ণ নিরাপদ এবং একটি মহৎ দায়িত্ব।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" asChild className="bg-primary text-white hover:bg-primary/90 h-16 px-12 text-2xl font-bold rounded-full shadow-2xl shadow-primary/20 transition-all hover:scale-105">
                <Link href="/register">রক্তদান করতে নিবন্ধন করুন</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 h-16 px-12 text-xl font-bold rounded-full" asChild>
                <Link href="/about">বিস্তারিত জানুন</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. রক্তদান সম্পর্কে জানুন (সাধারণ জিজ্ঞাসার অ্যাকর্ডিয়ন) */}
      <section className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">রক্তদান সম্পর্কে জানুন</h2>
          <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
          <p className="text-muted-foreground text-lg pt-2">সাধারণ কিছু প্রশ্ন ও তার উত্তর</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-6">
          {[
            { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "রক্তদানের জন্য সর্বনিম্ন বয়স ১৮ বছর এবং ওজন কমপক্ষে ৫০ কেজি হতে হবে।" },
            { q: "কারা রক্তদান করতে পারবেন না?", a: "গুরুতর অসুস্থতা, যেমন হৃদরোগ, ক্যান্সার, এইচআইভি/এইডস, বা রক্তবাহিত রোগে আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না। গর্ভবতী নারীরাও পারবেন না।" },
            { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস পর পর এবং একজন সুস্থ নারী প্রতি ৪ মাস পর পর রক্তদান করতে পারেন।" },
            { q: "রক্তদানের স্বাস্থ্য উপকারিতা কি কি?", a: "নিয়মিত রক্তদান করলে হার্ট ভালো থাকে, শরীরে আয়রনের মাত্রা নিয়ন্ত্রণে থাকে এবং নতুন রক্তকণিকা তৈরি হয় যা শরীরকে সতেজ রাখে।" }
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

      {/* 10. আমাদের সহযোগীরা (পার্টনারদের লোগো) */}
      <section className="py-24 bg-muted/20 border-y overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground uppercase tracking-[0.3em]">আমাদের সহযোগীরা</h2>
        </div>
        <div className="flex gap-20 animate-marquee-slow hover-pause whitespace-nowrap">
          {['HealthBridge Hospital', 'City Medical Center', 'LifeCare Diagnostics', 'Red Crescent Society', 'Community Health NGO'].map((p, i) => (
            <div key={i} className="text-4xl font-black text-slate-300 hover:text-primary transition-all duration-300 cursor-default">
              {p}
            </div>
          ))}
          {['HealthBridge Hospital', 'City Medical Center', 'LifeCare Diagnostics', 'Red Crescent Society', 'Community Health NGO'].map((p, i) => (
            <div key={`dup-${i}`} className="text-4xl font-black text-slate-300 hover:text-primary transition-all duration-300 cursor-default">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* 11. ব্লগ (স্বাস্থ্য বিষয়ক আর্টিকেল) */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">আমাদের ব্লগ থেকে পড়ুন</h2>
            <p className="text-muted-foreground mt-2 text-lg">স্বাস্থ্য বিষয়ক প্রয়োজনীয় তথ্য ও টিপস</p>
          </div>
          <Button variant="link" className="text-primary font-bold text-xl h-auto p-0" asChild>
            <Link href="/blog">সব ব্লগ দেখুন <ArrowRight className="ml-2 h-6 w-6" /></Link>
          </Button>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { title: "রক্তদানের আগে যা জানা প্রয়োজন", category: "স্বাস্থ্য টিপস", desc: "রক্তদান করার আগে সঠিক খাবার ও বিশ্রাম অত্যন্ত জরুরি..." },
            { title: "থ্যালাসেমিয়া রোগীদের সহায়তা", category: "সচেতনতা", desc: "থ্যালাসেমিয়া রোগীদের নিয়মিত রক্তের প্রয়োজন হয়, আপনার এক ব্যাগ রক্ত..." },
            { title: "রক্তদানের পর দ্রুত রিকভারি", category: "স্বাস্থ্য", desc: "রক্তদানের পর শরীরকে সতেজ রাখতে যে সব খাবার খাওয়া উচিত..." }
          ].map((blog, i) => (
            <Card key={i} className="group overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-white hover:shadow-2xl transition-all">
              <div className="aspect-[4/3] bg-primary/5 relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <History className="h-16 w-16 text-primary/20 group-hover:scale-125 transition-transform duration-700" />
                 </div>
              </div>
              <CardHeader className="p-8">
                <Badge className="bg-primary/10 text-primary border-none mb-4 w-fit px-4">{blog.category}</Badge>
                <CardTitle className="text-2xl leading-snug group-hover:text-primary transition-colors cursor-pointer min-h-[4rem]">
                  {blog.title}
                </CardTitle>
                <CardDescription className="text-lg mt-4 line-clamp-3 leading-relaxed">
                  {blog.desc}
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button variant="ghost" className="p-0 h-auto text-primary text-lg font-bold hover:bg-transparent flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  বিস্তারিত পড়ুন <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 12. গ্যালারি (রক্তদানের মুহূর্ত) */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">রক্তদানের মুহূর্ত (গ্যালারি)</h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground text-lg pt-2">জীবন বাঁচানোর আনন্দের কিছু মুহূর্ত</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-muted rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg">
                <Image 
                  src={`https://picsum.photos/seed/gallery${i}/600/600`} 
                  alt={`Gallery image ${i}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <Star className="text-white h-10 w-10 fill-white" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
             <Button variant="outline" size="lg" className="rounded-full px-12 h-14 text-xl font-bold border-primary text-primary hover:bg-primary/5 shadow-xl" asChild>
                <Link href="/gallery">সম্পূর্ণ গ্যালারি দেখুন</Link>
             </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
