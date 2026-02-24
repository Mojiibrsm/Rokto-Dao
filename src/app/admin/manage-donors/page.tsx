'use client';

import { useState, useEffect } from 'react';
import { getDonors, deleteEntry, updateDonorProfile, type Donor } from '@/lib/sheets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Edit, Trash2, ArrowLeft, Save, X, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISTRICTS, BANGLADESH_DATA } from '@/lib/bangladesh-data';

export default function ManageDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
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
      d.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDonors(results);
  }, [search, donors]);

  const handleDelete = async (phone: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;
    try {
      const res = await deleteEntry('Donors', phone); // Assuming phone is the ID or unique key
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
      const res = await updateDonorProfile(editingDonor.phone, editingDonor);
      if (res.success) {
        toast({ title: "Updated!", description: "Donor profile saved." });
        setEditingDonor(null);
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/admin"><ArrowLeft className="h-5 w-5" /></Link></Button>
          <h1 className="text-3xl font-bold font-headline">Donor Management</h1>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, phone or email..." 
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-lg border-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Donor Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : filteredDonors.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No donors found.</TableCell></TableRow>
            ) : (
              filteredDonors.map((donor, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="font-bold">{donor.fullName} <Badge variant="secondary" className="ml-2">{donor.bloodType}</Badge></div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Phone className="h-3 w-3" /> {donor.phone}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2"><Mail className="h-3 w-3" /> {donor.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{donor.district}</div>
                    <div className="text-xs text-muted-foreground">{donor.area}, {donor.union}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-bold">Donations: {donor.totalDonations}</div>
                    <div className="text-[10px] text-muted-foreground">Last: {donor.lastDonationDate}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingDonor(donor)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(donor.phone)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingDonor} onOpenChange={() => setEditingDonor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Donor Profile</DialogTitle>
            <DialogDescription>Modify the information for {editingDonor?.fullName}.</DialogDescription>
          </DialogHeader>
          {editingDonor && (
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={editingDonor.fullName} onChange={e => setEditingDonor({...editingDonor, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Phone (Used as ID)</Label>
                <Input value={editingDonor.phone} disabled className="opacity-50" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editingDonor.email} onChange={e => setEditingDonor({...editingDonor, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Blood Type</Label>
                <Select value={editingDonor.bloodType} onValueChange={v => setEditingDonor({...editingDonor, bloodType: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Select value={editingDonor.district} onValueChange={v => setEditingDonor({...editingDonor, district: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Donations</Label>
                <Input type="number" value={editingDonor.totalDonations} onChange={e => setEditingDonor({...editingDonor, totalDonations: parseInt(e.target.value) || 0})} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Organization/Team</Label>
                <Input value={editingDonor.organization} onChange={e => setEditingDonor({...editingDonor, organization: e.target.value})} />
              </div>
              <DialogFooter className="col-span-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setEditingDonor(null)}>Cancel</Button>
                <Button type="submit" disabled={isUpdating} className="bg-primary">{isUpdating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
