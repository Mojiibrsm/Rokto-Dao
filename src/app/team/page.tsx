'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Twitter, Mail, Award, Heart, ShieldCheck, Users, Loader2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTeamMembers, type TeamMember } from '@/lib/sheets';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const teamHeroImg = PlaceHolderImages.find(img => img.id === 'team-hero')?.imageUrl || 'https://picsum.photos/seed/team/1200/800';

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await getTeamMembers();
        setMembers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

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
      <section className="py-24 container mx-auto px-4 min-h-[40vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-bold text-muted-foreground">টিম মেম্বারদের তথ্য লোড হচ্ছে...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">আপাতত কোনো তথ্য পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, i) => (
              <Card key={i} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white text-center flex flex-col">
                <Link href={`/team/${member.slug}`} className="relative h-72 overflow-hidden block">
                  <Image 
                    src={member.imageurl || 'https://picsum.photos/seed/team/400/400'} 
                    fill 
                    alt={member.name} 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint="professional person"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 gap-4">
                    <Badge className="bg-primary text-white border-none px-4 py-1 rounded-full font-bold">View Profile</Badge>
                  </div>
                </Link>
                <CardHeader className="pt-8 px-6">
                  <Link href={`/team/${member.slug}`}>
                    <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">{member.name}</CardTitle>
                  </Link>
                  <CardDescription className="text-primary font-black uppercase tracking-widest text-[10px] mt-1">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6 flex-grow">
                  <p className="text-muted-foreground text-sm leading-relaxed italic line-clamp-2">"{member.bio}"</p>
                </CardContent>
                <div className="px-6 pb-8 pt-2">
                   <Button variant="ghost" asChild className="w-full rounded-xl font-bold group/btn text-primary hover:bg-primary/5">
                     <Link href={`/team/${member.slug}`}>বিস্তারিত দেখুন <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" /></Link>
                   </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
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
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full px-12 h-14 text-xl font-bold transition-all shadow-xl" asChild>
              <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer">আবেদন করুন</a>
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
