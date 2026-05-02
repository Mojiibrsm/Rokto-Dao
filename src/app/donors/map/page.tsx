'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getDonors, type Donor } from '@/lib/sheets';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map as MapIcon, Users, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Dynamically import Map component to avoid SSR errors with Leaflet
const DonorMap = dynamic(() => import('@/components/donor-map'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-[2.5rem] flex items-center justify-center flex-col gap-4">
    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
    <p className="font-bold text-muted-foreground italic">মানচিত্র লোড হচ্ছে...</p>
  </div>
});

export default function DonorMapPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDonors();
        setDonors(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" asChild className="rounded-xl border">
               <Link href="/donors"><ArrowLeft className="h-5 w-5" /></Link>
             </Button>
             <h1 className="text-3xl md:text-5xl font-black font-headline">রক্তদাতা <span className="text-primary">মানচিত্র</span></h1>
          </div>
          <p className="text-muted-foreground font-bold">আপনার এলাকার রক্তযোদ্ধাদের অবস্থান সরাসরি ম্যাপে দেখুন।</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white p-4 rounded-2xl border-2 border-primary/10 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">মোট দাতা</p>
                <p className="text-xl font-black text-primary">{donors.length} জন</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid gap-8">
        <DonorMap donors={donors} />
        
        <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10 flex flex-col md:flex-row items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
            <Info className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold">কিভাবে ব্যবহার করবেন?</h4>
            <p className="text-muted-foreground leading-relaxed">
              মানচিত্রের নীল মার্কারগুলোতে ক্লিক করলে ওই এলাকার রক্তদাতার নাম ও রক্তের গ্রুপ দেখা যাবে। সরাসরি কল করতে বা প্রোফাইল দেখতে পপআপের বাটন ব্যবহার করুন। জেলা অনুযায়ী রক্তদাতাদের অবস্থান নির্দিষ্ট করা হয়েছে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
