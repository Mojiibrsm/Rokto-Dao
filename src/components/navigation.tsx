
'use client';

import Link from 'next/link';
import { Droplet, MapPin, ClipboardCheck, History, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary text-xl">
          <Droplet className="h-6 w-6 fill-primary" />
          <span className="tracking-tight font-headline">Lifeline Hub</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/drives" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Find Drives
          </Link>
          <Link href="/eligibility" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
            <ClipboardCheck className="h-4 w-4" />
            Eligibility Check
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary flex items-center gap-1.5">
            <History className="h-4 w-4" />
            My History
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="hidden sm:flex border-secondary text-secondary hover:bg-accent">
            <Link href="/register">Register</Link>
          </Button>
          <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/drives">Donate Now</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
