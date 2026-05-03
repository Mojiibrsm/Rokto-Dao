'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getDonors, getGlobalStats, type Donor } from '@/lib/sheets';
import { getDonorBadge } from '@/lib/gamification';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, Phone, Search, Loader2, ExternalLink, Map as MapIcon, Grid, Navigation, Lock, LogIn, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DISTRICTS } from '@/lib/bangladesh-data';
import { DISTRICT_COORDS } from '@/lib/coordinates';
import { useToast } from '@/hooks/use-toast';
import { normalizePhone } from '@/lib/utils';

const DonorMap = dynamic(() => import('@/components/donor-map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">লোড হচ্ছে...</div>
});

const CACHE_KEY = 'roktodao_donors_cache';
const CACHE_TIME_KEY = 'roktodao_donors_last_sync';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function DonorsContent() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    bloodType: 'যেকোনো গ্রুপ',
    district: 'যেকোনো জেলা',
    radius: 0 
  });

  useEffect(() => {
    const user = localStorage.getItem('roktodao_user');
    setIsLoggedIn(!!user);
  }, []);

  useEffect(() => {
    const bloodType = searchParams.get('bloodType');
    const district = searchParams.get('district');
    if (bloodType || district) {
      setFilters(prev => ({
        ...prev,
        bloodType: bloodType || 'যেকোনো গ্রুপ',
        district: district || 'যেকোনো জেলা'
      }));
    }
  }, [searchParams]);

  const loadDonorsData = async () => {
    setLoading(true);
    try {
      const stats = await getGlobalStats();
      const serverLastUpdate = stats.lastUpdate || '0';
      const localLastUpdate = localStorage.getItem(CACHE_TIME_KEY);
      const cachedDonors = localStorage.getItem(CACHE_KEY);

      if (cachedDonors && localLastUpdate === serverLastUpdate) {
        const data = JSON.parse(cachedDonors);
        setAllDonors(data);
        applyFilters(data);
      } else {
        const freshData = await getDonors();
        setAllDonors(freshData);
        localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
        localStorage.setItem(CACHE_TIME_KEY, serverLastUpdate);
        applyFilters(freshData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: Donor[]) => {
    let filtered = data;
    if (filters.bloodType !== 'যেকোনো গ্রুপ') filtered = filtered.filter(d => d.bloodType === filters.bloodType);
    if (filters.district !== 'যেকোনো জেলা') filtered = filtered.filter(d => d.district?.toLowerCase() === filters.district?.toLowerCase());
    
    if (filters.radius > 0 && userLocation) {
      filtered = filtered.filter(d => {
        const dLat = d.lat || DISTRICT_COORDS[d.district || '']?.[0];
        const dLng = d.lng || DISTRICT_COORDS[d.district || '']?.[1];
        if (!dLat || !dLng) return false;
        const dist = calculateDistance(userLocation.lat, userLocation.lng, dLat, dLng);
        return dist <= filters.radius;
      });
    }
    setDonors(filtered);
  };

  useEffect(() => { loadDonorsData(); }, []);
  useEffect(() => { if (allDonors.length > 0) applyFilters(allDonors); }, [filters, allDonors, userLocation]);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setDetectingLocation(false);
          toast({ title: "লোকেশন শনাক্ত হয়েছে!" });
          if (filters.radius === 0) setFilters(f => ({ ...f, radius: 10 }));
        },
        () => setDetectingLocation(false)
      );
    }
  };

  const isSearching = filters.bloodType !== 'যেকোনো গ্রুপ' || filters.district !== 'যেকোনো জেলা' || filters.radius > 0;
  const visibleLimit = isSearching ? 5 : 10;
  const visibleDonors = isLoggedIn ? donors : donors.slice(0, visibleLimit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl md:text-5xl font-black font-headline text-foreground">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h1>
          <p className="text-base text-muted-foreground">জরুরি প্রয়োজনে আপনার এলাকার রক্তদাতা খুঁজে নিন।</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" asChild className="rounded-xl border-primary/20 text-primary font-black hover:bg-primary/5">
             <Link href="/leaderboard"><Trophy className="mr-2 h-4 w-4" /> লিডারবোর্ড</Link>
           </Button>
           <div className="flex bg-muted p-1 rounded-xl shrink-0">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-lg font-bold gap-2"><Grid className="h-4 w-4" /> লিস্ট</Button>
            <Button variant={viewMode === 'map' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('map')} className="rounded-lg font-bold gap-2"><MapIcon className="h-4 w-4" /> ম্যাপ</Button>
          </div>
        </div>
      </div>

      <Card className="mb-8 shadow-lg border-t-4 border-t-primary rounded-2xl p-6 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">রক্তের গ্রুপ</label>
            <Select value={filters.bloodType} onValueChange={(val) => setFilters(f => ({ ...f, bloodType: val }))}>
              <SelectTrigger className="h-11"><SelectValue placeholder="যেকোনো গ্রুপ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">জেলা</label>
            <Select value={filters.district} onValueChange={(val) => setFilters(f => ({ ...f, district: val }))}>
              <SelectTrigger className="h-11"><SelectValue placeholder="যেকোনো জেলা" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2 space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center justify-between">
               <label className="text-xs font-black text-primary uppercase tracking-widest">আশেপাশে খুঁজুন (Radius)</label>
               <Button variant="ghost" size="sm" onClick={handleDetectLocation} disabled={detectingLocation} className={`h-8 px-3 rounded-full text-[10px] font-black uppercase ${userLocation ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                 {detectingLocation ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Navigation className="h-3 w-3 mr-1" />}
                 {userLocation ? 'Detected' : 'Detect My Location'}
               </Button>
            </div>
            <div className="flex items-center gap-6">
              <Slider value={[filters.radius]} onValueChange={(val) => setFilters(f => ({ ...f, radius: val[0] }))} max={50} step={5} disabled={!userLocation} className="flex-1" />
              <div className="w-16 text-center font-black text-primary">{filters.radius === 0 ? 'Off' : `${filters.radius} KM`}</div>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : viewMode === 'map' ? (
        <div className="animate-in fade-in duration-500"><DonorMap donors={donors} /></div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-500">
          {visibleDonors.map((donor, idx) => {
            const badge = getDonorBadge(donor.totalDonations || 0);

            return (
              <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all rounded-2xl group border-t-4 border-primary/20 flex flex-col bg-white">
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex justify-between items-start">
                    <Link href={`/donors/${donor.slug || donor.phone}`} className="flex items-center gap-3 group/link">
                      <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl overflow-hidden relative shrink-0 shadow-md">
                        {donor.imageUrl ? <Image src={donor.imageUrl} fill alt={donor.fullName} className="object-cover" /> : (donor.fullName || 'D').substring(0, 1)}
                      </div>
                      <div className="space-y-0.5">
                        <CardTitle className="text-lg group-hover/link:text-primary transition-colors line-clamp-1">{donor.fullName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-[11px] font-bold">
                          <MapPin className="h-3 w-3 text-primary" /> {donor.district}
                        </CardDescription>
                      </div>
                    </Link>
                    <Badge className="bg-primary text-white text-lg font-black h-10 w-10 flex items-center justify-center p-0 rounded-xl shadow-md border-2 border-white">{donor.bloodType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 flex-grow px-6">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-muted/30 rounded-xl border text-center">
                      <p className="text-muted-foreground uppercase text-[9px] font-black mb-1">মোট রক্তদান</p>
                      <p className="font-black text-foreground">{donor.totalDonations || 0} বার</p>
                    </div>
                    <div className="p-2.5 bg-muted/30 rounded-xl border flex items-center justify-center">
                       {badge && <Badge className={`${badge.bgColor} ${badge.color} border-none font-black text-[8px] uppercase tracking-tighter h-5 px-2`}>{badge.icon} {badge.label}</Badge>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t flex">
                  <Button className="flex-1 h-14 rounded-none bg-primary hover:bg-primary/90 text-lg font-bold gap-3" asChild><a href={`tel:${donor.phone}`}><Phone className="h-5 w-5" /> কল করুন</a></Button>
                  <Button variant="ghost" className="flex-1 h-14 rounded-none text-primary font-bold gap-2" asChild><Link href={`/donors/${donor.slug || donor.phone}`}>প্রোফাইল <ExternalLink className="h-4 w-4" /></Link></Button>
                </CardFooter>
              </Card>
            );
          })}

          {!isLoggedIn && donors.length > visibleLimit && (
            <Card className="overflow-hidden border-2 border-dashed border-primary/30 rounded-[2rem] bg-accent/20 flex flex-col items-center justify-center p-10 text-center space-y-6 relative min-h-[300px]">
               <div className="relative z-10 space-y-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-2 border-primary/20"><Lock className="h-10 w-10 text-primary" /></div>
                  <h3 className="text-2xl font-black font-headline">আরও {donors.length - visibleLimit} জন দাতা আছেন!</h3>
                  <div className="flex flex-col gap-3 pt-2">
                    <Button asChild className="rounded-full h-12 px-10 bg-primary font-black shadow-xl shadow-primary/20"><Link href="/login"><LogIn className="mr-2 h-5 w-5" /> লগইন করুন</Link></Button>
                    <Link href="/register" className="text-sm font-black text-primary hover:underline">এখনও একাউন্ট নেই? নিবন্ধন করুন</Link>
                  </div>
               </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function DonorsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <DonorsContent />
    </Suspense>
  );
}
