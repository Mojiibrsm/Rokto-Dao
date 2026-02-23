'use client';

import { useState, useEffect } from 'react';
import { getBloodRequests, type BloodRequest } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplet, MapPin, Calendar, Phone, Share2, Loader2, PlusCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      const data = await getBloodRequests();
      setRequests(data);
      setLoading(false);
    }
    loadRequests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-headline">রক্তের অনুরোধসমূহ</h1>
          <p className="text-muted-foreground text-lg mt-2">এখন যাদের জরুরি ভিত্তিতে রক্ত প্রয়োজন।</p>
        </div>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/20">
          <Link href="/requests/new">
            <PlusCircle className="mr-2 h-6 w-6" /> নতুন অনুরোধ করুন
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="border-dashed py-24 text-center bg-muted/20">
          <CardContent className="space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="text-2xl font-bold text-muted-foreground">কোনো বর্তমান অনুরোধ পাওয়া যায়নি।</p>
            <p className="text-muted-foreground">আপনি চাইলে একটি নতুন অনুরোধ পোস্ট করতে পারেন।</p>
            <Button variant="outline" asChild className="mt-4 border-primary text-primary">
              <Link href="/requests/new">অনুরোধ করুন</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {requests.map(req => (
            <Card key={req.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[2rem] group">
              <CardHeader className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white p-8`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{req.patientName}</CardTitle>
                  <Badge className="bg-white text-primary border-none font-black px-4 py-1">
                    {req.isUrgent ? 'জরুরি' : 'Approved'}
                  </Badge>
                </div>
                <CardDescription className="text-white/90 mt-3 flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" /> {req.hospitalName}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                    <p className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-widest">রক্তের গ্রুপ</p>
                    <p className="text-4xl font-black text-primary">{req.bloodType}</p>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-2xl text-center border border-primary/10">
                    <p className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-widest">ব্যাগ সংখ্যা</p>
                    <p className="text-4xl font-black text-primary">{req.bagsNeeded}</p>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                   <div className="flex items-center gap-3 text-muted-foreground text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-bold">কখন প্রয়োজন:</span> {req.neededWhen}
                   </div>
                   <div className="flex items-center gap-3 text-muted-foreground text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-bold">স্থান:</span> {req.area}, {req.district}
                   </div>
                </div>
              </CardContent>
              <CardFooter className="p-0 border-t flex bg-muted/20">
                <Button className="flex-1 h-16 rounded-none bg-primary hover:bg-primary/90 text-xl font-bold gap-3" asChild>
                  <a href={`tel:${req.phone}`}>
                    <Phone className="h-6 w-6" /> যোগাযোগ
                  </a>
                </Button>
                <Button variant="ghost" className="flex-1 h-16 rounded-none text-xl font-bold gap-3 hover:bg-primary/5">
                  <Share2 className="h-6 w-6" /> শেয়ার
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
