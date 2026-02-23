'use client';

import { useState, useEffect } from 'react';
import { getDonors, type Donor } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplet, MapPin, Phone, Search, Loader2, User, Heart, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DISTRICTS, BANGLADESH_DATA, getUnions } from '@/lib/bangladesh-data';

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodType: 'যেকোনো গ্রুপ',
    district: 'যেকোনো জেলা',
    area: 'যেকোনো উপজেলা',
    union: 'যেকোনো ইউনিয়ন'
  });

  const upazilas = filters.district !== 'যেকোনো জেলা' ? BANGLADESH_DATA[filters.district]?.upazilas || [] : [];
  const unions = filters.area !== 'যেকোনো উপজেলা' ? getUnions(filters.area) : [];

  const loadDonorsData = async () => {
    setLoading(true);
    try {
      const data = await getDonors({
        bloodType: filters.bloodType === 'যেকোনো গ্রুপ' ? undefined : filters.bloodType,
        district: filters.district === 'যেকোনো জেলা' ? undefined : filters.district,
        area: filters.area === 'যেকোনো উপজেলা' ? undefined : filters.area,
        union: filters.union === 'যেকোনো ইউনিয়ন' ? undefined : filters.union
      } as any);
      setDonors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonorsData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDonorsData();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold font-headline text-primary">রক্তদাতা অনুসন্ধান করুন</h1>
        <p className="text-muted-foreground text-lg">আপনার এলাকায় জরুরি প্রয়োজনে রক্তদাতা খুঁজে নিন।</p>
      </div>

      <Card className="mb-12 shadow-xl border-t-4 border-t-primary rounded-[2.5rem] p-8 bg-white/80 backdrop-blur">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
              <Droplet className="h-3 w-3 text-primary" /> রক্তের গ্রুপ
            </label>
            <Select value={filters.bloodType} onValueChange={(val) => setFilters(f => ({ ...f, bloodType: val }))}>
              <SelectTrigger className="h-12 border-2">
                <SelectValue placeholder="যেকোনো গ্রুপ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো গ্রুপ">যেকোনো গ্রুপ</SelectItem>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
              <MapPin className="h-3 w-3 text-primary" /> জেলা
            </label>
            <Select value={filters.district} onValueChange={(val) => setFilters(f => ({ ...f, district: val, area: 'যেকোনো উপজেলা', union: 'যেকোনো ইউনিয়ন' }))}>
              <SelectTrigger className="h-12 border-2">
                <SelectValue placeholder="যেকোনো জেলা" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো জেলা">যেকোনো জেলা</SelectItem>
                {DISTRICTS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
               উপজেলা
            </label>
            <Select value={filters.area} onValueChange={(val) => setFilters(f => ({ ...f, area: val, union: 'যেকোনো ইউনিয়ন' }))} disabled={filters.district === 'যেকোনো জেলা'}>
              <SelectTrigger className="h-12 border-2">
                <SelectValue placeholder="উপজেলা" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো উপজেলা">যেকোনো উপজেলা</SelectItem>
                {upazilas.map(u => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
               ইউনিয়ন
            </label>
            <Select value={filters.union} onValueChange={(val) => setFilters(f => ({ ...f, union: val }))} disabled={filters.area === 'যেকোনো উপজেলা'}>
              <SelectTrigger className="h-12 border-2">
                <SelectValue placeholder="ইউনিয়ন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="যেকোনো ইউনিয়ন">যেকোনো ইউনিয়ন</SelectItem>
                {unions.map(u => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="h-12 bg-primary hover:bg-primary/90 text-lg font-bold gap-2 rounded-xl w-full">
            <Search className="h-5 w-5" /> অনুসন্ধান
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : donors.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-muted/20 rounded-[3rem] border-2 border-dashed">
          <User className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
          <p className="text-2xl font-bold text-muted-foreground">কোনো রক্তদাতা পাওয়া যায়নি।</p>
          <p className="text-muted-foreground">ভিন্ন কোনো গ্রুপ বা এলাকা দিয়ে চেষ্টা করুন।</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor, idx) => (
            <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all rounded-[2.5rem] group border-t-4 border-t-primary/20">
              <CardHeader className="bg-primary/5 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20">
                      {donor.fullName.substring(0, 1)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{donor.fullName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-0.5 text-xs">
                        <MapPin className="h-3 w-3" /> {donor.union}, {donor.area}, {donor.district}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white text-xl font-black h-12 w-12 flex items-center justify-center p-0 rounded-xl shadow-md">
                    {donor.bloodType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-muted/30 rounded-2xl border">
                    <p className="text-muted-foreground uppercase text-[10px] font-black mb-1">শেষ রক্তদান</p>
                    <p className="font-bold text-foreground">{donor.lastDonationDate || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl border">
                    <p className="text-muted-foreground uppercase text-[10px] font-black mb-1">মোট রক্তদান</p>
                    <p className="font-bold text-foreground">{donor.totalDonations || 0} বার</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-2 rounded-lg border border-green-100">
                  <ShieldCheck className="h-4 w-4" /> ভেরিফাইড রক্তদাতা
                </div>
              </CardContent>
              <CardFooter className="p-0 border-t">
                <Button className="w-full h-16 rounded-none bg-primary hover:bg-primary/90 text-xl font-bold gap-3" asChild>
                  <a href={`tel:${donor.phone}`}>
                    <Phone className="h-6 w-6" /> যোগাযোগ করুন
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
