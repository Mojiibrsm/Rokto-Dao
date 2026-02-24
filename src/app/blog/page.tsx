
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BLOG_POSTS = [
  {
    id: 1,
    title: "রক্তদানের আগে ও পরে যা জানলে আপনার যাত্রা হবে নিরাপদ",
    excerpt: "রক্তদান একটি মহৎ কাজ। কিন্তু রক্তদানের আগে ও পরে কিছু নিয়ম মেনে চলা জরুরি যা আপনার শরীরকে সুস্থ রাখতে সাহায্য করবে...",
    date: "মে ১০, ২০২৪",
    author: "ডা. শফিকুল ইসলাম",
    category: "স্বাস্থ্য টিপস",
    image: PlaceHolderImages.find(img => img.id === 'blog-thumb-1')?.imageUrl || 'https://picsum.photos/seed/health1/800/500'
  },
  {
    id: 2,
    title: "রক্তের প্রয়োজনীয়তা এবং আমাদের সামাজিক দায়িত্ব",
    excerpt: "প্রতিদিন হাজার হাজার মানুষের রক্তের প্রয়োজন হয়। আমাদের এক ব্যাগ রক্ত যদি কারো জীবন বাঁচায়, তবে তার চেয়ে বড় সার্থকতা আর কী হতে পারে?",
    date: "মে ১৫, ২০২৪",
    author: "মুজিবুর রহমান",
    category: "সচেতনতা",
    image: PlaceHolderImages.find(img => img.id === 'blog-thumb-2')?.imageUrl || 'https://picsum.photos/seed/awareness1/800/500'
  },
  {
    id: 3,
    title: "কারা রক্ত দিতে পারেন? জেনে নিন রক্তদানের যোগ্যতা",
    excerpt: "আপনার বয়স ১৮ এর বেশি? ওজন কি ৫০ কেজির উপরে? আপনি কি সম্পূর্ণ সুস্থ? তবে আপনিও হতে পারেন একজন নিয়মিত রক্তদাতা...",
    date: "মে ২০, ২০২৪",
    author: "অ্যাডমিন প্যানেল",
    category: "যোগ্যতা",
    image: 'https://picsum.photos/seed/eligibility/800/500'
  },
  {
    id: 4,
    title: "রক্তদান নিয়ে কিছু প্রচলিত ভুল ধারণা ও বাস্তবতা",
    excerpt: "অনেকে মনে করেন রক্ত দিলে শরীর দুর্বল হয়ে যায়। কিন্তু চিকিৎসাবিজ্ঞান বলছে ভিন্ন কথা। নিয়মিত রক্তদান বরং শরীরের জন্য উপকারী...",
    date: "জুন ০৫, ২০২৪",
    author: "মেডিকেল টিম",
    category: "ভুল ধারণা",
    image: 'https://picsum.photos/seed/myth/800/500'
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 border-b">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="bg-primary text-white border-none px-4 py-1">ব্লগ ও সচেতনতা</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline">মানবতার জন্য <span className="text-primary">কিছু কথা</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            রক্তদান সম্পর্কে জানুন, অন্যকে উদ্বুদ্ধ করুন এবং জীবন বাঁচাতে আপনার জ্ঞান বাড়ান।
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={post.image} 
                  fill 
                  alt={post.title} 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-ai-hint="blood health"
                />
                <Badge className="absolute top-6 left-6 bg-primary text-white border-none shadow-lg">{post.category}</Badge>
              </div>
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
                </div>
                <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-8">
                <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-8 pt-4">
                <Button variant="ghost" className="p-0 text-primary font-bold text-lg hover:bg-transparent group/btn" asChild>
                  <Link href={`/blog/${post.id}`}>
                    আরও পড়ুন <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <BookOpen className="h-16 w-16 mx-auto text-primary opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold font-headline">নতুন আর্টিকল পেতে যুক্ত থাকুন</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            আমরা নিয়মিত রক্তদান এবং স্বাস্থ্য সচেতনতা নিয়ে লেখা প্রকাশ করি। আপনার ইমেইল দিয়ে সাবস্ক্রাইব করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল" 
              className="flex-1 h-14 rounded-full px-8 bg-white/5 border border-white/10 text-white outline-none focus:border-primary transition-colors"
            />
            <Button className="h-14 rounded-full px-10 bg-primary hover:bg-primary/90 text-lg font-bold">সাবস্ক্রাইব</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
