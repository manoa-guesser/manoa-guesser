'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LeafletMapProps {
  onSelectLocation: (lat: number, lng: number) => void;
}

export default function LeafletMap({ onSelectLocation }: LeafletMapProps) {
  const [position, setPosition] = useState<[number, number]>([21.3008, -157.8175]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onSelectLocation(lat, lng);
      },
    });
    return null;
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position} icon={markerIcon} />

        <MapClickHandler />
      </MapContainer>
    </div>
  );
}
