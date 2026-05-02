'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMessages, sendMessage, getDonorByPhone, type Message, type Donor } from '@/lib/sheets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, ArrowLeft, Phone, Info, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: convoId } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<Donor | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setCurrentUser(JSON.parse(savedUser));
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    
    // Parse phones from ID: CHAT_PHONE1_PHONE2
    const parts = convoId.split('_');
    const otherPhone = parts[1] === currentUser.phone ? parts[2] : parts[1];
    
    async function loadInitialData() {
      try {
        const [msgs, donor] = await Promise.all([
          getMessages(convoId),
          getDonorByPhone(otherPhone)
        ]);
        setMessages(msgs);
        setOtherUser(donor);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    }
    loadInitialData();

    // Simple Polling (MVP level)
    const interval = setInterval(async () => {
      const msgs = await getMessages(convoId);
      if (msgs.length !== messages.length) {
        setMessages(msgs);
        scrollToBottom();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [convoId, currentUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || !otherUser || !currentUser) return;

    setIsSending(true);
    const text = inputText;
    setInputText('');

    try {
      const res = await sendMessage(currentUser.phone, otherUser.phone, text);
      if (res.success) {
        const msgs = await getMessages(convoId);
        setMessages(msgs);
        scrollToBottom();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground">বক্স ওপেন হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white border-b-2 border-primary/5 p-4 md:px-8 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/messages')} className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Link href={`/donors/${otherUser?.phone}`} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-md relative overflow-hidden">
              {otherUser?.imageUrl ? <Image src={otherUser.imageUrl} fill alt="P" className="object-cover" /> : otherUser?.fullName?.substring(0, 1)}
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="font-black text-lg leading-none">{otherUser?.fullName || 'রক্তদাতা'}</h2>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">Online</p>
            </div>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full border-slate-200" asChild>
            <a href={`tel:${otherUser?.phone}`}><Phone className="h-5 w-5 text-primary" /></a>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
            <Info className="h-12 w-12 mb-4" />
            <p className="font-bold">সালাম দিয়ে কথা শুরু করুন!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === currentUser?.phone;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[80%] md:max-w-[60%] space-y-1`}>
                  <div className={`p-4 rounded-3xl text-sm font-medium shadow-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border'}`}>
                    {msg.content}
                  </div>
                  <p className={`text-[9px] font-black uppercase text-muted-foreground px-2 ${isMe ? 'text-right' : 'text-left'}`}>
                    {format(new Date(msg.timestamp), 'hh:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t shadow-2xl">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="আপনার বার্তা লিখুন..." 
            className="flex-1 h-14 rounded-2xl bg-slate-50 border-none px-6 text-lg focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
            disabled={isSending}
          />
          <Button type="submit" disabled={!inputText.trim() || isSending} className="h-14 w-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 transition-all active:scale-95">
            {isSending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
