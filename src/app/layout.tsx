
import type {Metadata} from 'next';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'RoktoDao - রক্তদান ও জীবন বাঁচান',
  description: 'রক্তদাতা খুঁজুন, রক্তের অনুরোধ করুন এবং রক্তদানের মাধ্যমে জীবন বাঁচান।',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <Navigation />
        <main>{children}</main>
        <div className="fixed bottom-6 right-6 z-40">
           <button className="bg-primary text-white px-6 py-3 rounded-full shadow-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
             রক্তের অনুরোধ
           </button>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
