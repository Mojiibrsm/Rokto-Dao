
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Droplet, Heart, Users, ShieldCheck, Target, 
  Lightbulb, HandHeart, Award, ArrowRight,
  Globe, Zap, Mail, Phone, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutHeroImage = PlaceHolderImages.find(img => img.id === 'about-us-hero')?.imageUrl || 'https://picsum.photos/seed/lifeline4/800/800';

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. Hero Section */}
      <section className="relative py-20 md:py-32 bg-primary/5 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-sm py-1 px-4 rounded-full">আমাদের লক্ষ্য ও পথচলা</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight text-foreground leading-tight">
            মানবতার সেবায় <span className="text-primary">RoktoDao</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            আমরা বিশ্বাস করি, এক ব্যাগ রক্ত শুধু একটি জীবন নয়, বরং একটি পরিবারের হাসি ফিরিয়ে দেয়। প্রযুক্তি ব্যবহার করে রক্তদাতা ও গ্রহীতার মধ্যে দূরত্ব কমিয়ে আনাই আমাদের মূল লক্ষ্য।
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="rounded-[2.5rem] p-8 border-none shadow-xl bg-white group hover:shadow-primary/5 transition-all">
            <CardHeader className="space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Target className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold">আমাদের মিশন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                জরুরী মুহূর্তে রক্তদাতার অভাব দূর করা এবং সম্পূর্ণ বিনামূল্যে একটি ডিজিটাল প্ল্যাটফর্মের মাধ্যমে সরাসরি দাতার সাথে গ্রহীতার যোগাযোগ স্থাপন করে দেওয়া। আমরা চাই রক্ত না পেয়ে যেন আর কোনো প্রাণ অকালে ঝরে না যায়।
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] p-8 border-none shadow-xl bg-white group hover:shadow-secondary/5 transition-all">
            <CardHeader className="space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                <Globe className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold">আমাদের ভিশন</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                বাংলাদেশের প্রতিটি গ্রাম ও মহল্লায় অন্তত একজন ভেরিফাইড রক্তদাতা নিশ্চিত করা। এমন একটি সমাজ গড়ে তোলা যেখানে রক্তদান হবে মানুষের নিয়মিত অভ্যাসের অংশ এবং সেবা হবে সম্পূর্ণ নিঃস্বার্থ।
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Our Story & Founder */}
      <section className="py-24 bg-muted/20 border-y">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <Badge variant="outline" className="text-primary border-primary">পথচলার গল্প</Badge>
              <h2 className="text-4xl md:text-5xl font-bold font-headline leading-tight">একটি মানবিক স্বপ্নের বাস্তবায়ন</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                RoktoDao এর যাত্রা শুরু হয়েছিল একটি সাধারণ ভাবনা থেকে—কিভাবে প্রযুক্তি ব্যবহার করে মানুষের জীবন বাঁচানো যায়। আমরা দেখেছি, রক্তের প্রয়োজন হলে মানুষ দিশেহারা হয়ে পড়ে। সেই শূন্যতা পূরণ করতেই আমরা নিয়ে এসেছি এই ডিজিটাল সিস্টেম।
              </p>
              <div className="p-8 bg-white rounded-3xl border border-primary/10 shadow-lg relative">
                <p className="text-xl italic font-medium text-foreground/80 mb-6">
                  "RoktoDao কোনো ব্যবসার জায়গা নয়, এটি একটি অলাভজনক প্ল্যাটফর্ম। আমাদের লক্ষ্য কেবল সেবা। আপনি যখন রক্ত দেন, আপনি শুধু রক্ত দিচ্ছেন না, বরং একজনের জীবন বাঁচানোর শ্রেষ্ঠ সুযোগটি গ্রহণ করছেন।"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 overflow-hidden relative">
                    <Image 
                      src="https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg" 
                      fill 
                      alt="Mujibur Rahman" 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary">মুজিবুর রহমান</h4>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">প্রতিষ্ঠাতা, RoktoDao</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-90"></div>
              <Image 
                src={aboutHeroImage} 
                width={600} 
                height={800} 
                alt="Serving Humanity" 
                className="rounded-[4rem] shadow-2xl relative z-10 object-cover"
                data-ai-hint="humanity service"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-headline">আমাদের মূল মূল্যবোধ</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: "নির্ভরযোগ্যতা", desc: "আমরা প্রতিটি দাতার তথ্য যাচাই করি যাতে গ্রহীতারা কোনো ঝক্কি ছাড়াই সাহায্য পেতে পারেন।" },
              { icon: HandHeart, title: "নিঃস্বার্থ সেবা", desc: "আমাদের প্ল্যাটফর্ম ব্যবহার করতে কোনো টাকা লাগে না। এটি সম্পূর্ণ মানবিক উদ্দেশ্যে পরিচালিত।" },
              { icon: Zap, title: "দ্রুততা", desc: "জরুরি মুহূর্তে যেন দ্রুত দাতা পাওয়া যায়, সেজন্য আমরা আধুনিক সার্চ প্রযুক্তি ব্যবহার করি।" }
            ].map((value, i) => (
              <div key={i} className="text-center space-y-6 p-10 rounded-[2.5rem] bg-muted/10 hover:bg-primary/5 transition-all duration-500">
                <div className="h-20 w-20 rounded-3xl bg-white shadow-md flex items-center justify-center mx-auto">
                  <value.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Statistics (Impact) */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: "২৫,০০০+", label: "সদস্য", icon: Users },
              { val: "১৫,০০০+", label: "অনুরোধ সম্পন্ন", icon: Droplet },
              { val: "৬৪", label: "জেলায় কার্যক্রম", icon: MapPin },
              { val: "১০০%", label: "বিনামূল্যে", icon: Award }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="h-14 w-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black font-headline">{stat.val}</div>
                <p className="text-sm font-bold uppercase tracking-widest opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Join Us CTA */}
      <section className="py-24 bg-white text-center space-y-10">
        <div className="max-w-3xl mx-auto space-y-6 px-4">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Heart className="h-10 w-10 fill-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-headline">আপনিও কি জীবন বাঁচাতে চান?</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            একজন দাতা হিসেবে আজই নিবন্ধন করুন অথবা আমাদের এই মানবিক কার্যক্রম অন্যদের সাথে শেয়ার করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-12 h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" asChild>
              <Link href="/register">নিবন্ধন করুন <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-12 h-14 text-lg font-bold border-primary text-primary hover:bg-primary/5" asChild>
              <Link href="/contact">যোগাযোগ করুন</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
