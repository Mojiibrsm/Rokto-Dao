'use client';

import { useState, useEffect } from 'react';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteEntry, type TeamMember } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, ArrowLeft, Save, Users, Link as LinkIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';

export default function ManageTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      const res = await deleteEntry('Team', id);
      if (res.success) {
        toast({ title: "সফল!", description: "টিম মেম্বারকে সরিয়ে দেওয়া হয়েছে।" });
        loadData();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "ত্রুটি", description: "মুছে ফেলা সম্ভব হয়নি।" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsUpdating(true);
    try {
      let res;
      if (isAddMode) {
        res = await addTeamMember(editingMember as any);
      } else {
        res = await updateTeamMember(editingMember.id!, editingMember);
      }

      if (res.success) {
        toast({ title: "সফল!", description: isAddMode ? "নতুন মেম্বার যোগ করা হয়েছে।" : "তথ্য আপডেট করা হয়েছে।" });
        setEditingMember(null);
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
            <h1 className="text-3xl font-black font-headline text-slate-900">Manage Team</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">টিম মেম্বার ম্যানেজমেন্ট সিস্টেম</p>
          </div>
        </div>
        <Button onClick={() => { setIsAddMode(true); setEditingMember({ name: '', role: '', bio: '', imageurl: '', twitter: '', linkedin: '', email: '' }); }} className="rounded-2xl h-12 px-6 gap-2 bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
          <Plus className="h-5 w-5" /> নতুন মেম্বার যোগ করুন
        </Button>
      </div>

      <Card className="shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="h-14 border-none">
              <TableHead className="px-10 font-black text-slate-900 uppercase text-[11px] tracking-widest">মেম্বার</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">পদবী</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest">বায়ো</TableHead>
              <TableHead className="font-black text-slate-900 uppercase text-[11px] tracking-widest text-right px-10">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                    <p className="text-muted-foreground font-bold italic">টিম ডাটা লোড হচ্ছে...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center text-muted-foreground font-bold italic">
                  কোনো মেম্বার পাওয়া যায়নি।
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/20 border-b-slate-100 transition-colors">
                  <TableCell className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden relative border-2 border-slate-100">
                        <Image src={member.imageurl || 'https://picsum.photos/seed/team/400/400'} fill alt={member.name} className="object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-primary/10">{member.role}</span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <p className="text-sm text-slate-600 font-medium">{member.bio}</p>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setIsAddMode(false); setEditingMember(member); }} className="rounded-xl h-10 w-10 border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-all">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(member.id)} className="rounded-xl h-10 w-10 border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-600 transition-all">
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

      <Dialog open={!!editingMember} onOpenChange={() => { setEditingMember(null); setIsAddMode(false); }}>
        <DialogContent className="max-w-2xl rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{isAddMode ? 'নতুন মেম্বার যোগ করুন' : 'তথ্য এডিট করুন'}</DialogTitle>
            <DialogDescription className="font-bold">সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <form onSubmit={handleSave} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold">পুরো নাম *</Label>
                  <Input value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} required className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">পদবী *</Label>
                  <Input value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value})} required className="rounded-xl h-12" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold">ইমেজ ইউআরএল (Image URL) *</Label>
                <div className="flex gap-4">
                  <Input value={editingMember.imageurl} onChange={e => setEditingMember({...editingMember, imageurl: e.target.value})} placeholder="https://..." required className="rounded-xl h-12" />
                  {editingMember.imageurl && (
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border relative">
                      <Image src={editingMember.imageurl} fill alt="preview" className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">বায়ো (Bio)</Label>
                <Textarea value={editingMember.bio} onChange={e => setEditingMember({...editingMember, bio: e.target.value})} className="rounded-xl min-h-[80px]" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><Mail className="h-3 w-3 text-primary" /> ইমেইল</Label>
                  <Input value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} className="rounded-xl h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><LinkIcon className="h-3 w-3 text-blue-500" /> টুইটার লিংক</Label>
                  <Input value={editingMember.twitter} onChange={e => setEditingMember({...editingMember, twitter: e.target.value})} className="rounded-xl h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><LinkIcon className="h-3 w-3 text-blue-700" /> লিঙ্কডইন লিংক</Label>
                  <Input value={editingMember.linkedin} onChange={e => setEditingMember({...editingMember, linkedin: e.target.value})} className="rounded-xl h-10" />
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setEditingMember(null)} className="rounded-xl font-bold">Cancel</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary rounded-xl font-black h-12 px-10 shadow-lg shadow-primary/20">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  {isAddMode ? 'মেম্বার যোগ করুন' : 'সেভ করুন'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}