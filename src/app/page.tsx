
import Link from 'next/link';
import Image from 'next/image';
import { Droplet, Heart, ShieldCheck, MapPin, ArrowRight, History, Search, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-blood-donation');

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-accent/10">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground font-headline">
              আপনার নিকটবর্তী রক্তদাতা খুঁজুন
            </h1>
            <p className="text-xl text-muted-foreground">
              জরুরী মুহূর্তে রক্ত খুঁজে পেতে বা রক্তদানের মাধ্যমে জীবন বাঁচাতে আমাদের প্ল্যাটফর্মে যোগ দিন।
            </p>
          </div>

          {/* Search Bar */}
          <Card className="w-full max-w-4xl shadow-2xl p-6 border-t-4 border-t-primary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold">রক্তের গ্রুপ</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="যেকোনো গ্রুপ" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-bold">জেলা</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="যেকোনো জেলা" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary h-10 gap-2">
                <Search className="h-4 w-4" /> অনুসন্ধান
              </Button>
            </div>
          </Card>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" asChild className="border-primary text-primary">
              <Link href="/requests">রক্তের অনুরোধ দেখুন</Link>
            </Button>
            <Button size="lg" asChild className="bg-primary text-white">
              <Link href="/register">রক্তদাতা হোন</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">কিভাবে কাজ করে?</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary text-2xl font-bold">১</div>
            <h3 className="text-xl font-bold">নিবন্ধন করুন</h3>
            <p className="text-muted-foreground">একজন রক্তদাতা হিসেবে আপনার তথ্য দিয়ে আমাদের প্ল্যাটফর্মে নিবন্ধন সম্পন্ন করুন।</p>
          </div>
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary text-2xl font-bold">২</div>
            <h3 className="text-xl font-bold">অনুসন্ধান বা পোস্ট</h3>
            <p className="text-muted-foreground">আপনার প্রয়োজনীয় রক্তের গ্রুপ ও এলাকা অনুযায়ী রক্তদাতা খুঁজুন অথবা রক্তের জন্য অনুরোধ পোস্ট করুন।</p>
          </div>
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary text-2xl font-bold">৩</div>
            <h3 className="text-xl font-bold">সংযোগ ও জীবন বাঁচান</h3>
            <p className="text-muted-foreground">সঠিক রক্তদাতার সাথে যোগাযোগ করে জরুরি মুহূর্তে জীবন বাঁচাতে সাহায্য করুন।</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold">৫০০০+</div>
            <div className="text-primary-foreground/80">মোট রক্তদাতা</div>
          </div>
          <div>
            <div className="text-4xl font-bold">১২০০+</div>
            <div className="text-primary-foreground/80">রক্তের অনুরোধ</div>
          </div>
          <div>
            <div className="text-4xl font-bold">৮৫০+</div>
            <div className="text-primary-foreground/80">সফল রক্তদান</div>
          </div>
          <div>
            <div className="text-4xl font-bold">৩৫০+</div>
            <div className="text-primary-foreground/80">আজকের সক্রিয় দাতা</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">কেন RoktoDao বেছে নিবেন?</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm text-center">
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle>যাচাইকৃত রক্তদাতা</CardTitle>
              <CardDescription>আমাদের সকল রক্তদাতা যাচাইকৃত, তাই আপনি নির্ভয়ে যোগাযোগ করতে পারেন।</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm text-center">
            <CardHeader>
              <Droplet className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle>দ্রুত যোগাযোগ ব্যবস্থা</CardTitle>
              <CardDescription>সরাসরি ফোন কলের মাধ্যমে দ্রুত রক্তদাতার সাথে যোগাযোগ স্থাপন করা যায়।</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm text-center">
            <CardHeader>
              <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle>দেশব্যাপী নেটওয়ার্ক</CardTitle>
              <CardDescription>সারাদেশে আমাদের রক্তদাতাদের নেটওয়ার্ক বিস্তৃত, যা জরুরি মুহূর্তে সহায়ক।</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm text-center">
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle>গোপনীয়তা সুরক্ষিত</CardTitle>
              <CardDescription>আপনার সকল ব্যক্তিগত তথ্য আমাদের কাছে সম্পূর্ণ সুরক্ষিত এবং গোপন রাখা হয়।</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12 font-headline">সফলতার গল্প</h2>
           <div className="grid md:grid-cols-2 gap-8">
             <Card className="p-6 italic text-muted-foreground">
               "আমার মেয়ের জন্য জরুরি রক্তের প্রয়োজন ছিল। RoktoDao-এর মাধ্যমে মাত্র ১ ঘন্টার মধ্যে একজন দাতার সাথে যোগাযোগ করতে পারি। আমি তাদের কাছে চিরকৃতজ্ঞ।"
               <div className="mt-4 font-bold text-foreground">- আকবর হোসেন, রোগীর বাবা</div>
             </Card>
             <Card className="p-6 italic text-muted-foreground">
               "একজন নিয়মিত রক্তদাতা হিসেবে আমি RoktoDao ব্যবহার করে সহজেই রক্তদানের অনুরোধ খুঁজে পাই। এই প্ল্যাটফর্মটি আসলেই খুব কার্যকরী এবং জীবন বাঁচাতে সাহায্য করছে।"
               <div className="mt-4 font-bold text-foreground">- ফারিয়া আহমেদ, স্বেচ্ছাসেবী রক্তদাতা</div>
             </Card>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16 text-center space-y-6">
        <h2 className="text-3xl font-bold font-headline">জীবন বাঁচানোর সম্প্রদায়ে যোগ দিন</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          আজই একজন দাতা হিসাবে নিবন্ধন করুন এবং কারো গল্পের নায়ক হয়ে উঠুন। এটি সহজ, নিরাপদ এবং গভীরভাবে প্রভাবশালী।
        </p>
        <Button size="lg" asChild className="bg-primary h-14 px-8 text-lg">
          <Link href="/register">রক্তদান করতে নিবন্ধন করুন</Link>
        </Button>
      </section>
    </div>
  );
}
