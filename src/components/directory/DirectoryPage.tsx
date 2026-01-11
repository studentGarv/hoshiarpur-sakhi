'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReligiousSite, SearchFilters } from '@/types';
import { loadReligiousSitesDatabase, filterSites } from '@/utils/database';
import DirectoryHero from './DirectoryHero';
import SiteTable from './SiteTable';
import FilterPanel from './FilterPanel';
import SiteDetailCard from './SiteDetailCard';
import InteractiveMap from '@/components/map/InteractiveMap';
import { FAQWidget, InteractiveGuide, HowToUseModal, useInteractiveGuide } from '@/components/help';
import { ResponsiveContainer, LoadingSpinner } from '@/components/ui';

type ViewMode = 'table' | 'map';

export default function DirectoryPage() {
  const [sites, setSites] = useState<ReligiousSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<ReligiousSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<ReligiousSite | null>(null);
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    location: '',
    facilities: []
  });

  // Interactive guide hook
  const { isGuideOpen, openGuide, closeGuide, completeGuide } = useInteractiveGuide();

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

  // Handle site selection for detail view (works for both table and map)
  const handleSiteClick = useCallback((site: ReligiousSite) => {
    setSelectedSite(site);
    setIsDetailCardOpen(true);
  }, []);

  // Handle closing the detail card
  const handleCloseDetailCard = useCallback(() => {
    setIsDetailCardOpen(false);
    setSelectedSite(null);
  }, []);

  // Handle view mode toggle
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Handle how-to-use modal
  const handleShowHowToUse = useCallback(() => {
    setShowHowToUse(true);
  }, []);

  const handleCloseHowToUse = useCallback(() => {
    setShowHowToUse(false);
  }, []);

  const hasActiveFilters = currentFilters.type !== 'all' || 
                          currentFilters.location !== '' || 
                          currentFilters.facilities.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <DirectoryHero onSearch={handleSearch} initialQuery={currentFilters.query} />
      
      {/* Main Content */}
      <ResponsiveContainer className="py-4 sm:py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel 
              onFiltersChange={handleFiltersChange}
              currentFilters={currentFilters}
              className="mb-4 sm:mb-6 lg:mb-0 lg:sticky lg:top-8"
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Results Summary and View Toggle */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Religious Sites Directory
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {loading 
                      ? 'Loading sites...' 
                      : `Showing ${filteredSites.length} of ${sites.length} sites`
                    }
                  </p>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* How to Use Button */}
                  <button
                    onClick={handleShowHowToUse}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1 min-h-touch"
                    title="How to use this site"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Help</span>
                  </button>

                  <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
                    <button
                      onClick={() => handleViewModeChange('table')}
                      className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 min-h-touch ${
                        viewMode === 'table'
                          ? 'bg-saffron-100 text-saffron-700 border border-saffron-200'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span className="hidden sm:inline">Table</span>
                    </button>
                    <button
                      onClick={() => handleViewModeChange('map')}
                      className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 min-h-touch ${
                        viewMode === 'map'
                          ? 'bg-spiritual-blue-light text-spiritual-blue border border-blue-200'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span className="hidden sm:inline">Map</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Active Filters Summary */}
              {hasActiveFilters && !loading && (
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                  <span className="font-medium">Filtered by:</span>
                  {currentFilters.type !== 'all' && (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {currentFilters.type === 'temple' ? '🛕 Temples' : '🏛️ Gurdwaras'}
                    </span>
                  )}
                  {currentFilters.location && (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      📍 {currentFilters.location}
                    </span>
                  )}
                  {currentFilters.facilities.length > 0 && (
                    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      🏢 {currentFilters.facilities.length} facilities
                    </span>
                  )}
                </div>
              )}

              {/* No Results Message */}
              {!loading && filteredSites.length === 0 && sites.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
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

            {/* Content Area - Table or Map */}
            {viewMode === 'table' ? (
              <SiteTable 
                sites={filteredSites}
                onSiteClick={handleSiteClick}
                loading={loading}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <InteractiveMap 
                  sites={filteredSites}
                  selectedSite={selectedSite}
                  onSiteSelect={handleSiteClick}
                  className="h-64 sm:h-80 md:h-96 lg:h-[600px]"
                />
              </div>
            )}
          </div>
        </div>
      </ResponsiveContainer>

      {/* Site Detail Modal */}
      <SiteDetailCard 
        site={selectedSite}
        isOpen={isDetailCardOpen}
        onClose={handleCloseDetailCard}
      />

      {/* FAQ Help Widget */}
      <FAQWidget />

      {/* Interactive Guide */}
      <InteractiveGuide 
        isOpen={isGuideOpen}
        onClose={closeGuide}
        onComplete={completeGuide}
      />

      {/* How to Use Modal */}
      <HowToUseModal 
        isOpen={showHowToUse}
        onClose={handleCloseHowToUse}
        onStartGuide={openGuide}
      />
    </div>
  );
}