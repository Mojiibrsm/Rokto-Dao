'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getBlogs, type BlogPost } from '@/lib/sheets';
import { format } from 'date-fns';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-center lg:text-left">
              <Badge className="bg-primary text-white border-none px-6 py-1.5 rounded-full text-sm font-black shadow-lg">ব্লগ ও সচেতনতা</Badge>
              <h1 className="text-4xl md:text-7xl font-black font-headline tracking-tight leading-tight">মানবতার জন্য <br /><span className="text-primary">কিছু কথা</span></h1>
              <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                রক্তদান সম্পর্কে জানুন, অন্যকে উদ্বুদ্ধ করুন এবং জীবন বাঁচাতে আপনার জ্ঞান বাড়ান।
              </p>
            </div>
            <div className="relative h-[300px] md:h-[450px] rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="https://picsum.photos/seed/bloghero/1200/800" 
                fill 
                alt="Blog Hero" 
                className="object-cover"
                priority
                data-ai-hint="medical blog"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-bold text-muted-foreground">ব্লগ লোড হচ্ছে...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">আপাতত কোনো ব্লগ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            {blogs.map((post) => (
              <Card key={post.id} className="group overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(211,29,42,0.15)] transition-all duration-500 rounded-[3rem] bg-white border-b-8 border-transparent hover:border-primary">
                <div className="relative h-72 overflow-hidden">
                  <Image 
                    src={post.imageurl || 'https://picsum.photos/seed/blog/800/500'} 
                    fill 
                    alt={post.title} 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint="blood health"
                  />
                  <Badge className="absolute top-8 left-8 bg-white text-primary border-none shadow-xl font-black px-4 py-1 rounded-full">{post.category}</Badge>
                </div>
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground font-bold mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {post.createdat ? format(new Date(post.createdat), 'MMM dd, yyyy') : 'Recently'}</span>
                    <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {post.author}</span>
                  </div>
                  <CardTitle className="text-3xl font-black leading-tight group-hover:text-primary transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-10">
                  <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3 font-medium">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="p-10 pt-4">
                  <Button variant="ghost" className="p-0 text-primary font-black text-xl hover:bg-transparent group/btn" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      আরও পড়ুন <ArrowRight className="ml-3 h-6 w-6 group-hover/btn:translate-x-3 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center text-white space-y-10 overflow-hidden relative border-4 border-primary/20 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
          <BookOpen className="h-20 w-20 mx-auto text-primary opacity-50 animate-pulse" />
          <h2 className="text-4xl md:text-7xl font-black font-headline">নতুন আর্টিকল পেতে যুক্ত থাকুন</h2>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto font-bold italic">
            আমরা নিয়মিত রক্তদান এবং স্বাস্থ্য সচেতনতা নিয়ে লেখা প্রকাশ করি। আপনার ইমেইল দিয়ে সাবস্ক্রাইব করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল" 
              className="flex-1 h-16 rounded-full px-10 bg-white/10 border-2 border-white/20 text-white outline-none focus:border-primary transition-all text-xl font-bold"
              suppressHydrationWarning
            />
            <Button className="h-16 rounded-full px-12 bg-primary hover:bg-secondary text-xl font-black shadow-xl shadow-primary/30 transition-all hover:scale-105">সাবস্ক্রাইব</Button>
          </div>
        </div>
      </section>
    </div>
  );
}