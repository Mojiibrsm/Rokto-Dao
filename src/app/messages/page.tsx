'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getConversations, type Conversation } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Loader2, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function MessagesPage() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      try {
        const data = await getConversations(user.phone);
        setConvos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline">আপনার <span className="text-primary">ইনবক্স</span></h1>
          <p className="text-muted-foreground font-bold italic">সরাসরি রক্তদাতা বা গ্রহীতার সাথে যোগাযোগ করুন।</p>
        </div>
        <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <MessageSquare className="h-7 w-7" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <p className="font-bold text-muted-foreground italic">বার্তাসমূহ লোড হচ্ছে...</p>
        </div>
      ) : convos.length === 0 ? (
        <Card className="p-20 text-center border-none shadow-2xl bg-white rounded-[3rem]">
          <MessageSquare className="h-20 w-20 mx-auto text-muted-foreground opacity-10 mb-6" />
          <h2 className="text-2xl font-black mb-2">আপনার ইনবক্স ফাঁকা</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
            এখনও কারো সাথে বার্তা আদান-প্রদান করা হয়নি। দাতার প্রোফাইলে গিয়ে মেসেজ দিন।
          </p>
          <Button asChild className="rounded-full bg-primary px-10 h-12 text-lg font-bold shadow-xl shadow-primary/20">
            <Link href="/donors">রক্তদাতা খুঁজুন</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {convos.map((convo) => (
            <Link key={convo.id} href={`/messages/${convo.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 rounded-3xl border-none shadow-md overflow-hidden group border-l-8 border-l-transparent hover:border-l-primary bg-white">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-lg relative shrink-0 overflow-hidden">
                    {convo.otherUser?.imageUrl ? (
                      <Image src={convo.otherUser.imageUrl} fill alt="P" className="object-cover" />
                    ) : (
                      (convo.otherUser?.fullName || 'U').substring(0, 1)
                    )}
                    <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-xl truncate pr-4 group-hover:text-primary transition-colors">
                        {convo.otherUser?.fullName || 'রক্তদাতা'}
                      </h3>
                      <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1 shrink-0 bg-muted px-2 py-0.5 rounded-full">
                        <Clock className="h-3 w-3" /> {format(new Date(convo.updatedAt), 'hh:mm a')}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-1 italic">
                      "{convo.lastMessage}"
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
