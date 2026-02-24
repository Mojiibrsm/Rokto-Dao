'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Facebook, Twitter, Youtube, Loader2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const contactHeroImage = PlaceHolderImages.find(img => img.id === 'contact-us-hero')?.imageUrl || 'https://picsum.photos/seed/contact/1200/800';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "বার্তা পাঠানো হয়েছে!",
        description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-0 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-white pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[350px] md:min-h-[450px]">
            <Image 
              src={contactHeroImage} 
              fill 
              alt="Contact RoktoDao" 
              className="object-cover"
              priority
              data-ai-hint="contact person"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 md:px-20 text-white space-y-4">
              <Badge className="w-fit bg-primary hover:bg-primary border-none px-4 py-1">সরাসরি যোগাযোগ</Badge>
              <h1 className="text-4xl md:text-6xl font-black font-headline">আমাদের সাথে <br /><span className="text-primary">কথা বলুন</span></h1>
              <p className="text-lg md:text-xl max-w-md opacity-90 leading-relaxed">
                আপনার কোনো জিজ্ঞাসা, পরামর্শ বা অভিযোগ থাকলে আমাদের জানান। জীবন বাঁচাতে আমরা আপনার পাশেই আছি।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Info & Form */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Info Side */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold font-headline">যোগাযোগের তথ্য</h2>
              <p className="text-muted-foreground">জরুরি প্রয়োজনে সরাসরি আমাদের হেল্পলাইনে কল করতে পারেন।</p>
            </div>

            <div className="grid gap-4">
              {[
                { icon: Phone, title: "ফোন করুন", val: "+8801600151907", desc: "সকাল ৯টা - রাত ৮টা", color: "text-primary bg-primary/10" },
                { icon: Mail, title: "ইমেইল করুন", val: "mojibrsm@gmail.com", desc: "যেকোনো অফিসিয়াল কাজে", color: "text-blue-600 bg-blue-50" },
                { icon: MapPin, title: "অফিসের ঠিকানা", val: "House: 25, Road: 10, Sector: 11, Uttara, Dhaka-1230", desc: "বাংলাদেশ", color: "text-green-600 bg-green-50" }
              ].map((info, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-3xl bg-white border shadow-sm hover:shadow-md transition-all group">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${info.color}`}>
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{info.title}</h4>
                    <p className="text-lg font-bold truncate">{info.val}</p>
                    <p className="text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
              <h4 className="text-xl font-bold">সামাজিক যোগাযোগ</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/20 bg-white/5 hover:bg-primary hover:border-primary text-white transition-all" asChild>
                  <a href="https://www.facebook.com/Roktooo" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/20 bg-white/5 hover:bg-primary hover:border-primary text-white transition-all">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/20 bg-white/5 hover:bg-primary hover:border-primary text-white transition-all">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-slate-400">নতুন আপডেট পেতে আমাদের সোশ্যাল মিডিয়ায় ফলো করুন।</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            {!submitted ? (
              <Card className="rounded-[2.5rem] p-6 md:p-10 shadow-xl border-none bg-white">
                <CardHeader className="px-0 pt-0 space-y-2 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-3xl font-bold">আমাদের মেসেজ পাঠান</CardTitle>
                  <CardDescription className="text-lg">নিচের ফর্মটি পূরণ করুন, আমরা খুব দ্রুত আপনার সাথে যোগাযোগ করব।</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm">আপনার নাম</Label>
                        <Input id="name" placeholder="পুরো নাম লিখুন" className="h-11 rounded-xl bg-muted/30 border-none" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm">ইমেইল ঠিকানা</Label>
                        <Input id="email" type="email" placeholder="example@mail.com" className="h-11 rounded-xl bg-muted/30 border-none" required suppressHydrationWarning />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-sm">বিষয়</Label>
                      <Input id="subject" placeholder="কি বিষয়ে কথা বলতে চান?" className="h-11 rounded-xl bg-muted/30 border-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-sm">আপনার বার্তা</Label>
                      <Textarea 
                        id="message" 
                        placeholder="এখানে বিস্তারিত লিখুন..." 
                        className="min-h-[120px] rounded-2xl bg-muted/30 border-none resize-none" 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          বার্তা পাঠানো হচ্ছে...
                        </>
                      ) : (
                        <>
                          মেসেজ পাঠান <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-green-100">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-3 font-headline">ধন্যবাদ!</h2>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
                  আপনার বার্তাটি সফলভাবে আমাদের কাছে পৌঁছেছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                </p>
                <Button variant="outline" className="h-11 px-8 rounded-full border-primary text-primary" onClick={() => setSubmitted(false)}>
                  আরেকটি বার্তা পাঠান
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Map/Location Placeholder */}
      <section className="container mx-auto px-4 pb-16">
        <div className="w-full h-[350px] bg-muted rounded-[3rem] overflow-hidden relative border-4 border-white shadow-2xl">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/5 backdrop-blur-[2px]">
            <MapPin className="h-12 w-12 text-primary mb-3 opacity-50" />
            <p className="text-xl font-bold text-slate-600">আমাদের অফিসের অবস্থান</p>
            <p className="text-muted-foreground">House: 25, Road: 10, Sector: 11, Uttara, Dhaka-1230</p>
          </div>
        </div>
      </section>
    </div>
  );
}
