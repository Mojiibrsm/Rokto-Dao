
'use client';

import Image from 'next/image';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function PrivacyPage() {
  const privacyImg = PlaceHolderImages.find(img => img.id === 'privacy-policy-img')?.imageUrl || 'https://picsum.photos/seed/privacy/1200/800';

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান</Link>
              </Button>
              <Badge className="bg-primary/10 text-primary border-none text-sm px-4">নিরাপত্তা ও গোপনীয়তা</Badge>
              <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tight">গোপনীয়তা <span className="text-primary">নীতি</span></h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                RoktoDao আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। আমরা কীভাবে আপনার তথ্য সংগ্রহ এবং ব্যবহার করি তা এখানে বিস্তারিত আলোচনা করা হলো।
              </p>
            </div>
            <div className="relative h-[300px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={privacyImg} 
                fill 
                alt="Privacy Policy" 
                className="object-cover"
                data-ai-hint="privacy security"
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
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold font-headline">তথ্য সংগ্রহ</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              আমরা যখন আপনি নিবন্ধন করেন বা রক্তের অনুরোধ করেন, তখন কিছু প্রয়োজনীয় তথ্য সংগ্রহ করি। এর মধ্যে রয়েছে:
            </p>
            <ul className="list-disc list-inside space-y-3 text-lg text-muted-foreground ml-4">
              <li>আপনার পুরো নাম</li>
              <li>মোবাইল নম্বর</li>
              <li>রক্তের গ্রুপ</li>
              <li>বর্তমান অবস্থান (জেলা ও উপজেলা)</li>
              <li>ইমেইল ঠিকানা</li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold font-headline">তথ্যের ব্যবহার</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              সংগৃহীত তথ্য শুধুমাত্র নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:
            </p>
            <ul className="list-disc list-inside space-y-3 text-lg text-muted-foreground ml-4">
              <li>জরুরি মুহূর্তে রক্তদাতা ও গ্রহীতার মধ্যে যোগাযোগ স্থাপন।</li>
              <li>আপনার ড্যাশবোর্ড আপডেট করা।</li>
              <li>প্ল্যাটফর্মের নিরাপত্তা এবং স্বচ্ছতা বজায় রাখা।</li>
              <li>প্রয়োজনীয় নোটিফিকেশন পাঠানো।</li>
            </ul>
          </div>

          <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-12 border-none shadow-2xl">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <h3 className="text-3xl font-bold font-headline">তথ্য সুরক্ষা</h3>
              </div>
              <p className="text-xl opacity-80 leading-relaxed italic">
                "আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা বিনিময় করি না। আপনার তথ্য আমাদের কাছে পবিত্র আমানত এবং আমরা এর সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।"
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold font-headline">নীতির পরিবর্তন</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              RoktoDao যেকোনো সময় এই গোপনীয়তা নীতি পরিবর্তন করার অধিকার রাখে। বড় কোনো পরিবর্তন করা হলে আমরা আপনাকে ইমেইল বা আমাদের প্ল্যাটফর্মের মাধ্যমে জানিয়ে দেব।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
