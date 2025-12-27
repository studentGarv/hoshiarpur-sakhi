'use client';

import { useEffect, useRef } from 'react';
import { ReligiousSite } from '@/types';

interface SiteDetailCardProps {
  site: ReligiousSite | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteDetailCard({ site, isOpen, onClose }: SiteDetailCardProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !site) {
    return null;
  }

  const getSiteTypeIcon = (type: 'temple' | 'gurdwara') => {
    return type === 'temple' ? '🛕' : '🏛️';
  };

  const getSiteTypeColor = (type: 'temple' | 'gurdwara') => {
    return type === 'temple' 
      ? 'bg-orange-100 text-orange-800 border-orange-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatTimings = (timings: ReligiousSite['timings']) => {
    const timingsList = [];
    if (timings.weekdays) timingsList.push(`Weekdays: ${timings.weekdays}`);
    if (timings.weekends) timingsList.push(`Weekends: ${timings.weekends}`);
    if (timings.specialDays) timingsList.push(`Special Days: ${timings.specialDays}`);
    return timingsList;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getSiteTypeIcon(site.type)}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{site.name}</h2>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getSiteTypeColor(site.type)}`}>
                    {site.type.charAt(0).toUpperCase() + site.type.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <p className="text-lg text-gray-700 leading-relaxed">{site.description}</p>
              </div>

              {/* Location and Map Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Location Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">{site.location.address}</p>
                    <p className="text-gray-600">{site.location.city}</p>
                    <p className="text-sm text-gray-500">
                      Coordinates: {site.location.coordinates.lat.toFixed(4)}, {site.location.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Embedded Map Placeholder */}
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600 font-medium">Interactive Map</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {site.location.coordinates.lat.toFixed(4)}, {site.location.coordinates.lng.toFixed(4)}
                    </p>
                    <button 
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${site.location.coordinates.lat},${site.location.coordinates.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      Open in Google Maps →
                    </button>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  History & Significance
                </h3>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-gray-700 leading-relaxed">{site.history}</p>
                </div>
              </div>

              {/* Timings and Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Timings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Visiting Hours
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="space-y-2">
                      {formatTimings(site.timings).map((timing, index) => (
                        <p key={index} className="text-gray-700">{timing}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Available Facilities
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    {site.facilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {site.facilities.map((facility, index) => (
                          <span 
                            key={index}
                            className="inline-flex px-3 py-1 text-sm font-medium bg-white text-blue-800 rounded-full border border-blue-300"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No facilities listed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {site.contact && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="space-y-2">
                      {site.contact.phone && (
                        <p className="text-gray-700">
                          <span className="font-medium">Phone:</span>{' '}
                          <a href={`tel:${site.contact.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            {site.contact.phone}
                          </a>
                        </p>
                      )}
                      {site.contact.email && (
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span>{' '}
                          <a href={`mailto:${site.contact.email}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            {site.contact.email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Image Gallery Placeholder */}
              {site.images && site.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {site.images.map((image, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[120px]">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🖼️</div>
                          <p className="text-xs text-gray-500">{image}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Last updated: Information subject to change
              </p>
              <button
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}