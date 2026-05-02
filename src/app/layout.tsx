import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Droplet } from 'lucide-react';
import Link from 'next/link';
import { FooterYear } from '@/components/footer-year';
import Script from 'next/script';
import { FirebaseClientProvider } from '@/firebase';
import { PresenceManager } from '@/components/presence-manager';

export const viewport: Viewport = {
  themeColor: '#d31d2a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const baseUrl = 'https://roktodao.pro.bd';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'রক্তদাও - RoktoDao | বাংলাদেশে রক্তদাতা খুঁজুন ও জীবন বাঁচান',
    template: '%s | RoktoDao'
  },
  description: 'রক্তদাও (RoktoDao) বাংলাদেশের একটি অন্যতম বৃহৎ রক্তদাতার প্ল্যাটফর্ম। এখানে আপনি সারা বাংলাদেশের যেকোনো প্রান্ত থেকে জরুরি মুহূর্তে রক্তের গ্রুপ অনুযায়ী রক্তদাতা খুঁজে পেতে পারেন।',
  keywords: ['রক্তদাও', 'RoktoDao', 'রক্তদান', 'রক্তদাতা খুঁজুন', 'বাংলাদেশে রক্তদান'],
  authors: [{ name: 'RoktoDao Team' }],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RoktoDao',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'রক্তদাও - RoktoDao | মানবতার সেবায় নিয়োজিত',
    description: 'সারাদেশে জরুরি মুহূর্তে রক্তদাতা খুঁজে পেতে আমাদের সাথে যুক্ত হোন।',
    url: baseUrl,
    siteName: 'RoktoDao',
    locale: 'bn_BD',
    type: 'website',
  },
  alternates: {
    canonical: './',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://roktodao.pro.bd/files/icon-192x192.png" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col" suppressHydrationWarning>
        <FirebaseClientProvider>
          <PresenceManager />
          <Navigation />
          
          <main className="flex-grow">{children}</main>

          <footer className="bg-slate-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-1 font-bold text-primary text-2xl">
                  <Droplet className="h-8 w-8 text-primary fill-primary" />
                  <span className="tracking-tight font-headline">RoktoDao</span>
                </Link>
                <p className="text-slate-400 text-base">
                  Connecting blood donors with recipients across Bangladesh. Saving lives together.
                </p>
                <div className="text-xl font-bold text-primary">+8801600151907</div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b border-slate-700 pb-2">গুরুত্বপূর্ণ লিংক</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/donors" className="hover:text-primary transition-colors">দাতা খুঁজুন</Link></li>
                  <li><Link href="/donors/map" className="hover:text-primary transition-colors">রক্তদাতা মানচিত্র</Link></li>
                  <li><Link href="/requests" className="hover:text-primary transition-colors">রক্তের অনুরোধ</Link></li>
                  <li><Link href="/faq" className="hover:text-primary transition-colors">সাধারণ জিজ্ঞাসা (FAQ)</Link></li>
                  <li><Link href="/register" className="hover:text-primary transition-colors">নিবন্ধন করুন</Link></li>
                  <li><Link href="/blog" className="hover:text-primary transition-colors">ব্লগ</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b border-slate-700 pb-2">সম্পর্কে</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/about" className="hover:text-primary transition-colors">আমাদের সম্পর্কে</Link></li>
                  <li><Link href="/team" className="hover:text-primary transition-colors">আমাদের টিম</Link></li>
                  <li><Link href="/contact" className="hover:text-primary transition-colors">যোগাযোগ</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b border-slate-700 pb-2">আইনি</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">গোপনীয়তা নীতি</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">শর্তাবলী</Link></li>
                </ul>
              </div>
            </div>
            <div className="container mx-auto px-4 mt-10 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs">
              <FooterYear />
            </div>
          </footer>

          <Toaster />
        </FirebaseClientProvider>

        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
