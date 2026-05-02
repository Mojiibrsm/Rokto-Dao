'use client';

import { useState, useEffect } from 'react';
import { getDonors, deleteEntry, updateDonorProfile, setDonorPassword, type Donor } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Edit, Trash2, ArrowLeft, Save, Phone, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISTRICTS } from '@/lib/bangladesh-data';

export default function ManageDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const data = await getDonors();
    setDonors(data);
    setFilteredDonors(data);
    setLoading(false);
  }

  useEffect(() => {
    const results = donors.filter(d => 
      d.fullName.toLowerCase().includes(search.toLowerCase()) || 
      d.phone.includes(search) ||
      (d.email && d.email.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredDonors(results);
  }, [search, donors]);

  const handleDelete = async (phone: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই দাতা তথ্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await deleteEntry('Donors', phone); 
      if (res.success) {
        toast({ title: "Deleted!", description: "Donor removed successfully." });
        loadData();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete donor." });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;
    setIsUpdating(true);
    try {
      // Update profile
      const res = await updateDonorProfile(editingDonor.phone, editingDonor);
      
      // Update password if provided
      if (newPassword.trim()) {
        await setDonorPassword(editingDonor.email || '', editingDonor.phone, newPassword);
      }

      if (res.success) {
        toast({ title: "Updated!", description: "Donor profile saved successfully." });
        setEditingDonor(null);
        setNewPassword('');
        loadData();
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-3xl font-bold font-headline">Donor Management</h1>
        </div>
        
        <div className="relative flex-1 w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..." 
            className="pl-10 h-12 rounded-xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-lg border-none overflow-hidden rounded-3xl bg-white">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-6 h-14">Donor Info</TableHead>
              <TableHead className="h-14">Location</TableHead>
              <TableHead className="h-14">Stats</TableHead>
              <TableHead className="h-14 text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-64 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" /></TableCell></TableRow>
            ) : filteredDonors.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-64 text-center text-muted-foreground font-bold italic">কোনো তথ্য পাওয়া যায়নি।</TableCell></TableRow>
            ) : (
              filteredDonors.map((donor, i) => (
                <TableRow key={i} className="hover:bg-muted/20 border-b-slate-100 transition-colors">
                  <TableCell className="px-6 py-5">
                    <div className="font-bold text-slate-900">{donor.fullName} <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-none">{donor.bloodType}</Badge></div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1 font-bold"><Phone className="h-3 w-3" /> {donor.phone}</div>
                    {donor.email && <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5"><Mail className="h-3 w-3" /> {donor.email}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-black text-slate-700">{donor.district}</div>
                    <div className="text-xs text-muted-foreground font-medium">{donor.area || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-black text-primary">Donations: {donor.totalDonations || 0}</div>
                    <div className="text-[10px] text-muted-foreground font-bold">Last: {donor.lastDonationDate || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-slate-200" onClick={() => setEditingDonor(donor)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-slate-200 text-red-500 hover:bg-red-50" onClick={() => handleDelete(donor.phone)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingDonor} onOpenChange={() => { setEditingDonor(null); setNewPassword(''); }}>
        <DialogContent className="max-w-2xl rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Edit Donor Profile</DialogTitle>
            <DialogDescription className="font-bold">রক্তদাতার তথ্য এবং পাসওয়ার্ড এখান থেকে পরিবর্তন করুন।</DialogDescription>
          </DialogHeader>
          {editingDonor && (
            <form onSubmit={handleUpdate} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-bold">Full Name</Label>
                  <Input value={editingDonor.fullName} onChange={e => setEditingDonor({...editingDonor, fullName: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Phone (Read-only)</Label>
                  <Input value={editingDonor.phone} disabled className="opacity-60 bg-muted rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="font-bold">Email</Label>
                  <Input value={editingDonor.email || ''} onChange={e => setEditingDonor({...editingDonor, email: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Blood Type</Label>
                  <Select value={editingDonor.bloodType} onValueChange={v => setEditingDonor({...editingDonor, bloodType: v})}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 p-5 bg-muted/30 rounded-3xl border">
                 <div className="space-y-2">
                   <Label className="font-bold">District</Label>
                   <Select value={editingDonor.district} onValueChange={v => setEditingDonor({...editingDonor, district: v})}>
                     <SelectTrigger className="bg-white rounded-xl"><SelectValue /></SelectTrigger>
                     <SelectContent className="max-h-[300px]">{DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="font-bold">Total Donations</Label>
                   <Input type="number" value={editingDonor.totalDonations} onChange={e => setEditingDonor({...editingDonor, totalDonations: parseInt(e.target.value) || 0})} className="bg-white rounded-xl" />
                 </div>
              </div>

              {/* Password Management Section */}
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                 <h4 className="font-black text-primary flex items-center gap-2"><KeyRound className="h-5 w-5" /> পাসওয়ার্ড পরিবর্তন</h4>
                 <div className="relative">
                    <Input 
                      type={showPass ? "text" : "password"}
                      placeholder="নতুন পাসওয়ার্ড দিন (না চাইলে ফাঁকা রাখুন)" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="bg-white h-12 rounded-xl pr-12 font-bold tracking-widest"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                 </div>
                 <p className="text-[10px] font-bold text-muted-foreground">অ্যাডমিন হিসেবে আপনি সরাসরি ব্যবহারকারীর নতুন পাসওয়ার্ড সেট করে দিতে পারেন।</p>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Organization/Team</Label>
                <Input value={editingDonor.organization || ''} onChange={e => setEditingDonor({...editingDonor, organization: e.target.value})} className="rounded-xl" />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" className="rounded-xl font-bold" onClick={() => setEditingDonor(null)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary rounded-xl font-black px-8 h-12">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />} 
                  Save Profile Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
