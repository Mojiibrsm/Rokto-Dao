'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Loader2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBlogs, type BlogPost } from '@/lib/sheets';
import { format } from 'date-fns';

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold">দুঃখিত! ব্লগটি পাওয়া যায়নি।</h1>
        <Button asChild className="rounded-xl bg-primary">
          <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> ব্লগে ফিরে যান</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> সব ব্লগ</Link>
      </Button>

      <div className="space-y-8">
        <div className="space-y-4">
          <Badge className="bg-primary/10 text-primary border-none">{post.category}</Badge>
          <h1 className="text-3xl md:text-5xl font-black font-headline leading-tight text-slate-900">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-bold border-y py-4">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {post.createdat ? format(new Date(post.createdat), 'MMM dd, yyyy') : 'Recently'}</div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {post.author}</div>
          </div>
        </div>

        <div className="relative h-64 md:h-[450px] rounded-3xl overflow-hidden shadow-xl">
          <Image src={post.imageurl || 'https://picsum.photos/seed/blog/1200/800'} fill alt={post.title} className="object-cover" />
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-xl font-bold text-slate-600 italic border-l-4 border-primary pl-6 py-2 mb-8 bg-primary/5 rounded-r-lg">
            {post.excerpt}
          </p>
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700">
            {post.content}
          </div>
        </div>

        <div className="mt-16 p-8 bg-slate-900 text-white rounded-3xl text-center space-y-6">
          <h2 className="text-2xl font-bold">রক্তদান করে একজনের জীবন বাঁচাতে চান?</h2>
          <Button size="lg" className="rounded-xl bg-primary hover:bg-primary/90 px-10 h-14 text-lg font-bold" asChild>
            <Link href="/register">নিবন্ধন করুন</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}