'use client';

import Link from 'next/link';
import { 
  Droplet, Home, UserPlus, LogIn, Search, 
  ArrowLeft, AlertCircle, HeartPulse 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4 py-20">
      <div className="max-w-3xl w-full text-center space-y-10">
        {/* Animated Icon Section */}
        <div className="relative inline-block">
          <div className="h-40 w-40 md:h-56 md:w-56 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
            <div className="h-32 w-32 md:h-44 md:w-44 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="relative">
                <Droplet className="h-20 w-20 md:h-28 md:w-28 text-primary fill-primary opacity-20" />
                <Search className="absolute inset-0 h-10 w-10 md:h-14 md:w-14 text-primary m-auto stroke-[3px]" />
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white shadow-xl rounded-2xl p-4 border-2 border-primary/20 rotate-12 animate-bounce">
            <span className="text-4xl md:text-6xl font-black text-primary font-headline">404</span>
          </div>
        </div>

        {/* Message Section */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black font-headline text-slate-900 leading-tight">
            দুঃখিত! এই পেজটি <span className="text-primary">খুঁজে পাওয়া যায়নি।</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto font-bold leading-relaxed italic">
            "হয়তো আপনি ভুল লিংকে প্রবেশ করেছেন অথবা পেজটি সরিয়ে ফেলা হয়েছে। নিচে থাকা বাটনগুলো ব্যবহার করে আপনার গন্তব্যে ফিরে যান।"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-105" asChild>
            <Link href="/">
              <Home className="mr-2 h-5 w-5" /> হোমপেজে ফিরে যান
            </Link>
          </Button>
          
          <div className="flex w-full sm:w-auto gap-3">
            <Button size="lg" variant="outline" className="flex-1 h-14 px-6 rounded-2xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all" asChild>
              <Link href="/register">
                <UserPlus className="mr-2 h-5 w-5" /> রেজিস্ট্রেশন
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="flex-1 h-14 px-6 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" /> লগইন করুন
              </Link>
            </Button>
          </div>
        </div>

        {/* Additional Help Card */}
        <Card className="max-w-md mx-auto rounded-3xl border-none shadow-lg bg-white overflow-hidden mt-12">
          <CardContent className="p-6 flex items-center gap-4 text-left">
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <HeartPulse className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">জরুরি রক্ত প্রয়োজন?</h4>
              <p className="text-sm text-muted-foreground">সরাসরি আমাদের <Link href="/requests" className="text-primary font-bold hover:underline">অনুরোধ লিস্ট</Link> চেক করুন।</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
