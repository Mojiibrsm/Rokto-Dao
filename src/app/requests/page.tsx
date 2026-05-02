'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBloodRequests, sendMessage, type BloodRequest } from '@/lib/sheets';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplet, MapPin, Calendar, Phone, Share2, Loader2, PlusCircle, Clock, AlertCircle, MessageSquare, Activity } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { normalizePhone } from '@/lib/utils';

// WhatsApp Icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.506-.173-.005-.371-.007-.57-.007-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.216 1.36.186 1.871.11.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMessaging, setIsMessaging] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      const data = await getBloodRequests();
      setRequests(data);
      setLoading(false);
    }
    loadRequests();
  }, []);

  const handleStartChat = async (req: BloodRequest) => {
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser) {
      toast({ title: "লগইন প্রয়োজন", description: "মেসেজ দিতে হলে আগে লগইন করুন।" });
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    if (user.phone === req.phone) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "আপনি নিজেকে মেসেজ দিতে পারবেন না।" });
      return;
    }

    setIsMessaging(req.id);
    try {
      const res = await sendMessage(user.phone, req.phone, `আসসালামু আলাইকুম, আমি আপনার "${req.bloodType}" রক্তের অনুরোধের প্রেক্ষিতে যোগাযোগ করছি।`);
      if (res.success) {
        router.push(`/messages/${res.convoId}`);
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    } finally {
      setIsMessaging(null);
    }
  };

  const handleShare = async (req: BloodRequest) => {
    const shareText = `🚨 জরুরী রক্তের অনুরোধ (Blood Request) 🚨\n\n🩸 রক্তের গ্রুপ: *${req.bloodType}*\n👤 রোগী: ${req.patientName || 'নাম প্রকাশে অনিচ্ছুক'}\n🏥 হাসপাতাল: ${req.hospitalName}\n📍 স্থান: ${req.area ? req.area + ', ' : ''}${req.district}\n🎒 রক্তের পরিমাণ: ${req.bagsNeeded} ব্যাগ\n⏰ কখন প্রয়োজন: ${req.neededWhen}\n📞 যোগাযোগ করুন: ${req.phone}\n\n🙏 রক্ত দিয়ে জীবন বাঁচাতে এগিয়ে আসুন। শেয়ার করে অন্যদের জানাবেন।\n🔗 RoktoDao - মানবতার সেবায় আপনার পাশে।`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
      toast({ title: "কপি হয়েছে!", description: "রক্তের অনুরোধটি শেয়ার করার জন্য কপি করা হয়েছে।" });
    } catch (err) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">রক্তের অনুরোধসমূহ</h1>
          <p className="text-muted-foreground text-base mt-1">এখন যাদের জরুরি ভিত্তিতে রক্ত প্রয়োজন।</p>
        </div>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 rounded-full px-6 h-12 text-base font-bold shadow-xl shadow-primary/20">
          <Link href="/requests/new">
            <PlusCircle className="mr-2 h-5 w-5" /> নতুন অনুরোধ করুন
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="border-dashed py-16 text-center bg-muted/20">
          <CardContent className="space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-xl font-bold text-muted-foreground">কোনো বর্তমান অনুরোধ পাওয়া যায়নি।</p>
            <Button variant="outline" asChild className="mt-4 border-primary text-primary">
              <Link href="/requests/new">অনুরোধ করুন</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map(req => {
            const cleanPhone = normalizePhone(req.phone);
            const waLink = `https://wa.me/880${cleanPhone}?text=আসসালামু আলাইকুম, আমি RoktoDao থেকে আপনার "${req.bloodType}" রক্তের অনুরোধের প্রেক্ষিতে যোগাযোগ করছি।`;
            const smsLink = `sms:+880${cleanPhone}?body=আসসালামু আলাইকুম, আমি RoktoDao থেকে আপনার "${req.bloodType}" রক্তের অনুরোধের প্রেক্ষিতে যোগাযোগ করছি।`;

            return (
              <Card key={req.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all rounded-[1.5rem] group">
                <CardHeader className={`${req.isUrgent ? 'bg-primary' : 'bg-slate-800'} text-white p-6`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold">{req.patientName || 'নাম প্রকাশে অনিচ্ছুক'}</CardTitle>
                    <Badge className="bg-white text-primary border-none font-black px-3 py-0.5 text-[10px]">
                      {req.isUrgent ? 'জরুরি' : 'Approved'}
                    </Badge>
                  </div>
                  <CardDescription className="text-white/90 mt-2 flex items-center gap-2 text-base font-medium">
                    <MapPin className="h-4 w-4" /> {req.hospitalName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 p-4 rounded-xl text-center border border-primary/10">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest">রক্তের গ্রুপ</p>
                      <p className="text-3xl font-black text-primary">{req.bloodType}</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-xl text-center border border-primary/10">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-widest">ব্যাগ সংখ্যা</p>
                      <p className="text-3xl font-black text-primary">{req.bagsNeeded}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col gap-4">
                     <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-bold text-foreground">কখন প্রয়োজন:</span> 
                          <p className="text-foreground">{req.neededWhen}</p>
                        </div>
                     </div>
                     
                     <div className="flex justify-center gap-4 pt-2">
                        <Button size="sm" variant="outline" className="h-10 rounded-xl border-green-500/30 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all font-bold gap-2" asChild>
                          <a href={waLink} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="h-10 rounded-xl border-blue-500/30 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold gap-2" asChild>
                          <a href={smsLink}>
                            <MessageSquare className="h-4 w-4" /> SMS
                          </a>
                        </Button>
                     </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t flex bg-muted/20">
                  <Button 
                    onClick={() => handleStartChat(req)} 
                    disabled={isMessaging === req.id}
                    className="flex-1 h-14 rounded-none bg-slate-900 hover:bg-slate-800 text-lg font-bold gap-3"
                  >
                    {isMessaging === req.id ? <Loader2 className="animate-spin" /> : <><MessageSquare className="h-5 w-5" /> চ্যাট</>}
                  </Button>
                  <Button className="flex-1 h-14 rounded-none bg-primary hover:bg-primary/90 text-lg font-bold gap-3" asChild>
                    <a href={`tel:${req.phone}`}>
                      <Phone className="h-5 w-5" /> কল করুন
                    </a>
                  </Button>
                  <Button onClick={() => handleShare(req)} variant="ghost" className="w-16 h-14 rounded-none border-l hover:bg-primary/5">
                    <Share2 className="h-5 w-5 text-primary" />
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
