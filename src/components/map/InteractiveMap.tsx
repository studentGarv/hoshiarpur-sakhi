'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReligiousSite } from '@/types';
import MapCluster from './MapCluster';

// Fix for default markers in Next.js
const iconPrototype = L.Icon.Default.prototype as unknown as Record<string, unknown>;
delete iconPrototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  sites: ReligiousSite[];
  selectedSite?: ReligiousSite | null;
  onSiteSelect?: (site: ReligiousSite) => void;
  className?: string;
}

export default function InteractiveMap({ 
  sites, 
  selectedSite,
  onSiteSelect, 
  className = '' 
}: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Center map on selected site when it changes
  useEffect(() => {
    if (mapInstance && selectedSite) {
      const { lat, lng } = selectedSite.location.coordinates;
      mapInstance.setView([lat, lng], 15, { animate: true });
    }
  }, [mapInstance, selectedSite]);

  // Center map on Hoshiarpur district
  const center: [number, number] = [31.5204, 75.9118];
  const zoom = 11;

  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg z-0"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        ref={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={8}
        />
        
        <MapCluster 
          sites={sites} 
          selectedSite={selectedSite}
          onSiteSelect={onSiteSelect} 
        />
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Temples</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Gurdwaras</span>
          </div>
          {selectedSite && (
            <div className="flex items-center gap-2 text-xs pt-1 border-t border-gray-200">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => {
              if (mapInstance) {
                mapInstance.setView(center, zoom, { animate: true });
              }
            }}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Reset view"
          >
            🏠 Reset
          </button>
          {selectedSite && (
            <button
              onClick={() => {
                if (mapInstance && selectedSite) {
                  const { lat, lng } = selectedSite.location.coordinates;
                  mapInstance.setView([lat, lng], 15, { animate: true });
                }
              }}
              className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors duration-200"
              title="Center on selected site"
            >
              📍 Center
            </button>
          )}
        </div>
      </div>

      {/* Site Count Display */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-10">
        <div className="text-sm font-medium text-gray-700">
          {sites.length} site{sites.length !== 1 ? 's' : ''} shown
        </div>
      </div>
    </div>
  );
}