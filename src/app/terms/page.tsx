
'use client';

import Image from 'next/image';
import { Gavel, CheckCircle, AlertTriangle, UserCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function TermsPage() {
  const termsImg = PlaceHolderImages.find(img => img.id === 'terms-conditions-img')?.imageUrl || 'https://picsum.photos/seed/terms/1200/800';

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="relative bg-muted/20 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 order-2 lg:order-1">
              <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান</Link>
              </Button>
              <Badge className="bg-secondary/10 text-secondary border-none text-sm px-4">ব্যবহারবিধি</Badge>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight">ব্যবহারের <span className="text-secondary">শর্তাবলী</span></h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                RoktoDao প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তগুলো মেনে নিচ্ছেন বলে গণ্য হবে। অনুগ্রহ করে সতর্কতার সাথে এগুলো পড়ুন।
              </p>
            </div>
            <div className="relative h-[300px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image 
                src={termsImg} 
                fill 
                alt="Terms and Conditions" 
                className="object-cover"
                data-ai-hint="terms agreement"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <UserCheck className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold font-headline">নিবন্ধন ও দায়িত্ব</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              প্ল্যাটফর্মে নিবন্ধনের সময় আপনাকে অবশ্যই সঠিক এবং সত্য তথ্য প্রদান করতে হবে। আপনার একাউন্টের মাধ্যমে করা যেকোনো কার্যক্রমের জন্য আপনি নিজেই দায়ী থাকবেন।
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold font-headline">রক্তদান সংক্রান্ত নীতিমালা</h2>
            </div>
            <ul className="list-disc list-inside space-y-3 text-lg text-muted-foreground ml-4">
              <li>রক্তদান একটি সম্পূর্ণ মানবিক ও অলাভজনক কাজ।</li>
              <li>রক্ত কেনাবেচা বা কোনো ধরণের আর্থিক লেনদেন দণ্ডনীয় অপরাধ।</li>
              <li>রক্ত দেওয়ার আগে দাতার শারীরিক অবস্থা পরীক্ষা করা হাসপাতাল বা সেন্টারের দায়িত্ব।</li>
              <li>RoktoDao কোনো মেডিকেল সেবা প্রদানকারী নয়, এটি কেবল দাতা ও গ্রহীতার সেতুবন্ধন।</li>
            </ul>
          </div>

          <Card className="rounded-[2.5rem] bg-red-50 border-2 border-dashed border-red-200 p-8 md:p-12">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-10 w-10 text-red-600" />
                <h3 className="text-3xl font-bold font-headline text-red-900">সতর্কবাণী</h3>
              </div>
              <p className="text-xl text-red-800 leading-relaxed font-medium">
                রক্ত দেওয়ার সময় দাতার কাছ থেকে কোনো প্রকার টাকা দাবি করা হলে বা কেউ রক্ত বিক্রির চেষ্টা করলে সরাসরি আমাদের জানান। আমরা আইনগত ব্যবস্থা নিতে দ্বিধা করব না।
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Gavel className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold font-headline">সীমাবদ্ধতা</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              রক্তদানের ফলে উদ্ভূত কোনো স্বাস্থ্যগত সমস্যা বা দাতা-গ্রহীতার মধ্যে ব্যক্তিগত বিবাদের জন্য RoktoDao কর্তৃপক্ষ দায়ী থাকবে না। আমরা কেবলমাত্র একটি যোগাযোগের মাধ্যম হিসেবে কাজ করি।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
