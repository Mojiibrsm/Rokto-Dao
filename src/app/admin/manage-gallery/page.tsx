'use client';

import { useState, useEffect } from 'react';
import { getGallery, addGalleryItem, deleteEntry, type GalleryItem } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Camera } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';

export default function ManageGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', imageurl: '', category: 'Campaign' });
  const [isAddMode, setIsAddMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getGallery();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ছবিটি মুছে ফেলতে চান?')) return;
    try {
      const res = await deleteEntry('Gallery', id);
      if (res.success) {
        toast({ title: "সফল!", description: "ছবিটি গ্যালারি থেকে সরিয়ে দেওয়া হয়েছে।" });
        loadData();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "মুছে ফেলা সম্ভব হয়নি।" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageurl) return;
    setIsUpdating(true);
    try {
      const res = await addGalleryItem(newItem);
      if (res.success) {
        toast({ title: "সফল!", description: "নতুন ছবি গ্যালারিতে যোগ করা হয়েছে।" });
        setIsAddMode(false);
        setNewItem({ title: '', imageurl: '', category: 'Campaign' });
        loadData();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ব্যর্থ হয়েছে" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl h-12 w-12 border">
            <Link href="/admin"><ArrowLeft className="h-6 w-6" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black font-headline text-slate-900">Manage Gallery</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">গ্যালারি ম্যানেজমেন্ট সিস্টেম</p>
          </div>
        </div>
        <Button onClick={() => setIsAddMode(true)} className="rounded-2xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Plus className="h-5 w-5" /> নতুন ছবি যোগ করুন
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <p className="text-muted-foreground font-bold italic">গ্যালারি ডাটা লোড হচ্ছে...</p>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-20 text-center border-dashed bg-muted/20 rounded-[3rem]">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
          <p className="text-xl font-bold text-muted-foreground">গ্যালারি আপাতত খালি।</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item.id} className="group overflow-hidden rounded-[2.5rem] border-none shadow-xl bg-white hover:shadow-2xl transition-all">
              <div className="relative h-64 w-full">
                <Image src={item.imageurl} fill alt={item.title} className="object-cover transition-transform group-hover:scale-110 duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} className="rounded-full h-12 w-12">
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <CardHeader className="p-6">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg font-bold truncate">{item.title || 'শিরোনাম নেই'}</CardTitle>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddMode} onOpenChange={setIsAddMode}>
        <DialogContent className="max-w-xl rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">গ্যালারিতে নতুন ছবি</DialogTitle>
            <DialogDescription className="font-bold">সঠিক ছবির লিংক এবং তথ্য দিয়ে ফর্মটি পূরণ করুন।</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="font-bold">ছবির শিরোনাম (Title)</Label>
              <Input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="যেমন: ঢাকা মেডিকেল ক্যাম্পেইন ২০২৪" className="rounded-xl h-12" />
            </div>
            
            <div className="space-y-2">
              <Label className="font-bold">ইমেজ ইউআরএল (Image URL) *</Label>
              <div className="flex gap-4">
                <Input value={newItem.imageurl} onChange={e => setNewItem({...newItem, imageurl: e.target.value})} placeholder="https://..." required className="rounded-xl h-12" />
                {newItem.imageurl && (
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border relative">
                    <Image src={newItem.imageurl} fill alt="preview" className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">ক্যাটাগরি</Label>
              <select 
                value={newItem.category} 
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                className="w-full h-12 rounded-xl border bg-white px-4 outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Campaign">রক্তদান ক্যাম্পেইন</option>
                <option value="Event">অনুষ্ঠান</option>
                <option value="Volunteer">স্বেচ্ছাসেবক</option>
                <option value="Other">অন্যান্য</option>
              </select>
            </div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsAddMode(false)} className="rounded-xl font-bold">বাতিল</Button>
              <Button type="submit" disabled={isUpdating} className="bg-primary rounded-xl font-black h-12 px-10 shadow-lg shadow-primary/20">
                {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Camera className="h-5 w-5 mr-2" />}
                ছবি যোগ করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}