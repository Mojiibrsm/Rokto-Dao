'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen, Loader2, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col gap-0 pb-20 bg-slate-50/50">
      {/* 1. Dynamic Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-32">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary hover:bg-primary border-none text-white px-6 py-1.5 rounded-full text-sm font-black shadow-lg shadow-primary/20 animate-pulse">
              <Sparkles className="h-4 w-4 mr-2" /> স্বাস্থ্য ও সচেতনতা
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black font-headline tracking-tight leading-tight text-white">
              মানবতার তরে <br />
              <span className="text-primary italic">শিক্ষামূলক কিছু কথা</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              রক্তদান সম্পর্কে জানুন, অন্যকে উৎসাহিত করুন এবং জীবন বাঁচাতে আপনার জ্ঞানকে সমৃদ্ধ করুন। আমাদের প্রতিটি আর্টিকল একটি পরিবর্তনের গল্প।
            </p>
          </div>
        </div>
      </section>

      {/* 2. Blog Grid Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center justify-between mb-12 border-b-4 border-primary/10 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900">সাম্প্রতিক পোস্টসমূহ</h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Latest insights & updates</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <div className="h-2 w-2 rounded-full bg-primary/40"></div>
            <div className="h-2 w-2 rounded-full bg-primary/20"></div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
            <p className="font-black text-muted-foreground italic">ব্লগগুলো সাজানো হচ্ছে...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] shadow-xl border-2 border-dashed">
            <AlertCircle className="h-20 w-20 text-muted-foreground opacity-10 mb-4" />
            <p className="text-2xl font-black text-muted-foreground">আপাতত কোনো ব্লগ পাওয়া যায়নি।</p>
            <p className="text-slate-400 mt-2">নতুন পোস্টের জন্য শীঘ্রই আবার ভিজিট করুন।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
            {blogs.map((post) => (
              <Card key={post.id} className="group overflow-hidden border-none shadow-[0_30px_60px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(211,29,42,0.12)] transition-all duration-700 rounded-[3rem] bg-white border-b-[12px] border-transparent hover:border-primary">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <Image 
                      src={post.imageurl || 'https://picsum.photos/seed/blog/800/500'} 
                      fill 
                      alt={post.title} 
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      data-ai-hint="blood health"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-black/20"></div>
                    <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-primary border-none shadow-xl font-black px-4 py-1 rounded-full text-[10px] uppercase">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="flex flex-col p-8 md:p-10 justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-black uppercase tracking-tighter">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {post.createdat ? format(new Date(post.createdat), 'MMM dd, yyyy') : 'Recently'}</span>
                        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" /> {post.author}</span>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 font-medium italic">
                        {post.excerpt}
                      </p>
                    </div>
                    <CardFooter className="p-0 pt-8 mt-auto">
                      <Button variant="ghost" className="p-0 text-primary font-black text-lg hover:bg-transparent group/btn flex items-center gap-3" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          পড়তে থাকুন <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-all duration-500"><ArrowRight className="h-5 w-5" /></div>
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 3. Enhanced Newsletter Section */}
      <section className="container mx-auto px-4 mt-12">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 text-center text-white space-y-12 overflow-hidden relative border-4 border-primary/20 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[150px]"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto border-2 border-primary/30 shadow-xl shadow-primary/10">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">নতুন আপডেট পেতে <br /><span className="text-primary">সাবস্ক্রাইব করুন</span></h2>
            <p className="text-xl text-slate-400 font-bold italic opacity-80">
              আমরা নিয়মিত রক্তদান এবং স্বাস্থ্য সচেতনতা নিয়ে নতুন নতুন লেখা প্রকাশ করি। আপনার ইমেইল দিয়ে আমাদের সাথে যুক্ত থাকুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল ঠিকানা লিখুন" 
                className="flex-1 h-16 rounded-2xl px-8 bg-white/10 border-2 border-white/10 text-white outline-none focus:border-primary transition-all text-lg font-bold"
                suppressHydrationWarning
              />
              <Button className="h-16 rounded-2xl px-12 bg-primary hover:bg-primary/90 text-white text-xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                যুক্ত হোন
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
