'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchFilters } from '@/types';
import { getDatabaseStats, getUniqueLocations } from '@/utils/database';

interface FilterPanelProps {
  onFiltersChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
  className?: string;
}

export default function FilterPanel({ onFiltersChange, currentFilters, className = '' }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableFacilities, setAvailableFacilities] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  // Load available filter options
  useEffect(() => {
    try {
      const stats = getDatabaseStats();
      setAvailableFacilities(stats.uniqueFacilities);
      
      // Get unique locations from the database
      const locations = getUniqueLocations();
      setAvailableLocations(locations);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  }, []);

  const handleTypeChange = useCallback((type: 'all' | 'temple' | 'gurdwara') => {
    const newFilters = { ...currentFilters, type };
    onFiltersChange(newFilters);
  }, [currentFilters, onFiltersChange]);

  const handleLocationChange = useCallback((location: string) => {
    const newFilters = { ...currentFilters, location };
    onFiltersChange(newFilters);
  }, [currentFilters, onFiltersChange]);

  const handleFacilityToggle = useCallback((facility: string) => {
    const currentFacilities = currentFilters.facilities;
    const newFacilities = currentFacilities.includes(facility)
      ? currentFacilities.filter(f => f !== facility)
      : [...currentFacilities, facility];
    
    const newFilters = { ...currentFilters, facilities: newFacilities };
    onFiltersChange(newFilters);
  }, [currentFilters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      query: currentFilters.query, // Keep the search query
      type: 'all',
      location: '',
      facilities: []
    };
    onFiltersChange(clearedFilters);
  }, [currentFilters.query, onFiltersChange]);

  const hasActiveFilters = currentFilters.type !== 'all' || 
                          currentFilters.location !== '' || 
                          currentFilters.facilities.length > 0;

  const activeFilterCount = (currentFilters.type !== 'all' ? 1 : 0) +
                           (currentFilters.location !== '' ? 1 : 0) +
                           currentFilters.facilities.length;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-saffron-100 text-saffron-800">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              <svg 
                className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-6">
          {/* Site Type Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Site Type</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Sites', icon: '🏛️' },
                { value: 'temple', label: 'Temples', icon: '🛕' },
                { value: 'gurdwara', label: 'Gurdwaras', icon: '🏛️' }
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="siteType"
                    value={option.value}
                    checked={currentFilters.type === option.value}
                    onChange={() => handleTypeChange(option.value as 'all' | 'temple' | 'gurdwara')}
                    className="w-4 h-4 text-saffron-600 border-gray-300 focus:ring-saffron-500 focus:ring-2"
                  />
                  <span className="ml-3 flex items-center space-x-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-150">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
            <select
              value={currentFilters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-saffron-500 focus:border-saffron-500 text-sm"
            >
              <option value="">All Locations</option>
              {availableLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Facilities Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Facilities</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFacilities.map((facility) => (
                <label key={facility} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentFilters.facilities.includes(facility)}
                    onChange={() => handleFacilityToggle(facility)}
                    className="w-4 h-4 text-saffron-600 border-gray-300 rounded focus:ring-saffron-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-150">
                    {facility}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}