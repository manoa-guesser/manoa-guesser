'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = () => (
  <div style={{ height: '300px', width: '100%' }}>
    <MapContainer
      center={[21.2995, -157.8170]} // UH Mānoa
      zoom={16}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  </div>
);

export default LeafletMap;
