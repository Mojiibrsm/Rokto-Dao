'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Loader2, Tag, Clock, Share2, Facebook } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground">ব্লগটি লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl font-black">দুঃখিত! ব্লগটি পাওয়া যায়নি।</h1>
        <p className="text-xl text-muted-foreground">হয়তো এটি মুছে ফেলা হয়েছে অথবা স্লাগ ভুল।</p>
        <Button asChild className="rounded-full px-8 bg-primary">
          <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> সব ব্লগে ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Article Header */}
      <section className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8 hover:bg-primary/10">
            <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> সব ব্লগে ফিরে যান</Link>
          </Button>
          
          <div className="space-y-6">
            <Badge className="bg-primary text-white border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{post.category}</Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-headline leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-bold">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {post.createdat ? format(new Date(post.createdat), 'MMM dd, yyyy') : 'Recently'}</div>
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {post.author}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> ৫ মিনিট পড়া</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container mx-auto px-4 -mt-10 md:-mt-20 mb-12">
        <div className="max-w-5xl mx-auto relative h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-muted">
          <Image 
            src={post.imageurl || 'https://picsum.photos/seed/blog/1200/800'} 
            fill 
            alt={post.title} 
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="prose prose-lg max-w-none prose-slate prose-headings:font-headline prose-headings:font-black prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium prose-p:text-slate-700 prose-img:rounded-3xl">
            {post.content.split('\n').map((para, i) => (
              para.trim() ? <p key={i} className="mb-6">{para}</p> : <div key={i} className="h-2" />
            ))}
          </div>

          <div className="pt-12 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="font-black text-slate-900">শেয়ার করুন:</span>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="rounded-full hover:bg-blue-50 border-blue-100 text-blue-600" onClick={handleShare}>
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full hover:bg-primary/5 border-primary/10 text-primary" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold">
              <Tag className="h-4 w-4 text-primary" />
              <span>রক্তদান, স্বাস্থ্য টিপস, RoktoDao</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-[3rem] p-10 md:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          <h2 className="text-3xl md:text-4xl font-black text-white">রক্তদানে আগ্রহী?</h2>
          <p className="text-xl text-slate-400 font-medium">আপনার ১ ব্যাগ রক্ত বাঁচাতে পারে ৩টি প্রাণ। আজই নিবন্ধন করুন।</p>
          <Button size="lg" className="rounded-full px-10 h-14 bg-primary text-xl font-black shadow-xl shadow-primary/20" asChild>
            <Link href="/register">নিবন্ধন করুন</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
