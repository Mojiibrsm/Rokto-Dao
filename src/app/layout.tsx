import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { Droplet, Facebook } from 'lucide-react';
import Link from 'next/link';
import { FooterYear } from '@/components/footer-year';

export const viewport: Viewport = {
  themeColor: '#d31d2a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'রক্তদাও - RoktoDao | বাংলাদেশে রক্তদাতা খুঁজুন ও জীবন বাঁচান',
    template: '%s | RoktoDao'
  },
  description: 'রক্তদাও (RoktoDao) বাংলাদেশের একটি অন্যতম বৃহৎ রক্তদাতার প্ল্যাটফর্ম। এখানে আপনি সারা বাংলাদেশের যেকোনো প্রান্ত থেকে জরুরি মুহূর্তে রক্তের গ্রুপ অনুযায়ী রক্তদাতা খুঁজে পেতে পারেন এবং নিজে রক্তদাতার তালিকায় নাম নিবন্ধন করে জীবন বাঁচাতে পারেন।',
  keywords: [
    'রক্তদাও', 'RoktoDao', 'রক্তদান', 'রক্তদাতা খুঁজুন', 'বাংলাদেশে রক্তদান', 'Blood Donation Bangladesh', 
    'Find Blood Donor', 'Emergency Blood', 'রক্তদান অ্যাপ', 'জীবন বাঁচান', 'ব্লাড ডোনার'
  ],
  authors: [{ name: 'RoktoDao Team' }],
  creator: 'RoktoDao',
  publisher: 'RoktoDao',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'রক্তদাও - RoktoDao | মানবতার সেবায় নিয়োজিত',
    description: 'সারাদেশে জরুরি মুহূর্তে রক্তদাতা খুঁজে পেতে এবং স্বেচ্ছায় রক্তদানে উৎসাহিত করতে আমাদের সাথে যুক্ত হোন।',
    url: 'https://roktodao.com',
    siteName: 'RoktoDao',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'রক্তদাও - RoktoDao',
    description: 'বাংলাদেশে জরুরি রক্তদাতা খোঁজার সহজ মাধ্যম। দ্রুত রক্ত পেতে সাহায্য করে আমাদের দেশব্যাপী নেটওয়ার্ক।',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col" suppressHydrationWarning>
        <Navigation />
        
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white pt-12 pb-8">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-1 font-bold text-primary text-2xl">
                <div className="relative flex items-center justify-center">
                  <Droplet className="h-8 w-8 text-primary fill-primary" />
                </div>
                <span className="tracking-tight font-headline">RoktoDao</span>
              </Link>
              <p className="text-slate-400 text-base">
                Connecting blood donors with recipients across Bangladesh. Saving lives together through technology and humanity.
              </p>
              <div className="flex flex-col gap-2">
                <div className="text-xl font-bold text-primary">+8801600151907</div>
                <div className="flex gap-3 pt-2">
                  <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-700 pb-2">গুরুত্বপূর্ণ লিংক</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/donors" className="hover:text-primary transition-colors">দাতা খুঁজুন</Link></li>
                <li><Link href="/requests" className="hover:text-primary transition-colors">রক্তের অনুরোধ</Link></li>
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
                <li><Link href="/faq" className="hover:text-primary transition-colors">সাধারণ জিজ্ঞাসা</Link></li>
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
      </body>
    </html>
  );
}