'use client';

import Link from 'next/link';
import { Droplet, User, Menu, LayoutDashboard, LogOut, Users, Heart, ClipboardCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkUser = () => {
      const savedUser = localStorage.getItem('roktodao_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('roktodao_user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const navLinks = [
    { href: '/donors', label: 'রক্তদাতা খুঁজুন', icon: User },
    { href: '/requests', label: 'রক্তের অনুরোধ', icon: Droplet },
    { href: '/eligibility', label: 'যোগ্যতা যাচাই', icon: ClipboardCheck },
    { href: '/team', label: 'আমাদের টিম', icon: Users },
    { href: '/about', label: 'আমাদের সম্পর্কে', icon: User },
    { href: '/contact', label: 'যোগাযোগ', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <nav className="w-full border-b-2 border-primary/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-md">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group shrink-0">
            <div className="relative flex items-center justify-center">
              {mounted ? (
                <Droplet className="h-9 w-9 text-primary fill-primary animate-pulse" />
              ) : (
                <Droplet className="h-8 w-8 text-primary fill-primary" />
              )}
            </div>
            <span className="tracking-tight font-headline text-2xl sm:text-3xl font-black text-primary">RoktoDao</span>
            <div className="ml-1 bg-primary rounded-full p-1.5 border-2 border-white shadow-lg group-hover:scale-125 transition-transform duration-300">
              <Heart className="h-3.5 w-3.5 text-white fill-white" />
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 mx-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-[15px] font-bold transition-all hover:text-primary text-muted-foreground hover:scale-105 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!mounted ? (
              <div className="h-10 w-24 bg-muted animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/dashboard" className="text-[13px] font-black flex items-center gap-2 text-primary bg-primary/5 px-3 py-2 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors whitespace-nowrap">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">আমার ড্যাশবোর্ড</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 font-bold hover:bg-red-50 text-[13px]">
                  <LogOut className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">লগআউট</span>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-bold hidden sm:block hover:text-primary text-foreground px-4 py-2 rounded-lg transition-colors whitespace-nowrap">লগইন</Link>
                <Button size="default" asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 sm:px-8 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm whitespace-nowrap">
                  <Link href="/register">রেজিস্ট্রেশন</Link>
                </Button>
              </>
            )}
            
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary h-10 w-10">
                    <Menu className="h-7 w-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-4 border-primary">
                  <SheetHeader className="text-left border-b-2 border-primary/10 pb-6 mb-6">
                    <SheetTitle className="text-2xl font-black flex items-center gap-2 text-primary">
                      <Droplet className="h-7 w-7 fill-primary" />
                      RoktoDao
                    </SheetTitle>
                    <SheetDescription className="font-medium text-muted-foreground">
                      জীবন বাঁচাতে আমাদের সাথে যুক্ত থাকুন।
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-4">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-black text-foreground hover:text-primary transition-colors">হোম</Link>
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-3 whitespace-nowrap"
                      >
                        <link.icon className="h-5 w-5 text-primary/60" />
                        {link.label}
                      </Link>
                    ))}
                    <div className="h-px bg-primary/10 w-full" />
                    {!mounted ? (
                      <div className="h-10 w-full bg-muted animate-pulse rounded-lg" />
                    ) : user ? (
                      <>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-xl font-black text-primary flex items-center gap-3">
                          <LayoutDashboard className="h-6 w-6" /> ড্যাশবোর্ড
                        </Link>
                        <button onClick={handleLogout} className="text-xl font-bold text-left text-red-600 flex items-center gap-3">
                          <LogOut className="h-6 w-6" /> লগআউট
                        </button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-bold text-foreground">লগইন</Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
