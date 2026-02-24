
'use client';

import Image from 'next/image';
import { Linkedin, Twitter, Mail, Award, Heart, ShieldCheck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const TEAM = [
  {
    name: "মুজিবুর রহমান",
    role: "প্রতিষ্ঠাতা ও পরিচালক",
    bio: "একটি মানবিক সমাজ গড়ার স্বপ্ন নিয়ে RoktoDao এর যাত্রা শুরু করেন। তিনি পেশায় একজন প্রযুক্তিবিদ এবং রক্তদান নিয়ে দীর্ঘদিন কাজ করছেন।",
    image: "https://rokto-dao.vercel.app/files/Mojib_Rsm.jpg",
    social: { twitter: "#", linkedin: "#", mail: "founder@roktodao.com" }
  },
  {
    name: "ডা. ফয়সাল আহমেদ",
    role: "মেডিকেল অ্যাডভাইজার",
    bio: "রক্তদান প্রক্রিয়ার নিরাপত্তা ও চিকিৎসা সংক্রান্ত সব বিষয়ে দিকনির্দেশনা প্রদান করেন।",
    image: "https://picsum.photos/seed/doctor1/400/400",
    social: { twitter: "#", linkedin: "#", mail: "medical@roktodao.com" }
  },
  {
    name: "সাদিয়া ইসলাম",
    role: "কমিউনিটি ম্যানেজার",
    bio: "রক্তদাতা ও গ্রহীতাদের মধ্যে সমন্বয় সাধন এবং সারা বাংলাদেশের স্বেচ্ছাসেবক টিম পরিচালনা করেন।",
    image: "https://picsum.photos/seed/member2/400/400",
    social: { twitter: "#", linkedin: "#", mail: "community@roktodao.com" }
  },
  {
    name: "আরিফ হোসেন",
    role: "টেকনিক্যাল লিড",
    bio: "RoktoDao প্ল্যাটফর্মের সফটওয়্যার ডেভেলপমেন্ট এবং টেকনিক্যাল সাপোর্টের দায়িত্বে আছেন।",
    image: "https://picsum.photos/seed/member3/400/400",
    social: { twitter: "#", linkedin: "#", mail: "tech@roktodao.com" }
  }
];

export default function TeamPage() {
  const teamHeroImg = PlaceHolderImages.find(img => img.id === 'team-hero')?.imageUrl || 'https://picsum.photos/seed/team/1200/800';

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-none px-4 py-1">আমাদের কারিগর</Badge>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight">আমাদের <span className="text-primary">টিম</span></h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                RoktoDao এর পেছনে কাজ করছে একঝাঁক নিবেদিত প্রাণ মানুষ, যারা নিঃস্বার্থভাবে জীবন বাঁচানোর এই মিশনে কাজ করে চলেছেন।
              </p>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={teamHeroImg} 
                fill 
                alt="Our Team Hero" 
                className="object-cover"
                priority
                data-ai-hint="medical team"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Team Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, i) => (
            <Card key={i} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white text-center">
              <div className="relative h-72 overflow-hidden">
                <Image 
                  src={member.image} 
                  fill 
                  alt={member.name} 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-ai-hint="professional person"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6 gap-4">
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur text-white hover:bg-primary">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur text-white hover:bg-primary">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur text-white hover:bg-primary">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-bold">{member.name}</CardTitle>
                <CardDescription className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <p className="text-muted-foreground leading-relaxed italic">"{member.bio}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Join the Mission */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-10">
          <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
            <Users className="h-10 w-10 text-white" />
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">আপনি কি আমাদের টিমে যোগ দিতে চান?</h2>
            <p className="text-xl opacity-80 leading-relaxed">
              স্বেচ্ছাসেবক হিসেবে সারা বাংলাদেশে আমাদের কার্যক্রম সম্প্রসারণ করতে আপনার সাহায্য প্রয়োজন। মানবতার সেবায় এগিয়ে আসুন।
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full px-12 h-14 text-xl font-bold transition-all shadow-xl">
              আবেদন করুন
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Values / Trust */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          {[
            { icon: Heart, title: "নিঃস্বার্থ সেবা", desc: "আমাদের টিম কোনো ব্যক্তিগত স্বার্থ ছাড়াই মানবিক কাজ করে।" },
            { icon: ShieldCheck, title: "নিরাপত্তা নিশ্চিত", desc: "আমরা প্রতিটি দাতার তথ্য অত্যন্ত গোপনীয়তা ও নিরাপত্তার সাথে রাখি।" },
            { icon: Award, title: "সর্বোচ্চ দক্ষতা", desc: "আমাদের টিম অভিজ্ঞ চিকিৎসক ও প্রযুক্তিবিদদের দ্বারা পরিচালিত।" }
          ].map((v, i) => (
            <div key={i} className="flex gap-6 p-8 rounded-3xl bg-muted/10 hover:bg-primary/5 transition-all group">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">{v.title}</h4>
                <p className="text-muted-foreground">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
