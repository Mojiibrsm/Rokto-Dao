'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDonors, type Donor } from '@/lib/sheets';
import { getDonorBadge, DONOR_BADGES } from '@/lib/gamification';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Star, Loader2, ArrowLeft, HeartPulse, User } from 'lucide-react';

export default function LeaderboardPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDonors();
        // Sort by total donations descending
        const sorted = [...data].sort((a, b) => (b.totalDonations || 0) - (a.totalDonations || 0));
        setDonors(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <Button variant="ghost" size="icon" asChild className="rounded-xl border">
               <Link href="/"><ArrowLeft className="h-5 w-5" /></Link>
             </Button>
             <h1 className="text-4xl md:text-6xl font-black font-headline">রক্তদাতা <span className="text-primary">লিডারবোর্ড</span></h1>
          </div>
          <p className="text-xl text-muted-foreground font-bold italic">"মানবতার সেবায় যারা সবার আগে"</p>
        </div>
        <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner rotate-3">
          <Trophy className="h-12 w-12" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <p className="font-bold text-muted-foreground">লিডারবোর্ড আপডেট হচ্ছে...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Top 3 Podiums */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {donors.slice(0, 3).map((donor, i) => {
              const badge = getDonorBadge(donor.totalDonations || 0);
              const rankIcons = [<Trophy key="1" className="text-amber-500" />, <Medal key="2" className="text-slate-400" />, <Medal key="3" className="text-orange-400" />];
              const rankColors = ["border-amber-400 bg-amber-50/50", "border-slate-300 bg-slate-50/50", "border-orange-300 bg-orange-50/50"];
              
              return (
                <Card key={donor.phone} className={`relative overflow-hidden border-4 ${rankColors[i]} rounded-[3rem] shadow-xl text-center p-8 transition-transform hover:scale-105`}>
                  <div className="absolute top-4 right-6 text-4xl font-black opacity-10">{i + 1}</div>
                  <div className="mx-auto h-24 w-24 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden relative mb-6">
                    {donor.imageUrl ? <Image src={donor.imageUrl} fill alt="P" className="object-cover" /> : <div className="h-full w-full flex items-center justify-center bg-primary text-white text-3xl font-black">{donor.fullName.substring(0,1)}</div>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                       {rankIcons[i]}
                       <h3 className="text-2xl font-black truncate">{donor.fullName}</h3>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">{donor.district}</p>
                    <div className="pt-4">
                       <Badge className="bg-primary text-white px-6 py-1.5 text-lg font-black rounded-full shadow-lg">
                         {donor.totalDonations} বার রক্তদান
                       </Badge>
                    </div>
                    {badge && (
                      <div className={`mt-4 inline-flex items-center gap-2 ${badge.bgColor} ${badge.color} px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border`}>
                        <span>{badge.icon}</span> {badge.label}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Ranking Table */}
          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white">
                  <tr className="h-16">
                    <th className="px-8 font-black uppercase text-xs tracking-[0.2em]">Rank</th>
                    <th className="px-8 font-black uppercase text-xs tracking-[0.2em]">Donor</th>
                    <th className="px-8 font-black uppercase text-xs tracking-[0.2em]">Donations</th>
                    <th className="px-8 font-black uppercase text-xs tracking-[0.2em]">Achievement</th>
                    <th className="px-8 text-right font-black uppercase text-xs tracking-[0.2em]">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donors.slice(3, 50).map((donor, i) => {
                    const badge = getDonorBadge(donor.totalDonations || 0);
                    return (
                      <tr key={donor.phone} className="hover:bg-slate-50 transition-colors h-20">
                        <td className="px-8">
                          <span className="text-xl font-black text-slate-400">#{i + 4}</span>
                        </td>
                        <td className="px-8">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                              {donor.fullName.substring(0, 1)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-none">{donor.fullName}</p>
                              <p className="text-[10px] font-bold text-muted-foreground mt-1">{donor.district}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8">
                          <span className="text-xl font-black text-primary">{donor.totalDonations}</span>
                        </td>
                        <td className="px-8">
                          {badge ? (
                            <Badge variant="outline" className={`${badge.bgColor} ${badge.color} border-none font-black text-[10px] uppercase px-3`}>
                              {badge.icon} {badge.label}
                            </Badge>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground italic">New Member</span>
                          )}
                        </td>
                        <td className="px-8 text-right">
                          <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary" asChild>
                            <Link href={`/donors/${donor.phone}`}>
                              <ArrowLeft className="h-5 w-5 rotate-180" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Why Leaderboard info */}
      <div className="mt-16 grid md:grid-cols-2 gap-8 items-center bg-slate-900 text-white rounded-[4rem] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black font-headline">রক্তদান করুন, <br /><span className="text-primary">সম্মাননা জিতুন!</span></h2>
          <p className="text-lg text-slate-400 font-bold leading-relaxed">
            আপনার প্রতিটি রক্তদান একজনের জীবন বাঁচায়। আমাদের লিডারবোর্ডে যুক্ত হয়ে অন্যদের অনুপ্রাণিত করুন এবং "Life Saver" ব্যাজ অর্জন করুন।
          </p>
          <Button size="lg" className="rounded-full bg-primary hover:bg-secondary h-14 px-10 text-xl font-black shadow-xl" asChild>
            <Link href="/register">আমিও দাতা হতে চাই</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          {DONOR_BADGES.map((b, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center space-y-2 backdrop-blur">
              <span className="text-4xl">{b.icon}</span>
              <p className="font-black text-sm uppercase tracking-widest">{b.label}</p>
              <p className="text-[10px] text-slate-400">{b.minDonations}+ Donations</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
