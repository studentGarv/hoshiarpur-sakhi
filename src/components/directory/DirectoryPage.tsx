'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReligiousSite, SearchFilters } from '@/types';
import { loadReligiousSitesDatabase, filterSites } from '@/utils/database';
import DirectoryHero from './DirectoryHero';
import SiteTable from './SiteTable';
import FilterPanel from './FilterPanel';

export default function DirectoryPage() {
  const [sites, setSites] = useState<ReligiousSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<ReligiousSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    location: '',
    facilities: []
  });

  // Load initial data
  useEffect(() => {
    try {
      const { sites: loadedSites } = loadReligiousSitesDatabase();
      setSites(loadedSites);
      setFilteredSites(loadedSites);
    } catch (error) {
      console.error('Failed to load sites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    if (sites.length > 0) {
      const filtered = filterSites(currentFilters);
      setFilteredSites(filtered);
    }
  }, [currentFilters, sites]);

  // Handle search functionality from hero component
  const handleSearch = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
  }, []);

  // Handle filter changes from filter panel
  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
  }, []);

  // Handle site selection for detail view
  const handleSiteClick = useCallback((site: ReligiousSite) => {
    // For now, just log the selection. Later this will open a detail modal/card
    console.log('Selected site:', site.name);
    // TODO: Implement detail view modal/card in future tasks
  }, []);

  const hasActiveFilters = currentFilters.type !== 'all' || 
                          currentFilters.location !== '' || 
                          currentFilters.facilities.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <DirectoryHero onSearch={handleSearch} initialQuery={currentFilters.query} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel 
              onFiltersChange={handleFiltersChange}
              currentFilters={currentFilters}
              className="mb-6 lg:mb-0 lg:sticky lg:top-8"
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Religious Sites Directory
                  </h2>
                  <p className="text-gray-600">
                    {loading 
                      ? 'Loading sites...' 
                      : `Showing ${filteredSites.length} of ${sites.length} sites`
                    }
                  </p>
                </div>
                
                {/* Active Filters Summary */}
                {hasActiveFilters && !loading && (
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                    <span>Filtered by:</span>
                    {currentFilters.type !== 'all' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentFilters.type === 'temple' ? '🛕 Temples' : '🏛️ Gurdwaras'}
                      </span>
                    )}
                    {currentFilters.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        📍 {currentFilters.location}
                      </span>
                    )}
                    {currentFilters.facilities.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        🏢 {currentFilters.facilities.length} facilities
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* No Results Message */}
              {!loading && filteredSites.length === 0 && sites.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        No sites match your current filters
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Try adjusting your search terms or removing some filters to see more results.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sites Table */}
            <SiteTable 
              sites={filteredSites}
              onSiteClick={handleSiteClick}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}