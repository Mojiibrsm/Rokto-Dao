'use client';

import { useState, useEffect } from 'react';
import { getBlogs, addBlog, updateBlog, deleteEntry, type BlogPost } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, ArrowLeft, Save, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import { format } from 'date-fns';

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
        toast({ title: "সফল!", description: "ব্লগটি মুছে ফেলা হয়েছে।" });
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-3xl font-bold font-headline">Manage Blogs</h1>
        </div>
        <Button onClick={() => { setIsAddMode(true); setEditingBlog({ title: '', slug: '', excerpt: '', content: '', category: 'Health', author: 'Admin', imageurl: '' }); }}>
          <Plus className="h-4 w-4 mr-2" /> নতুন ব্লগ
        </Button>
      </div>

      <Card className="shadow-lg border-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : blogs.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">কোনো ব্লগ পাওয়া যায়নি।</TableCell></TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="font-bold">{blog.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">/{blog.slug}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{blog.category}</Badge></TableCell>
                  <TableCell className="text-sm">{blog.author}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setIsAddMode(false); setEditingBlog(blog); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(blog.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editingBlog} onOpenChange={() => { setEditingBlog(null); setIsAddMode(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddMode ? 'নতুন ব্লগ লিখুন' : 'ব্লগ এডিট করুন'}</DialogTitle>
            <DialogDescription>সঠিক তথ্য দিয়ে ব্লগটি সাবমিট করুন।</DialogDescription>
          </DialogHeader>
          {editingBlog && (
            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ব্লগ শিরোনাম *</Label>
                  <Input value={editingBlog.title || ''} onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setEditingBlog({...editingBlog, title, slug});
                  }} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL) *</Label>
                  <Input value={editingBlog.slug || ''} onChange={e => setEditingBlog({...editingBlog, slug: e.target.value})} required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>লেখক *</Label>
                  <Input value={editingBlog.author || ''} onChange={e => setEditingBlog({...editingBlog, author: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>ক্যাটাগরি</Label>
                  <Input value={editingBlog.category || ''} onChange={e => setEditingBlog({...editingBlog, category: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ইমেজ ইউআরএল *</Label>
                <Input value={editingBlog.imageurl || ''} onChange={e => setEditingBlog({...editingBlog, imageurl: e.target.value})} placeholder="https://..." required />
              </div>

              <div className="space-y-2">
                <Label>সংক্ষিপ্ত বর্ণনা (Excerpt) *</Label>
                <Textarea value={editingBlog.excerpt || ''} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <Label>ব্লগ কন্টেন্ট *</Label>
                <Textarea value={editingBlog.content || ''} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} required className="min-h-[200px]" />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditingBlog(null)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary">
                  {isUpdating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {isAddMode ? 'পাবলিশ করুন' : 'সেভ করুন'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
