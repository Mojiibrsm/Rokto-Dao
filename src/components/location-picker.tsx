'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DISTRICT_COORDS } from '@/lib/coordinates';

// Fix for default Leaflet icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LocationPicker({ 
  onLocationSelect, 
  selectedDistrict, 
  initialCoords 
}: { 
  onLocationSelect: (lat: number, lng: number) => void,
  selectedDistrict?: string,
  initialCoords?: { lat: number, lng: number }
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialCoords ? [initialCoords.lat, initialCoords.lng] : null
  );
  const [center, setCenter] = useState<[number, number]>([23.8103, 90.4125]);
  const [zoom, setZoom] = useState(7);

  useEffect(() => {
    if (selectedDistrict && DISTRICT_COORDS[selectedDistrict]) {
      setCenter(DISTRICT_COORDS[selectedDistrict]);
      setZoom(12);
    }
  }, [selectedDistrict]);

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden border-2 border-primary/20 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationSelect={handleSelect} />
        {position && <Marker position={position} />}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[10] bg-white/90 backdrop-blur p-2 rounded-lg text-[10px] font-bold border shadow-sm">
        মানচিত্রে ক্লিক করে আপনার সঠিক অবস্থান চিহ্নিত করুন
      </div>
    </div>
  );
}
