'use client';

import Link from 'next/link';
import { Droplet, User, Bell, Menu, LayoutDashboard, LogOut, Users, Heart, ClipboardCheck, MessageSquare } from 'lucide-react';
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
    { href: '/eligibility', label: 'যোগ্যতা যাচাই', icon: ClipboardCheck },
    { href: '/team', label: 'আমাদের টিম', icon: Users },
    { href: '/about', label: 'আমাদের সম্পর্কে', icon: User },
    { href: '/contact', label: 'যোগাযোগ', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <nav className="w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-1 group">
            <div className="relative flex items-center justify-center">
              <Droplet className="h-8 w-8 text-primary fill-primary" />
            </div>
            <span className="tracking-tight font-headline text-2xl font-bold text-primary">RoktoDao</span>
            <div className="ml-1 bg-primary rounded-full p-1 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
              <Heart className="h-3 w-3 text-white fill-white" />
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-[15px] font-medium transition-colors hover:text-primary text-muted-foreground"
              >
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
                <Link href="/login" className="text-[15px] font-medium hidden sm:block hover:text-primary bg-muted/50 px-4 py-2 rounded-lg transition-colors">লগইন</Link>
                <Button size="default" asChild className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 font-bold">
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
                        className="text-lg font-medium"
                      >
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
