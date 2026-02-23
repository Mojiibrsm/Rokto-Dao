'use client';

import Link from 'next/link';
import { Droplet, User, Bell, Menu, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
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
    router.push('/');
  };

  const navLinks = [
    { href: '/donors', label: 'রক্তদাতা খুঁজুন', icon: User },
    { href: '/requests', label: 'রক্তের অনুরোধ', icon: Droplet },
    { href: '/eligibility', label: 'যোগ্যতা যাচাই', icon: User },
    { href: '/about', label: 'আমাদের সম্পর্কে', icon: User },
    { href: '/contact', label: 'যোগাযোগ', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <div className="bg-primary text-white py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee hover-pause px-4">
          <span className="mx-8">জরুরী: শরীয়তপুর-এ B- রক্তের প্রয়োজন। <Link href="/requests" className="underline font-bold ml-2">যোগাযোগ করুন</Link></span>
          <span className="mx-8">কক্সবাজার-এ AB+ রক্তের প্রয়োজন। <Link href="/requests" className="underline font-bold ml-2">যোগাযোগ করুন</Link></span>
        </div>
      </div>

      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-xl">
            <Droplet className="h-8 w-8 fill-primary" />
            <span className="tracking-tight font-headline text-2xl">RoktoDao</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-bold flex items-center gap-2 text-primary">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">আমার ড্যাশবোর্ড</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
                  <LogOut className="h-4 w-4 mr-1" /> লগআউট
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hidden sm:block hover:text-primary">লগইন</Link>
                <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                  <Link href="/register">রেজিস্ট্রেশন</Link>
                </Button>
              </>
            )}
            
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left border-b pb-4 mb-4">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                      <Droplet className="h-6 w-6 text-primary fill-primary" />
                      RoktoDao
                    </SheetTitle>
                    <SheetDescription>
                      জীবন বাঁচাতে আমাদের সাথে যুক্ত থাকুন।
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-4">
                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-bold">হোম</Link>
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium flex items-center gap-3"
                      >
                        <link.icon className="h-5 w-5 text-primary" />
                        {link.label}
                      </Link>
                    ))}
                    <hr />
                    {user ? (
                      <>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-primary">ড্যাশবোর্ড</Link>
                        <button onClick={handleLogout} className="text-lg font-medium text-left text-red-500">লগআউট</button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium">লগইন</Link>
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
