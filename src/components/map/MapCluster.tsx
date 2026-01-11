'use client';

import MarkerClusterGroup from 'react-leaflet-cluster';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ReligiousSite } from '@/types';

// Custom icons for temples and gurdwaras
const templeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const gurdwaraIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Selected site icon (green)
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  shadowSize: [49, 49]
});

interface MapClusterProps {
  sites: ReligiousSite[];
  selectedSite?: ReligiousSite | null;
  onSiteSelect?: (site: ReligiousSite) => void;
}

export default function MapCluster({ sites, selectedSite, onSiteSelect }: MapClusterProps) {
  const getMarkerIcon = (site: ReligiousSite) => {
    // Use selected icon if this is the selected site
    if (selectedSite && site.id === selectedSite.id) {
      return selectedIcon;
    }
    // Otherwise use type-based icon
    return site.type === 'temple' ? templeIcon : gurdwaraIcon;
  };

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={50}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={true}
      iconCreateFunction={(cluster: any) => {
        const count = cluster.getChildCount();
        let className = 'marker-cluster-';
        
        if (count < 10) {
          className += 'small';
        } else if (count < 100) {
          className += 'medium';
        } else {
          className += 'large';
        }

        return new L.DivIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: new L.Point(40, 40)
        });
      }}
    >
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={[site.location.coordinates.lat, site.location.coordinates.lng]}
          icon={getMarkerIcon(site)}
          eventHandlers={{
            click: () => {
              if (onSiteSelect) {
                onSiteSelect(site);
              }
            },
          }}
        >
          <Popup maxWidth={300} minWidth={200}>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{site.name}</h3>
                {selectedSite && site.id === selectedSite.id && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Selected
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    site.type === 'temple' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></span>
                  <span className="text-sm font-medium text-gray-700">
                    {site.type === 'temple' ? 'Temple' : 'Gurdwara'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600">
                  <span className="font-medium">📍 Location:</span> {site.location.address}
                </p>
                
                <p className="text-sm text-gray-600">
                  <span className="font-medium">🕐 Timings:</span> {site.timings.weekdays}
                </p>
                
                {site.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">ℹ️ About:</span> {site.description}
                  </p>
                )}
                
                {site.facilities.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">🏢 Facilities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {site.facilities.slice(0, 4).map((facility, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            site.type === 'temple' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {facility}
                        </span>
                      ))}
                      {site.facilities.length > 4 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{site.facilities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {site.contact?.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">📞 Contact:</span> {site.contact.phone}
                  </p>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSiteSelect) {
                        onSiteSelect(site);
                      }
                    }}
                    className="w-full px-3 py-2 bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}