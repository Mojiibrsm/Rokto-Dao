
'use client';

import { useState, useEffect } from 'react';
import { getBloodDrives, scheduleAppointment, type BloodDrive } from '@/lib/sheets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock, Search, Loader2, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function DrivesPage() {
  const [drives, setDrives] = useState<BloodDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDrive, setSelectedDrive] = useState<BloodDrive | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDrives();
  }, []);

  async function loadDrives(query?: string) {
    setLoading(true);
    const data = await getBloodDrives(query);
    setDrives(data);
    setLoading(false);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDrives(search);
  };

  const handleBook = async () => {
    if (!selectedDrive) return;
    setIsBooking(true);
    try {
      // Simulation: Using a hardcoded user for the mock
      await scheduleAppointment({
        driveId: selectedDrive.id,
        driveName: selectedDrive.name,
        userEmail: 'test@example.com',
        userName: 'Alex Donor',
        date: selectedDrive.date,
        time: '10:30 AM', // In a real app, user would pick a slot
      });
      setSuccess(true);
      toast({
        title: "Appointment Scheduled!",
        description: `We'll see you at ${selectedDrive.name} on ${selectedDrive.date}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Could not schedule appointment. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold font-headline">Find a Blood Drive</h1>
          <p className="text-muted-foreground">Nearby opportunities to save a life today.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by city or zip code..." 
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : drives.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl text-muted-foreground">No blood drives found in this area. Try another search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drives.map(drive => (
            <Card key={drive.id} className="group hover:shadow-xl transition-all border-l-4 border-l-secondary">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{drive.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {drive.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {drive.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {drive.time}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">{drive.distance} away</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setSelectedDrive(drive)}>
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={!!selectedDrive} onOpenChange={(open) => {
        if (!open) {
          setSelectedDrive(null);
          setSuccess(false);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          {!success ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Appointment</DialogTitle>
                <DialogDescription>
                  You're scheduling a donation at <strong>{selectedDrive?.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-bold">{selectedDrive?.date}</p>
                    <p className="text-xs text-muted-foreground">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                  <Clock className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-bold">10:30 AM</p>
                    <p className="text-xs text-muted-foreground">Selected Time Slot</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  * Final screening and exact timing will be confirmed on arrival.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDrive(null)}>Cancel</Button>
                <Button className="bg-primary" onClick={handleBook} disabled={isBooking}>
                  {isBooking ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Booking'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-12 text-center flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Appointment Confirmed!</h3>
                <p className="text-muted-foreground mt-2">
                  Thank you for your commitment to saving lives. We've sent a confirmation to your email.
                </p>
              </div>
              <DialogClose asChild>
                <Button className="mt-4 w-full">Great, thanks!</Button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
