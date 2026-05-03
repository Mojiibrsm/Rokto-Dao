import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Droplet } from 'lucide-react';
import Link from 'next/link';
import { FooterYear } from '@/components/footer-year';
import Script from 'next/script';
import { I18nProvider } from '@/lib/i18n-context';

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
  description: 'রক্তদাও (RoktoDao) বাংলাদেশের বৃহত্তম অনলাইন রক্তদাতা ডাটাবেজ। ঢাকা, চট্টগ্রামসহ ৬৪ জেলায় জরুরি মুহূর্তে A+, O+, B+ রক্তদাতা খুঁজুন। সন্ধানী, বাঁধন ও রেড ক্রিসেন্ট ব্লাড ব্যাংকের তথ্যসহ রক্তদানের নিয়ম ও উপকারিতা জানুন।',
  keywords: [
    'Bangladesh Blood donor list', 'Blood Donor bd', 'Blood Donor Name list', 'Blood donor Group', 'Blood donor group in bangladesh', 
    'Blood donor Group in Chittagong', 'Blood donor list in Dhaka', 'Blood donation Dhaka', 'Book blood donation', 'রক্তদাতা বাংলাদেশ', 
    'রক্তদাতার তালিকা', 'অনলাইনে রক্তের সন্ধান', 'স্বেচ্ছায় রক্তদান বাংলাদেশ', 'ব্লাড ব্যাংক বাংলাদেশ', 'ব্লাড ডোনার গ্রুপ', 'রক্তদাতার মোবাইল নাম্বার',
    'Find blood donor bd', 'Blood donor registration bangladesh', 'Emergency blood donor Dhaka', 'A+ blood donor bd', 'O+ blood donor in Dhaka',
    'B+ blood donor Chittagong', 'Sandhani blood donor list', 'Badhan blood donor organization', 'Red crescent blood bank bangladesh',
    'Urgent blood needed bd', 'Dengue patient blood donor', 'রক্তদান নিয়ে উক্তি', 'রক্তদান করার নিয়ম', 'রক্তদানের উপকারিতা'
  ],
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
    title: 'রক্তদাও - RoktoDao | মানবতার সেবায় রক্তদাতা ও গ্রহীতার সেতুবন্ধন',
    description: 'সারাদেশে জরুরি মুহূর্তে রক্তদাতা খুঁজে পেতে RoktoDao-তে যুক্ত হোন। রক্ত দিয়ে জীবন বাঁচান।',
    url: baseUrl,
    siteName: 'RoktoDao',
    locale: 'bn_BD',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RoktoDao - Online Blood Donation Platform Bangladesh',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoktoDao - Find Blood Donors in Bangladesh Instantly',
    description: 'Emergency blood donor search and registration platform in BD. Join our mission.',
    images: ['/og-image.png'],
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
        <I18nProvider>
          <Navigation />
          
          <main className="flex-grow">{children}</main>

          <footer className="bg-slate-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-6">
                  <Link href="/" className="flex items-center gap-1 font-bold text-primary text-2xl">
                    <Droplet className="h-8 w-8 text-primary fill-primary" />
                    <span className="tracking-tight font-headline">RoktoDao</span>
                  </Link>
                  <p className="text-slate-400 text-base leading-relaxed">
                    বাংলাদেশের অন্যতম নির্ভরযোগ্য রক্তদাতা প্ল্যাটফর্ম। ঢাকা, চট্টগ্রামসহ সব জেলায় জরুরি প্রয়োজনে রক্তদাতা খুঁজে পেতে আমরা আপনার পাশে আছি।
                  </p>
                  <div className="text-2xl font-black text-primary">+8801600151907</div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b border-slate-700 pb-2">জরুরি লিংক</h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li><Link href="/donors" className="hover:text-primary transition-colors">রক্তদাতা খুঁজুন (Find Donor)</Link></li>
                    <li><Link href="/donors/map" className="hover:text-primary transition-colors">রক্তদাতা মানচিত্র (Blood Map)</Link></li>
                    <li><Link href="/requests" className="hover:text-primary transition-colors">রক্তের অনুরোধ (Blood Request)</Link></li>
                    <li><Link href="/eligibility" className="hover:text-primary transition-colors">রক্তদানের যোগ্যতা (Eligibility)</Link></li>
                    <li><Link href="/blog" className="hover:text-primary transition-colors">আমাদের ব্লগ (Awareness)</Link></li>
                    <li><Link href="/faq" className="hover:text-primary transition-colors">সাধারণ জিজ্ঞাসা (FAQ)</Link></li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b border-slate-700 pb-2">সেবা এলাকা (Areas)</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <span className="hover:text-slate-300">ঢাকা (Dhaka)</span>
                    <span className="hover:text-slate-300">চট্টগ্রাম (Ctg)</span>
                    <span className="hover:text-slate-300">সিলেট (Sylhet)</span>
                    <span className="hover:text-slate-300">রাজশাহী (Raj)</span>
                    <span className="hover:text-slate-300">খুলনা (Khulna)</span>
                    <span className="hover:text-slate-300">বরিশাল (Barisal)</span>
                    <span className="hover:text-slate-300">রংপুর (Rangpur)</span>
                    <span className="hover:text-slate-300">কুমিল্লা (Cumilla)</span>
                    <span className="hover:text-slate-300">গাজীপুর (Gazipur)</span>
                    <span className="hover:text-slate-300">নোয়াখালী (Noakhali)</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-500 italic">সারা বাংলাদেশে (৬৪ জেলা) আমাদের কার্যক্রম পরিচালিত হয়।</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b border-slate-700 pb-2">রক্তের গ্রুপ (Groups)</h3>
                  <div className="flex flex-wrap gap-2">
                    {['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'].map(g => (
                      <span key={g} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-black">{g}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    সন্ধানী (Sandhani), বাঁধন (Badhan) এবং রেড ক্রিসেন্ট (Red Crescent) সহ সকল স্বেচ্ছাসেবী সংগঠনের জন্য উন্মুক্ত প্ল্যাটফর্ম।
                  </p>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-6 text-[10px] uppercase font-black text-slate-500 tracking-widest">
                  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                  <Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
                </div>
                <div className="text-slate-600 text-[10px] font-bold">
                  <FooterYear />
                </div>
              </div>
            </div>
          </footer>

          <Toaster />
        </I18nProvider>

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
