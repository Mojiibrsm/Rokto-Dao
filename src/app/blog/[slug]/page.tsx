'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Loader2, Tag, Clock, Share2, Facebook, Bookmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBlogs, type BlogPost } from '@/lib/sheets';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadPost() {
      try {
        const blogs = await getBlogs();
        const found = blogs.find(b => b.slug === slug);
        setPost(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "লিংক কপি হয়েছে!",
        description: "ব্লগটি শেয়ার করার জন্য লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে।",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-primary/20 border-b-primary animate-spin-reverse"></div>
        </div>
        <p className="font-black text-xl text-muted-foreground animate-pulse">ব্লগটি লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-8">
        <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <Bookmark className="h-12 w-12 text-primary opacity-20" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">দুঃখিত! ব্লগটি পাওয়া যায়নি।</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">হয়তো এটি মুছে ফেলা হয়েছে অথবা স্লাগ ভুল। সব ব্লগ দেখতে নিচে ক্লিক করুন।</p>
        <Button asChild className="rounded-2xl px-10 h-14 bg-primary text-lg font-black shadow-xl shadow-primary/20">
          <Link href="/blog"><ArrowLeft className="mr-2 h-5 w-5" /> সব ব্লগে ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 pb-32 bg-white">
      {/* 1. Article Header & Hero */}
      <section className="relative w-full pt-12 pb-24 md:pb-40 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Button variant="ghost" asChild className="mb-12 group hover:bg-primary/5 rounded-xl font-bold">
            <Link href="/blog"><ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" /> সব ব্লগে ফিরে যান</Link>
          </Button>
          
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-white border-none px-6 py-1 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                {post.category}
              </Badge>
              <div className="h-1 flex-1 bg-primary/10 rounded-full"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-headline leading-[1.1] text-slate-900 drop-shadow-sm">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-base text-muted-foreground font-bold border-t-2 border-slate-200/50 pt-8">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm"><Calendar className="h-5 w-5 text-primary" /> {post.createdat ? format(new Date(post.createdat), 'MMM dd, yyyy') : 'Recently'}</div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm"><User className="h-5 w-5 text-primary" /> {post.author}</div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm"><Clock className="h-5 w-5 text-primary" /> ৫ মিনিট পড়া</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Image Section */}
      <section className="container mx-auto px-4 -mt-16 md:-mt-32 mb-20 relative z-20">
        <div className="max-w-6xl mx-auto relative h-[350px] md:h-[650px] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[16px] border-white bg-slate-100 group">
          <Image 
            src={post.imageurl || 'https://picsum.photos/seed/blog/1200/800'} 
            fill 
            alt={post.title} 
            className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* 3. Main Content Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:font-headline prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:font-medium prose-img:rounded-[3rem] prose-a:text-primary prose-strong:text-slate-900">
            {post.content.split('\n').map((para, i) => (
              para.trim() ? (
                <p key={i} className="mb-8">{para}</p>
              ) : (
                <div key={i} className="h-4" />
              )
            ))}
          </div>

          {/* Share & Tags */}
          <div className="mt-20 pt-12 border-t-4 border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <span className="font-black text-slate-900 text-lg">আপনার বন্ধুদের সাথে শেয়ার করুন:</span>
              <div className="flex gap-3">
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-2xl hover:bg-blue-50 border-2 border-slate-100 text-blue-600 shadow-sm" onClick={handleShare}>
                  <Facebook className="h-6 w-6" />
                </Button>
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-2xl hover:bg-primary/5 border-2 border-slate-100 text-primary shadow-sm" onClick={handleShare}>
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-sm font-black bg-slate-50 px-6 py-3 rounded-full">
              <Tag className="h-4 w-4 text-primary" />
              <span className="uppercase tracking-widest">রক্তদান • জীবন • RoktoDao</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Banner */}
      <section className="container mx-auto px-4 mt-32">
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[4rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border-4 border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px]"></div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight relative z-10">রক্তদানের মাধ্যমে <br /><span className="text-primary">একজনের হিরো হোন</span></h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto relative z-10">আপনার সামান্য রক্তদান বাঁচাতে পারে ৩টি অমূল্য প্রাণ। আজই আমাদের রক্তদাতা সম্প্রদায়ের অংশ হোন।</p>
          <div className="pt-6 relative z-10">
            <Button size="lg" className="rounded-2xl px-16 h-16 bg-primary hover:bg-primary/90 text-2xl font-black shadow-[0_20px_50px_rgba(211,29,42,0.4)] transition-all hover:scale-105 active:scale-95" asChild>
              <Link href="/register">নিবন্ধন করুন</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
