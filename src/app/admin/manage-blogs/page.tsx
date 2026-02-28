'use client';

import { useState, useEffect } from 'react';
import { getBlogs, addBlog, updateBlog, deleteEntry, type BlogPost } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, ArrowLeft, Save, FileText, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ব্লগটি মুছে ফেলতে চান?')) return;
    try {
      const res = await deleteEntry('Blogs', id);
      if (res.success) {
        toast({ title: "সফল!", description: "ব্লগটি সফলভাবে মুছে ফেলা হয়েছে।" });
        loadData();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "মুছে ফেলা সম্ভব হয়নি।" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    setIsUpdating(true);
    try {
      let res;
      if (isAddMode) {
        res = await addBlog(editingBlog as any);
      } else {
        res = await updateBlog(editingBlog.id!, editingBlog);
      }

      if (res.success) {
        toast({ title: "সফল!", description: isAddMode ? "নতুন ব্লগ পোস্ট করা হয়েছে।" : "ব্লগ আপডেট করা হয়েছে।" });
        setEditingBlog(null);
        setIsAddMode(false);
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
            <h1 className="text-3xl font-black font-headline text-slate-900">Manage Blogs</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">ব্লগ ও সচেতনতা ম্যানেজমেন্ট</p>
          </div>
        </div>
        <Button onClick={() => { setIsAddMode(true); setEditingBlog({ title: '', slug: '', excerpt: '', content: '', category: 'Health', author: 'Admin', imageurl: '' }); }} className="rounded-2xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Plus className="h-5 w-5" /> নতুন ব্লগ লিখুন
        </Button>
      </div>

      <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="h-14 border-none">
              <TableHead className="px-10 font-black text-slate-900 uppercase text-[11px] tracking-widest">ব্লগ</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">ক্যাটাগরি</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">লেখক</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest text-right px-10">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                    <p className="text-muted-foreground font-bold italic">ব্লগ ডাটা লোড হচ্ছে...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center text-muted-foreground font-bold italic">
                  কোনো ব্লগ পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id} className="hover:bg-muted/20 border-b-slate-100 transition-colors">
                  <TableCell className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden relative border-2 border-slate-100 shadow-sm shrink-0">
                        <Image src={blog.imageurl || 'https://picsum.photos/seed/blog/400/400'} fill alt={blog.title} className="object-cover" />
                      </div>
                      <div className="max-w-xs">
                        <p className="font-black text-slate-900 line-clamp-1">{blog.title}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">/{blog.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">{blog.category}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <User className="h-3.5 w-3.5" /> {blog.author}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setIsAddMode(false); setEditingBlog(blog); }} className="rounded-xl h-10 w-10 border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-all">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(blog.id)} className="rounded-xl h-10 w-10 border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-600 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editingBlog} onOpenChange={() => { setEditingBlog(null); setIsAddMode(false); }}>
        <DialogContent className="max-w-4xl rounded-[2.5rem] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{isAddMode ? 'নতুন ব্লগ লিখুন' : 'ব্লগ এডিট করুন'}</DialogTitle>
            <DialogDescription className="font-bold">সঠিক তথ্য দিয়ে আপনার ব্লগটি পাবলিশ করুন।</DialogDescription>
          </DialogHeader>
          {editingBlog && (
            <form onSubmit={handleSave} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold">ব্লগ শিরোনাম *</Label>
                  <Input value={editingBlog.title} onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setEditingBlog({...editingBlog, title, slug});
                  }} required className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">ইউআরএল স্লাগ (Slug) *</Label>
                  <Input value={editingBlog.slug} onChange={e => setEditingBlog({...editingBlog, slug: e.target.value})} required className="rounded-xl h-12 font-mono text-sm" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold">লেখক *</Label>
                  <Input value={editingBlog.author} onChange={e => setEditingBlog({...editingBlog, author: e.target.value})} required className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">ক্যাটাগরি *</Label>
                  <select 
                    value={editingBlog.category} 
                    onChange={e => setEditingBlog({...editingBlog, category: e.target.value})}
                    className="w-full h-12 rounded-xl border bg-white px-4 outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Health">স্বাস্থ্য টিপস</option>
                    <option value="Awareness">সচেতনতা</option>
                    <option value="Eligibility">যোগ্যতা</option>
                    <option value="Success">সফলতার গল্প</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">ফিচার্ড ইমেজ ইউআরএল (Image URL) *</Label>
                <div className="flex gap-4">
                  <Input value={editingBlog.imageurl} onChange={e => setEditingBlog({...editingBlog, imageurl: e.target.value})} placeholder="https://..." required className="rounded-xl h-12" />
                  {editingBlog.imageurl && (
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border relative">
                      <Image src={editingBlog.imageurl} fill alt="preview" className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">সংক্ষিপ্ত বর্ণনা (Excerpt) *</Label>
                <Textarea value={editingBlog.excerpt} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} required className="rounded-xl min-h-[80px]" placeholder="ব্লগের মূল কথাগুলো ২-৩ লাইনে লিখুন..." />
              </div>

              <div className="space-y-2">
                <Label className="font-bold">মূল কন্টেন্ট (Content) *</Label>
                <Textarea value={editingBlog.content} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} required className="rounded-2xl min-h-[300px] font-body text-lg leading-relaxed" placeholder="আপনার পুরো ব্লগটি এখানে লিখুন..." />
              </div>

              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setEditingBlog(null)} className="rounded-xl font-bold">বাতিল</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary rounded-xl font-black h-12 px-10 shadow-lg shadow-primary/20">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  {isAddMode ? 'ব্লগ পাবলিশ করুন' : 'সেভ করুন'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}