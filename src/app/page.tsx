import Link from 'next/link';
import { Droplet, Heart, ShieldCheck, MapPin, ArrowRight, History, Search, Users, CheckCircle, Phone, Share2, Calendar, Clock, Info, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative w-full py-16 md:py-32 bg-accent/20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground font-headline">
              আপনার নিকটবর্তী রক্তদাতা খুঁজুন
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              জরুরী মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।
            </p>
          </div>

          <Card className="w-full max-w-4xl shadow-2xl p-6 md:p-10 border-t-8 border-t-primary rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-3 text-left">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">রক্তের গ্রুপ</label>
                <Select>
                  <SelectTrigger className="h-12 text-lg">
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
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">জেলা</label>
                <Select>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="যেকোনো জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary h-12 text-xl font-bold gap-3 rounded-xl shadow-lg shadow-primary/20">
                <Search className="h-5 w-5" /> অনুসন্ধান
              </Button>
            </div>
          </Card>

          <div className="flex flex-wrap justify-center gap-6 mt-4">
            <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/5 h-14 px-8 text-lg rounded-full">
              <Link href="/requests">রক্তের অনুরোধ দেখুন</Link>
            </Button>
            <Button size="lg" asChild className="bg-primary text-white h-14 px-8 text-lg rounded-full shadow-lg">
              <Link href="/register">রক্তদাতা হোন</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Emergency Blood Requests */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold font-headline">জরুরি রক্তের রিকোয়েস্ট</h2>
            <p className="text-muted-foreground mt-2">Live urgent blood requests</p>
          </div>
          <Button variant="link" className="text-primary font-bold text-lg" asChild>
            <Link href="/requests">আরো দেখুন <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { name: "মেহেরুন্নেসা মুজিব", hospital: "কক্সবাজার সেন্ট্রাল হাসপাতাল", group: "AB+", bags: "1", location: "কক্সবাজার, কক্সবাজার", date: "August 13th, 2025" },
            { name: "খাইরুল", hospital: "আদ্-দ্বীন সকিনা মেডিকেল কলেজ হাসপাতাল", group: "B-", bags: "1", location: "শরীয়তপুর, শরীয়তপুর", date: "August 13th, 2025" }
          ].map((req, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-xl hover:scale-[1.02] transition-transform">
              <CardHeader className="bg-primary text-white p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{req.name}</CardTitle>
                  <Badge className="bg-red-900/50 text-white border-white/20">URGENT</Badge>
                </div>
                <CardDescription className="text-white/80 mt-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {req.hospital}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/10 p-4 rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">রক্তের গ্রুপ</p>
                    <p className="text-3xl font-black text-primary">{req.group}</p>
                  </div>
                  <div className="bg-accent/10 p-4 rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">ব্যাগ সংখ্যা</p>
                    <p className="text-3xl font-black text-primary">{req.bags} ব্যাগ</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 border-t flex">
                <Button className="flex-1 h-14 rounded-none bg-primary hover:bg-primary/90 text-lg gap-2">
                  <Phone className="h-5 w-5" /> যোগাযোগ
                </Button>
                <Button variant="ghost" className="flex-1 h-14 rounded-none text-lg gap-2">
                  <Share2 className="h-5 w-5" /> শেয়ার
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline">কিভাবে কাজ করে?</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: "১", title: "নিবন্ধন করুন", desc: "একজন রক্তদাতা হিসেবে আপনার তথ্য দিয়ে আমাদের প্ল্যাটফর্মে নিবন্ধন সম্পন্ন করুন।" },
              { step: "২", title: "অনুসন্ধান বা পোস্ট", desc: "আপনার প্রয়োজনীয় রক্তের গ্রুপ ও এলাকা অনুযায়ী রক্তদাতা খুঁজুন অথবা রক্তের জন্য অনুরোধ পোস্ট করুন।" },
              { step: "৩", title: "সংযোগ ও জীবন বাঁচান", desc: "সঠিক রক্তদাতার সাথে যোগাযোগ করে জরুরি মুহূর্তে জীবন বাঁচাতে সাহায্য করুন।" }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-6 group">
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mx-auto text-white text-3xl font-black shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Statistics Counter */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: "১,২৫০+", label: "মোট রক্তদাতা" },
              { val: "৩,২০০+", label: "রক্তের অনুরোধ" },
              { val: "৯৫০+", label: "সফল রক্তদান" },
              { val: "৪৫+", label: "আজকের সক্রিয় দাতা" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-5xl md:text-6xl font-black">{stat.val}</div>
                <div className="text-xl text-primary-foreground/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold font-headline">কেন RoktoDao বেছে নিবেন?</h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CheckCircle, title: "যাচাইকৃত রক্তদাতা", desc: "আমাদের সকল রক্তদাতা যাচাইকৃত, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।" },
            { icon: Droplet, title: "দ্রুত যোগাযোগ ব্যবস্থা", desc: "সরাসরি ফোন কলের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।" },
            { icon: MapPin, title: "দেশব্যাপী নেটওয়ার্ক", desc: "সারাদেশে আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত, যা জরুরি মুহূর্তে সহায়ক।" },
            { icon: ShieldCheck, title: "গোপনীয়তা সুরক্ষিত", desc: "আপনার সকল ব্যক্তিগত তথ্য আমাদের কাছে সম্পূর্ণ সুরক্ষিত এবং গোপন রাখা হয়।" }
          ].map((feat, i) => (
            <Card key={i} className="border-none shadow-lg text-center p-8 hover:-translate-y-2 transition-transform duration-300">
              <CardHeader className="p-0 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <feat.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{feat.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{feat.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Become a Donor CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-secondary text-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black font-headline">জীবন বাঁচানোর সম্প্রদায়ে যোগ দিন</h2>
            <p className="text-xl text-secondary-foreground/90 leading-relaxed max-w-2xl mx-auto">
              আজই একজন দাতা হিসাবে নিবন্ধন করুন এবং কারো গল্পের নায়ক হয়ে উঠুন। এটি সহজ, নিরাপদ এবং গভীরভাবে প্রভাবশালী।
            </p>
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 h-16 px-12 text-xl font-bold rounded-full shadow-xl">
              <Link href="/register">রক্তদান করতে নিবন্ধন করুন</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Awareness Section (FAQ) */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold font-headline text-primary">রক্তদান সম্পর্কে জানুন</h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            { q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?", a: "রক্তদানের জন্য সর্বনিম্ন বয়স ১৮ বছর এবং ওজন কমপক্ষে ৫০ কেজি হতে হবে।" },
            { q: "কারা রক্তদান করতে পারবেন না?", a: "গুরুতর অসুস্থতা, যেমন হৃদরোগ, ক্যান্সার, এইচআইভি/এইডস, বা রক্তবাহিত রোগে আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না। গর্ভবতী নারীরাও পারবেন না।" },
            { q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস পর পর এবং একজন সুস্থ নারী প্রতি ৪ মাস পর পর রক্তদান করতে পারেন।" },
            { q: "রক্তদানের স্বাস্থ্য উপকারিতা কি কি?", a: "নিয়মিত রক্তদান করলে হার্ট ভালো থাকে, শরীরে আয়রনের মাত্রা নিয়ন্ত্রণে থাকে এবং নতুন রক্তকণিকা তৈরি হয় যা শরীরকে সতেজ রাখে।" }
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-white shadow-sm overflow-hidden">
              <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary py-6">{item.q}</AccordionTrigger>
              <AccordionContent className="text-lg text-muted-foreground pb-6 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* 9. Partners Marquee */}
      <section className="py-20 bg-muted/20 border-y overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-2xl font-bold text-muted-foreground uppercase tracking-widest">আমাদের সহযোগীরা</h2>
        </div>
        <div className="flex gap-16 animate-marquee-slow hover-pause whitespace-nowrap">
          {['HealthBridge Hospital', 'City Medical Center', 'LifeCare Diagnostics', 'Red Crescent Society', 'Community Health NGO'].map((p, i) => (
            <div key={i} className="text-3xl font-black text-muted-foreground/40 hover:text-primary transition-colors cursor-default">
              {p}
            </div>
          ))}
          {['HealthBridge Hospital', 'City Medical Center', 'LifeCare Diagnostics', 'Red Crescent Society', 'Community Health NGO'].map((p, i) => (
            <div key={`dup-${i}`} className="text-3xl font-black text-muted-foreground/40 hover:text-primary transition-colors cursor-default">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Testimonials */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 font-headline">সফলতার গল্প</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { text: "আমার মেয়ের জন্য জরুরি রক্তের প্রয়োজন ছিল। RoktoDao-এর মাধ্যমে মাত্র ১ ঘন্টার মধ্যে একজন দাতার সাথে যোগাযোগ করতে পারি। আমি তাদের কাছে চিরকৃতজ্ঞ।", author: "আকবর হোসেন", role: "রোগীর বাবা" },
            { text: "একজন নিয়মিত রক্তদাতা হিসেবে আমি RoktoDao ব্যবহার করে সহজেই রক্তদানের অনুরোধ খুঁজে পাই। এই প্ল্যাটফর্মটি আসলেই খুব কার্যকরী এবং জীবন বাঁচাতে সাহায্য করছে।", author: "ফারিয়া আহমেদ", role: "স্বেচ্ছাসেবী রক্তদাতা" }
          ].map((t, i) => (
            <Card key={i} className="p-10 italic text-muted-foreground bg-accent/10 border-none rounded-3xl">
              <p className="text-xl leading-relaxed relative z-10">"{t.text}"</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/20"></div>
                <div>
                  <div className="font-bold text-foreground text-lg">{t.author}</div>
                  <div className="text-sm">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 11. Blog Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-bold font-headline">আমাদের ব্লগ থেকে পড়ুন</h2>
          <Button variant="link" className="text-primary font-bold text-lg">আরো পড়ুন</Button>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="group overflow-hidden border-none shadow-xl rounded-3xl">
              <div className="aspect-video bg-accent/20 relative">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors"></div>
              </div>
              <CardHeader className="p-8">
                <Badge className="bg-primary/10 text-primary border-none mb-4">রক্তদানের যোগ্যতা</Badge>
                <CardTitle className="text-2xl leading-snug group-hover:text-primary transition-colors cursor-pointer">
                  রক্তদানের যোগ্যতা ও প্রয়োজনীয় তথ্য যা জানা প্রয়োজন
                </CardTitle>
                <CardDescription className="text-base mt-4 line-clamp-2">
                  জীবন বাঁচানো একটি মহৎ কাজ, আর রক্তদান তেমনই একটি কাজ। কিন্তু রক্তদান করার আগে...
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button variant="ghost" className="p-0 h-auto text-primary font-bold hover:bg-transparent flex items-center gap-2">
                  বিস্তারিত পড়ুন <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}