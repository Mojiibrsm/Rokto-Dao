
'use client';

import Link from 'next/link';
import { Droplet, MapPin, ClipboardCheck, History, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Urgent Notification Bar */}
      <div className="bg-primary text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
        <Bell className="h-4 w-4 animate-bounce" />
        <span>জরুরী: শরীয়তপুর-এ B- রক্তের প্রয়োজন।</span>
        <Link href="/requests" className="underline font-bold ml-2">আরো দেখুন</Link>
      </div>

      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-xl">
            <Droplet className="h-6 w-6 fill-primary" />
            <span className="tracking-tight font-headline">RoktoDao</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/donors" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
              <User className="h-4 w-4" />
              রক্তদাতা খুঁজুন
            </Link>
            <Link href="/requests" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
              <Droplet className="h-4 w-4" />
              রক্তের অনুরোধ
            </Link>
            <Link href="/eligibility" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
              <ClipboardCheck className="h-4 w-4" />
              যোগ্যতা যাচাই
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
              <History className="h-4 w-4" />
              ইতিহাস
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hidden sm:block">লগইন</Link>
            <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/register">রেজিস্ট্রেশন</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
