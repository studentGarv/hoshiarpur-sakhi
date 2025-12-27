'use client';

import { useState, useCallback } from 'react';
import { SearchFilters } from '@/types';

interface DirectoryHeroProps {
  onSearch: (filters: SearchFilters) => void;
  initialQuery?: string;
}

export default function DirectoryHero({ onSearch, initialQuery = '' }: DirectoryHeroProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Real-time search functionality - trigger search on every keystroke
    onSearch({
      query,
      type: 'all',
      location: '',
      facilities: []
    });
  }, [onSearch]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      type: 'all',
      location: '',
      facilities: []
    });
  }, [searchQuery, onSearch]);

  return (
    <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          <span className="text-orange-600">Discover 40+</span>{' '}
          <span className="text-blue-700">Temples & Gurdwaras</span>{' '}
          <span className="text-gray-900">in Hoshiarpur</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore the rich spiritual heritage of Hoshiarpur district with our comprehensive directory 
          of sacred temples and gurdwaras.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search temples, gurdwaras, locations..."
              className="block w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                         bg-white shadow-sm placeholder-gray-500"
              aria-label="Search religious sites"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Submit search"
            >
              <div className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md 
                              transition-colors duration-200 font-medium">
                Search
              </div>
            </button>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">40+</div>
            <div className="text-sm text-gray-600">Sacred Sites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">2</div>
            <div className="text-sm text-gray-600">Religions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600">Access</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">Free</div>
            <div className="text-sm text-gray-600">Information</div>
          </div>
        </div>
      </div>
    </section>
  );
}