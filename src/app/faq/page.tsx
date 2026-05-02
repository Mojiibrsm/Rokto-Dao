'use client';

import { 
  HelpCircle, ArrowLeft, Search, MessageSquare, 
  ShieldCheck, Heart, AlertCircle, Info, ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import Link from 'next/link';
import { useState } from 'react';

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: "রক্তদানের জন্য সর্বনিম্ন বয়স ও ওজন কত?",
      a: "রক্তদানের জন্য আপনার বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে এবং ওজন কমপক্ষে ৫০ কেজি (১১০ পাউন্ড) হতে হবে।",
      category: "যোগ্যতা"
    },
    {
      q: "কারা রক্তদান করতে পারবেন না?",
      a: "গর্ভবতী মহিলা, শিশুকে স্তন্যদানকারী মা, সম্প্রতি বড় কোনো অস্ত্রোপচার হওয়া ব্যক্তি এবং কিছু ছোঁয়াচে রোগে (যেমন: হেপাটাইটিস, এইডস) আক্রান্ত ব্যক্তিরা রক্তদান করতে পারবেন না। বিস্তারিত জানতে আমাদের 'যোগ্যতা যাচাই' কুইজটি দিন।",
      category: "যোগ্যতা"
    },
    {
      q: "কতদিন পর পর রক্তদান করা যায়?",
      a: "একজন সুস্থ পুরুষ প্রতি ৩ মাস (৯০ দিন) অন্তর এবং একজন সুস্থ মহিলা প্রতি ৪ মাস (১২০ দিন) অন্তর রক্তদান করতে পারেন।",
      category: "প্রক্রিয়া"
    },
    {
      q: "রক্ত দিতে কি কোনো টাকা লাগে বা পাওয়া যায়?",
      a: "না, রক্তদান একটি সম্পূর্ণ স্বেচ্ছাসেবী এবং মানবিক কাজ। RoktoDao প্ল্যাটফর্মে রক্ত কেনাবেচা বা কোনো ধরণের আর্থিক লেনদেন সম্পূর্ণ নিষিদ্ধ এবং দণ্ডনীয় অপরাধ।",
      category: "নীতিমালা"
    },
    {
      q: "রক্তদানের পর কি কোনো বিশ্রাম প্রয়োজন?",
      a: "হ্যাঁ, রক্তদানের পর অন্তত ১৫-২০ মিনিট শুয়ে বা বসে বিশ্রাম নেওয়া উচিত। ওই দিন ভারী কাজ করা থেকে বিরত থাকতে হবে এবং প্রচুর পরিমাণে পানি বা তরল খাবার খেতে হবে।",
      category: "স্বাস্থ্য"
    },
    {
      q: "রক্তদান করলে কি শরীর দুর্বল হয়ে যায়?",
      a: "রক্তদানের ফলে শরীরে কোনো স্থায়ী দুর্বলতা আসে না। সুস্থ মানুষের শরীরে যে পরিমাণ রক্ত থাকে, তার মাত্র ১০% এরও কম রক্ত নেওয়া হয়, যা শরীর খুব দ্রুত পুনরায় তৈরি করে ফেলে।",
      category: "স্বাস্থ্য"
    },
    {
      q: "ট্যাটু বা পিয়ার্সিং করার পর কি রক্তদান করা যায়?",
      a: "ট্যাটু বা বডি পিয়ার্সিং করার পর সাধারণত অন্তত ৪ থেকে ৬ মাস অপেক্ষা করতে হয় রক্তদান করার জন্য। এটি সংক্রমণের ঝুঁকি এড়াতে সাহায্য করে।",
      category: "যোগ্যতা"
    },
    {
      q: "করোনা টিকা নেওয়ার পর কবে রক্ত দেওয়া যাবে?",
      a: "যেকোনো সাধারণ টিকা বা করোনা টিকা নেওয়ার অন্তত ৭-১৪ দিন পর (যদি কোনো পার্শ্বপ্রতিক্রিয়া না থাকে) আপনি রক্তদান করতে পারেন।",
      category: "স্বাস্থ্য"
    },
    {
      q: "RoktoDao থেকে কীভাবে রক্তদাতা খুঁজব?",
      a: "আমাদের 'রক্তদাতা খুঁজুন' পেজে গিয়ে আপনার প্রয়োজনীয় রক্তের গ্রুপ এবং জেলা নির্বাচন করে অনুসন্ধান বাটনে ক্লিক করুন। আপনি সেই এলাকার ভেরিফাইড রক্তদাতাদের তালিকা এবং ফোন নম্বর পেয়ে যাবেন।",
      category: "ব্যবহার"
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="bg-primary/10 text-primary border-none text-sm px-4">সহায়িকা</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight">সাধারণ <span className="text-primary">জিজ্ঞাসা</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            রক্তদান সম্পর্কে আপনার মনের সব প্রশ্নের উত্তর এখানে পাবেন। আমাদের লক্ষ্য আপনাকে সঠিক তথ্য দিয়ে সচেতন করা।
          </p>
          
          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="আপনার প্রশ্নটি এখানে খুঁজুন..." 
              className="h-14 pl-12 rounded-2xl border-2 focus:border-primary text-lg shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. FAQ Accordion */}
      <section className="py-16 container mx-auto px-4 max-w-4xl">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto opacity-20 mb-4" />
            <p className="text-xl font-bold text-muted-foreground">দুঃখিত! আপনার খোঁজা বিষয়টি পাওয়া যায়নি।</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-6">
            {filteredFaqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`} 
                className="border-none shadow-lg rounded-[2rem] bg-white px-8 overflow-hidden group hover:shadow-xl transition-all duration-500 border-l-8 border-primary/10 hover:border-primary"
              >
                <AccordionTrigger className="text-xl md:text-2xl font-black hover:no-underline py-8 text-foreground group-data-[state=open]:text-primary text-left">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    {faq.q}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-lg text-slate-600 pb-10 pl-14 leading-relaxed font-medium border-t border-slate-50 pt-6">
                  {faq.a}
                  <div className="mt-4">
                    <Badge variant="secondary" className="bg-muted text-[10px] uppercase tracking-widest font-black">{faq.category}</Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>

      {/* 3. CTA Section */}
      <section className="container mx-auto px-4 mt-12">
        <Card className="rounded-[3rem] bg-slate-900 text-white p-12 border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black font-headline">আপনার কি আরও কিছু জানার আছে?</h2>
              <p className="text-xl text-slate-400">আমাদের হেল্পলাইনে সরাসরি যোগাযোগ করতে পারেন অথবা মেসেজ দিন।</p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="rounded-full bg-primary hover:bg-secondary h-14 px-8 text-lg font-black shadow-xl" asChild>
                <Link href="/contact">যোগাযোগ করুন</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 h-14 px-8 text-lg font-bold" asChild>
                <a href="tel:+8801600151907">কল করুন</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
