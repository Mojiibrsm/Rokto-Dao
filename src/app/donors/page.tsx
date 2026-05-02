'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getDonors, getGlobalStats, type Donor } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Droplet, MapPin, Phone, Search, Loader2, ShieldCheck, ExternalLink, Map as MapIcon, Grid, Navigation, LocateFixed, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DISTRICTS, BANGLADESH_DATA } from '@/lib/bangladesh-data';
import { DISTRICT_COORDS } from '@/lib/coordinates';
import { useToast } from '@/hooks/use-toast';
import { normalizePhone } from '@/lib/utils';

const DonorMap = dynamic(() => import('@/components/donor-map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center">লোড হচ্ছে...</div>
});

const CACHE_KEY = 'roktodao_donors_cache';
const CACHE_TIME_KEY = 'roktodao_donors_last_sync';

// WhatsApp Icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.506-.173-.005-.371-.007-.57-.007-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.216 1.36.186 1.871.11.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Haversine distance formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
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
  const [upazilas, setUpazilas] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    bloodType: 'যেকোনো গ্রুপ',
    district: 'যেকোনো জেলা',
    area: 'যেকোনো উপজেলা',
    radius: 0 // 0 means no radius filter
  });

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

  useEffect(() => {
    if (filters.district !== 'যেকোনো জেলা' && BANGLADESH_DATA[filters.district]) {
      setUpazilas(Object.keys(BANGLADESH_DATA[filters.district]));
    } else {
      setUpazilas([]);
    }
  }, [filters.district]);

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
    if (filters.area !== 'যেকোনো উপজেলা') filtered = filtered.filter(d => d.area?.toLowerCase() === filters.area?.toLowerCase());
    
    // Radius Filter
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

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setDetectingLocation(false);
          toast({ title: "লোকেশন শনাক্ত হয়েছে!", description: "এখন আপনার আশেপাশে রক্তদাতা খুঁজতে পারবেন।" });
          if (filters.radius === 0) setFilters(f => ({ ...f, radius: 10 })); // Default 10km radius
        },
        (error) => {
          setDetectingLocation(false);
          toast({ variant: "destructive", title: "ব্যর্থ হয়েছে", description: "অনুগ্রহ করে লোকেশন পারমিশন দিন।" });
        }
      );
    } else {
      setDetectingLocation(false);
      toast({ variant: "destructive", title: "সাপোর্ট নেই", description: "আপনার ব্রাউজারে লোকেশন সার্ভিস কাজ করছে না।" });
    }
  };

  useEffect(() => { loadDonorsData(); }, []);
  useEffect(() => { if (allDonors.length > 0) applyFilters(allDonors); }, [filters, allDonors, userLocation]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl md:text-5xl font-black font-headline text-foreground">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h1>
          <p className="text-base text-muted-foreground">জরুরি প্রয়োজনে আপনার এলাকার রক্তদাতা খুঁজে নিন।</p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl shrink-0">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('grid')}
            className="rounded-lg font-bold gap-2"
          >
            <Grid className="h-4 w-4" /> লিস্ট
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('map')}
            className="rounded-lg font-bold gap-2"
          >
            <MapIcon className="h-4 w-4" /> ম্যাপ
          </Button>
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
            <Select value={filters.district} onValueChange={(val) => setFilters(f => ({ ...f, district: val, area: 'যেকোনো উপজেলা' }))}>
              <SelectTrigger className="h-11"><SelectValue placeholder="যেকোনো জেলা" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          {/* Near Me / Radius UI */}
          <div className="md:col-span-2 space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center justify-between">
               <label className="text-xs font-black text-primary uppercase tracking-widest">আশেপাশে খুঁজুন (Radius)</label>
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDetectLocation} 
                disabled={detectingLocation}
                className={`h-8 px-3 rounded-full text-[10px] font-black uppercase ${userLocation ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}
               >
                 {detectingLocation ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Navigation className="h-3 w-3 mr-1" />}
                 {userLocation ? 'Detected' : 'Detect My Location'}
               </Button>
            </div>
            
            <div className="flex items-center gap-6">
              <Slider 
                value={[filters.radius]} 
                onValueChange={(val) => setFilters(f => ({ ...f, radius: val[0] }))}
                max={50}
                step={5}
                disabled={!userLocation}
                className="flex-1"
              />
              <div className="w-16 text-center font-black text-primary">
                {filters.radius === 0 ? 'Off' : `${filters.radius} KM`}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-t pt-6">
           <p className="text-sm font-bold text-muted-foreground italic">
             {donors.length} জন রক্তদাতা পাওয়া গেছে।
           </p>
           <Button onClick={loadDonorsData} className="h-12 bg-primary hover:bg-primary/90 text-lg font-bold gap-3 rounded-xl px-10">
             <Search className="h-5 w-5" /> অনুসন্ধান রিফ্রেশ
           </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : viewMode === 'map' ? (
        <div className="animate-in fade-in duration-500">
           <DonorMap donors={donors} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-500">
          {donors.map((donor, idx) => {
            const cleanPhone = normalizePhone(donor.phone);
            const waLink = `https://wa.me/880${cleanPhone}?text=আসসালামু আলাইকুম, আমি RoktoDao থেকে আপনার সাথে রক্তদানের বিষয়ে যোগাযোগ করছি।`;
            const smsLink = `sms:+880${cleanPhone}?body=আসসালামু আলাইকুম, আমি RoktoDao থেকে আপনার সাথে রক্তদানের বিষয়ে যোগাযোগ করছি।`;

            return (
              <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all rounded-2xl group border-t-4 border-primary/20 flex flex-col bg-white">
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex justify-between items-start">
                    <Link href={`/donors/${donor.phone}`} className="flex items-center gap-3 group/link">
                      <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl overflow-hidden relative shrink-0 shadow-md">
                        {donor.imageUrl ? <Image src={donor.imageUrl} fill alt={donor.fullName} className="object-cover" /> : (donor.fullName || 'D').substring(0, 1)}
                      </div>
                      <div className="space-y-0.5">
                        <CardTitle className="text-lg group-hover/link:text-primary transition-colors line-clamp-1">{donor.fullName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-[11px] font-bold">
                          <MapPin className="h-3 w-3 text-primary" /> {donor.area || 'N/A'}, {donor.district}
                        </CardDescription>
                        {userLocation && (donor.lat || DISTRICT_COORDS[donor.district || '']) && (
                          <p className="text-[10px] font-black text-primary flex items-center gap-1">
                            <LocateFixed className="h-2.5 w-2.5" /> 
                            {Math.round(calculateDistance(
                              userLocation.lat, userLocation.lng, 
                              donor.lat || DISTRICT_COORDS[donor.district || '']?.[0], 
                              donor.lng || DISTRICT_COORDS[donor.district || '']?.[1]
                            ))} KM দূরে
                          </p>
                        )}
                      </div>
                    </Link>
                    <Badge className="bg-primary text-white text-lg font-black h-10 w-10 flex items-center justify-center p-0 rounded-xl shadow-md border-2 border-white">{donor.bloodType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 flex-grow px-6">
                  {donor.totalDonations && donor.totalDonations > 0 ? (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-muted/30 rounded-xl border text-center">
                        <p className="text-muted-foreground uppercase text-[9px] font-black mb-1">শেষ রক্তদান</p>
                        <p className="font-bold text-foreground truncate">{donor.lastDonationDate || 'N/A'}</p>
                      </div>
                      <div className="p-2.5 bg-muted/30 rounded-xl border text-center">
                        <p className="text-muted-foreground uppercase text-[9px] font-black mb-1">মোট রক্তদান</p>
                        <p className="font-black text-foreground">{donor.totalDonations} বার</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 p-3 rounded-xl border border-green-100">
                      <ShieldCheck className="h-4 w-4" /> ভেরিফাইড রক্তদাতা
                    </div>
                  )}
                  
                  {/* Quick Contact Icons */}
                  <div className="flex justify-center gap-4 pt-2">
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-green-50 border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm" asChild>
                      <a href={waLink} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" asChild>
                      <a href={smsLink}>
                        <MessageSquare className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t flex">
                  <Button className="flex-1 h-14 rounded-none bg-primary hover:bg-primary/90 text-lg font-bold gap-3" asChild>
                    <a href={`tel:${donor.phone}`}><Phone className="h-5 w-5" /> কল করুন</a>
                  </Button>
                  <Button variant="ghost" className="flex-1 h-14 rounded-none text-primary font-bold gap-2" asChild>
                    <Link href={`/donors/${donor.phone}`}>প্রোফাইল <ExternalLink className="h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
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
