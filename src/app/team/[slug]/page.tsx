'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Linkedin, Twitter, Mail, ArrowLeft, Loader2, Award, 
  Heart, ShieldCheck, Quote, ExternalLink, Globe, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTeamMemberBySlug, type TeamMember } from '@/lib/sheets';

export default function TeamMemberProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      try {
        const data = await getTeamMemberBySlug(slug);
        setMember(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground">টিম মেম্বারের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Heart className="h-10 w-10 text-muted-foreground opacity-20" />
        </div>
        <h1 className="text-3xl font-bold">দুঃখিত! এই মেম্বারকে পাওয়া যায়নি।</h1>
        <Button asChild className="rounded-xl bg-primary">
          <Link href="/team"><ArrowLeft className="mr-2 h-4 w-4" /> টিমে ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. Profile Header / Hero */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Button variant="ghost" asChild className="text-white/60 hover:text-white hover:bg-white/10 mb-12">
            <Link href="/team"><ArrowLeft className="mr-2 h-4 w-4" /> আমাদের টিম</Link>
          </Button>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative h-72 w-72 md:h-96 md:w-92 rounded-[3.5rem] overflow-hidden border-8 border-white/10 shadow-2xl rotate-2">
                <Image 
                  src={member.imageurl || 'https://picsum.photos/seed/team/600/800'} 
                  fill 
                  alt={member.name} 
                  className="object-cover -rotate-2 scale-110"
                  priority
                />
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <Badge className="bg-primary text-white border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {member.role}
                </Badge>
                <h1 className="text-4xl md:text-7xl font-black font-headline tracking-tight">{member.name}</h1>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 relative">
                <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary opacity-20" />
                <p className="text-xl md:text-2xl text-slate-300 font-medium italic leading-relaxed">
                  "{member.bio || 'মানবিক সেবায় RoktoDao টিমের সাথে যুক্ত থেকে মানুষের জীবন বাঁচাতে কাজ করে চলেছি।'}"
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                {member.twitter && (
                  <Button size="lg" className="rounded-2xl bg-white/10 hover:bg-primary text-white border-none h-14 px-8 font-bold gap-3" asChild>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-5 w-5" /> Twitter</a>
                  </Button>
                )}
                {member.linkedin && (
                  <Button size="lg" className="rounded-2xl bg-white/10 hover:bg-primary text-white border-none h-14 px-8 font-bold gap-3" asChild>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /> LinkedIn</a>
                  </Button>
                )}
                {member.email && (
                  <Button size="lg" variant="outline" className="rounded-2xl border-white/20 text-white hover:bg-white/5 h-14 px-8 font-bold gap-3" asChild>
                    <a href={`mailto:${member.email}`}><Mail className="h-5 w-5" /> Contact</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Professional Details */}
      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-black font-headline flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" /> সম্পর্কে
              </h2>
              <div className="prose prose-slate max-w-none text-lg text-muted-foreground leading-relaxed">
                <p>
                  {member.name} RoktoDao প্ল্যাটফর্মে একজন দক্ষ এবং নিবেদিতপ্রাণ <strong>{member.role}</strong> হিসেবে দায়িত্ব পালন করছেন। বাংলাদেশের রক্তদাতা ডাটাবেজ আরও আধুনিক এবং সহজলভ্য করার মিশনে তিনি সক্রিয়ভাবে কাজ করে চলেছেন।
                </p>
                <p>
                  প্রযুক্তি এবং মানবিক সেবা—এই দুইয়ের সমন্বয়ে একটি সুন্দর সমাজ গঠন করাই তার মূল লক্ষ্য। তিনি বিশ্বাস করেন, প্রযুক্তির সঠিক ব্যবহার করে জরুরী মুহূর্তে রক্তদাতার অভাব দূর করা সম্ভব এবং RoktoDao সেই স্বপ্নটিকেই বাস্তবে রূপ দিচ্ছে।
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Award, title: "অভিজ্ঞতা", val: "৩+ বছর" },
                { icon: Heart, title: "রক্তদান", val: "৫+ বার" },
                { icon: ShieldCheck, title: "পদবী", val: member.role },
                { icon: Globe, title: "অবস্থান", val: "ঢাকা, বাংলাদেশ" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-accent/20 border-2 border-transparent hover:border-primary/10 transition-all group">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                    <p className="text-xl font-bold text-slate-800">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden sticky top-32">
              <div className="bg-primary p-8 text-white text-center">
                <h3 className="text-2xl font-black">যোগাযোগ করুন</h3>
                <p className="text-sm opacity-80 mt-1">প্রফেশনাল প্রয়োজনে নক দিন</p>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-muted-foreground uppercase">ইমেইল</p>
                      <p className="text-sm font-bold truncate">{member.email || 'info@roktodao.com'}</p>
                    </div>
                  </div>
                  
                  {member.linkedin && (
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">লিঙ্কডইন</p>
                        <p className="text-sm font-bold truncate">Professional Profile</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full bg-slate-900 hover:bg-slate-800 h-12 rounded-xl font-bold gap-2" asChild>
                   <a href={member.linkedin || member.twitter || '#'}>ফলো করুন <ExternalLink className="h-4 w-4" /></a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Join the mission CTA */}
      <section className="container mx-auto px-4 mt-12">
        <Card className="rounded-[4rem] bg-primary text-white p-12 md:p-20 border-none shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/5"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">আপনিও কি আমাদের <br />সাথী হতে চান?</h2>
            <p className="text-xl opacity-80 font-bold leading-relaxed">
              স্বেচ্ছাসেবী হিসেবে RoktoDao টিমে যুক্ত হয়ে মানবতার সেবায় কাজ করার সুযোগ নিন। আমরা আপনার অপেক্ষায় আছি।
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-full px-12 h-16 text-2xl font-black transition-all shadow-2xl" asChild>
              <Link href="/contact">আবেদন করুন</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
