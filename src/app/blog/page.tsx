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
      {/* 1. Hero Section */}
      <section className="bg-slate-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center space-y-6">
          <Badge className="bg-primary/10 text-primary border-none text-sm px-4">স্বাস্থ্য ও সচেতনতা</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight">আমাদের <span className="text-primary">ব্লগ</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            রক্তদান সম্পর্কে জানুন, অন্যকে উৎসাহিত করুন এবং জীবন বাঁচাতে আপনার জ্ঞানকে সমৃদ্ধ করুন।
          </p>
        </div>
      </section>

      {/* 2. Blog Grid */}
      <section className="py-16 container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <p className="font-bold text-muted-foreground">ব্লগ লোড হচ্ছে...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">আপাতত কোনো ব্লগ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <Card key={post.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white">
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={post.imageurl || 'https://picsum.photos/seed/blog/800/500'} 
                    fill 
                    alt={post.title} 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-primary border-none shadow-md font-bold">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="pt-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-bold">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.createdat ? format(new Date(post.createdat), 'MMM dd, yyyy') : 'Recently'}</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                  </div>
                  <CardTitle className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 border-t mt-4 p-0">
                  <Button variant="ghost" className="w-full h-14 rounded-none text-primary font-bold hover:bg-primary/5 group/btn" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      আরও পড়ুন <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}