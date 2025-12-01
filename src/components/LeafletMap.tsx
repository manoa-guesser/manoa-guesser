'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const center: LatLngExpression = [21.2995, -157.8170];

const LeafletMap = () => (
  <div style={{ height: '300px', width: '100%' }}>
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  </div>
);

export default LeafletMap;
