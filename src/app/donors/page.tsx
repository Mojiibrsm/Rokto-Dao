'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDonors, getGlobalStats, type Donor } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplet, MapPin, Phone, Search, Loader2, User, ShieldCheck, Heart, Users, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DISTRICTS, BANGLADESH_DATA } from '@/lib/bangladesh-data';
import { useToast } from '@/hooks/use-toast';

const CACHE_KEY = 'roktodao_donors_cache';
const CACHE_TIME_KEY = 'roktodao_donors_last_sync';

function DonorsContent() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [upazilas, setUpazilas] = useState<string[]>([]);
  const [unions, setUnions] = useState<string[]>([]);
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    bloodType: 'যেকোনো গ্রুপ',
    district: 'যেকোনো জেলা',
    area: 'যেকোনো উপজেলা',
    union: 'যেকোনো ইউনিয়ন'
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

  useEffect(() => {
    if (filters.district !== 'যেকোনো জেলা' && filters.area !== 'যেকোনো উপজেলা' && BANGLADESH_DATA[filters.district]?.[filters.area]) {
      setUnions(BANGLADESH_DATA[filters.district][filters.area]);
    } else {
      setUnions([]);
    }
  }, [filters.area, filters.district]);

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
    if (filters.union !== 'যেকোনো ইউনিয়ন') filtered = filtered.filter(d => d.union?.toLowerCase() === filters.union?.toLowerCase());
    setDonors(filtered);
  };

  useEffect(() => { loadDonorsData(); }, []);
  useEffect(() => { if (allDonors.length > 0) applyFilters(allDonors); }, [filters, allDonors]);

  const toggleSelection = (phone: string) => {
    const newSet = new Set(selectedPhones);
    if (newSet.has(phone)) newSet.delete(phone);
    else newSet.add(phone);
    setSelectedPhones(newSet);
  };

  const handleBulkCopy = () => {
    if (selectedPhones.size === 0) return;
    
    const selectedData = allDonors.filter(d => selectedPhones.has(d.phone));
    const text = selectedData.map(d => `${d.fullName} - ${d.bloodType} - ${d.phone} - ${d.district}`).join('\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "কপি হয়েছে!",
      description: `${selectedPhones.size} জন দাতার তথ্য ক্লিপবোর্ডে কপি করা হয়েছে।`,
    });
    setSelectedPhones(new Set());
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl md:text-5xl font-black font-headline text-foreground">আমাদের <span className="text-primary">রক্তযোদ্ধারা</span></h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">আপনার এলাকায় জরুরি প্রয়োজনে রক্তদাতা খুঁজে নিন।</p>
      </div>

      <Card className="mb-8 shadow-xl border-t-4 border-t-primary rounded-[2rem] p-6 bg-white/80 backdrop-blur">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">রক্তের গ্রুপ</label>
            <Select value={filters.bloodType} onValueChange={(val) => setFilters(f => ({ ...f, bloodType: val }))}>
              <SelectTrigger className="h-11 border-2"><SelectValue placeholder="যেকোনো গ্রুপ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">জেলা</label>
            <Select value={filters.district} onValueChange={(val) => setFilters(f => ({ ...f, district: val, area: 'যেকোনো উপজেলা', union: 'যেকোনো ইউনিয়ন' }))}>
              <SelectTrigger className="h-11 border-2"><SelectValue placeholder="যেকোনো জেলা" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">উপজেলা</label>
            <Select value={filters.area} onValueChange={(val) => setFilters(f => ({ ...f, area: val, union: 'যেকোনো ইউনিয়ন' }))} disabled={filters.district === 'যেকোনো জেলা'}>
              <SelectTrigger className="h-11 border-2"><SelectValue placeholder="উপজেলা" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো উপজেলা">যেকোনো উপজেলা</SelectItem>
                {upazilas.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={loadDonorsData} className="h-11 bg-primary hover:bg-primary/90 text-lg font-bold gap-2 rounded-xl w-full">
            <Search className="h-4 w-4" /> অনুসন্ধান
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor, idx) => {
            const isSelected = selectedPhones.has(donor.phone);
            return (
              <Card 
                key={idx} 
                onClick={() => toggleSelection(donor.phone)}
                className={`overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-[2rem] group border-t-4 cursor-pointer relative ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-primary/20'}`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 z-10">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl">{(donor.fullName || 'D').substring(0, 1)}</div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{donor.fullName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-[10px]"><MapPin className="h-3 w-3 text-primary" /> {donor.area}, {donor.district}</CardDescription>
                        {donor.organization && <Badge variant="outline" className="text-[10px] text-secondary border-secondary/20">{donor.organization}</Badge>}
                      </div>
                    </div>
                    <Badge className="bg-primary text-white text-lg font-black h-10 w-10 flex items-center justify-center p-0 rounded-xl shadow-md">{donor.bloodType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {donor.totalDonations && donor.totalDonations > 0 ? (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-muted/30 rounded-2xl border">
                        <p className="text-muted-foreground uppercase text-[8px] font-black mb-1">শেষ রক্তদান</p>
                        <p className="font-bold text-foreground">{donor.lastDonationDate || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-2xl border">
                        <p className="text-muted-foreground uppercase text-[8px] font-black mb-1">মোট রক্তদান</p>
                        <p className="font-bold text-foreground">{donor.totalDonations} বার</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 p-3 rounded-xl border border-green-100">
                      <ShieldCheck className="h-4 w-4" /> ভেরিফাইড রক্তদাতা
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-0 border-t">
                  <Button className="w-full h-14 rounded-none bg-primary hover:bg-primary/90 text-lg font-bold gap-3" asChild>
                    <a href={`tel:${donor.phone}`} onClick={(e) => e.stopPropagation()}><Phone className="h-5 w-5" /> যোগাযোগ করুন</a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Secret Copy Button (Tiny Dot) */}
      {selectedPhones.size > 0 && (
        <button 
          onClick={handleBulkCopy}
          className="fixed bottom-4 right-4 w-2 h-2 bg-primary/20 rounded-full hover:bg-primary transition-all z-50 focus:outline-none"
          title="Copy Data"
        />
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
