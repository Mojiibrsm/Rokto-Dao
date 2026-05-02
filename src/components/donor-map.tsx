'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type Donor } from '@/lib/sheets';
import { DISTRICT_COORDS } from '@/lib/coordinates';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, User, MapPin, Droplet } from 'lucide-react';
import Link from 'next/link';

// Fix for default Leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map if district is selected
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 9);
  return null;
}

export default function DonorMap({ donors }: { donors: Donor[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[600px] bg-muted animate-pulse rounded-3xl" />;

  // Default center: Bangladesh
  const defaultCenter: [number, number] = [23.6850, 90.3563];

  return (
    <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {donors.map((donor, idx) => {
          const coords = DISTRICT_COORDS[donor.district || ''];
          if (!coords) return null;

          // Add a small random jitter to markers in the same district so they don't overlap perfectly
          const jitterCoords: [number, number] = [
            coords[0] + (Math.random() - 0.5) * 0.05,
            coords[1] + (Math.random() - 0.5) * 0.05
          ];

          return (
            <Marker key={idx} position={jitterCoords}>
              <Popup className="donor-popup">
                <div className="p-2 space-y-3 min-w-[200px]">
                  <div className="flex items-center gap-3 border-b pb-2">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {donor.fullName.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{donor.fullName}</h4>
                      <Badge className="bg-primary text-white text-[10px] h-5">{donor.bloodType}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> {donor.area}, {donor.district}</p>
                    {donor.organization && <p className="flex items-center gap-2"><User className="h-3 w-3 text-primary" /> {donor.organization}</p>}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1 bg-primary text-[10px] h-8" asChild>
                      <a href={`tel:${donor.phone}`}><Phone className="h-3 w-3 mr-1" /> কল করুন</a>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-[10px] h-8" asChild>
                      <Link href={`/donors/${donor.phone}`}>প্রোফাইল</Link>
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
