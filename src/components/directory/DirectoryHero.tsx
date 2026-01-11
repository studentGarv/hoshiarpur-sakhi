'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchFilters } from '@/types';
import { searchSites } from '@/utils/database';

interface DirectoryHeroProps {
  onSearch: (filters: SearchFilters) => void;
  initialQuery?: string;
}

// Popular search suggestions
const popularSearches = [
  'Temples with parking',
  'Gurdwaras with langar',
  '24 hours open',
  'Sites in Hoshiarpur city',
  'Temples near Dasuya',
  'Gurdwaras with accommodation'
];

// Quick filter suggestions
const quickFilters = [
  { label: 'Temples near me', filters: { query: '', type: 'temple' as const, location: 'Hoshiarpur', facilities: [] } },
  { label: 'Gurdwaras with parking', filters: { query: '', type: 'gurdwara' as const, location: '', facilities: ['Parking'] } },
  { label: 'Sites with accommodation', filters: { query: '', type: 'all' as const, location: '', facilities: ['Accommodation'] } },
  { label: 'Open 24 hours', filters: { query: '24 hours', type: 'all' as const, location: '', facilities: [] } }
];

export default function DirectoryHero({ onSearch, initialQuery = '' }: DirectoryHeroProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('hoshiarpur-sakhi-search-history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // Generate suggestions based on query
  const generateSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      // Show popular searches and history when no query
      const combined = Array.from(new Set([...searchHistory.slice(0, 3), ...popularSearches.slice(0, 5)]));
      return combined.slice(0, 6);
    }

    const queryLower = query.toLowerCase();
    const suggestions: string[] = [];

    // Add matching search history
    const matchingHistory = searchHistory.filter(item => 
      item.toLowerCase().includes(queryLower)
    ).slice(0, 2);
    suggestions.push(...matchingHistory);

    // Add matching popular searches
    const matchingPopular = popularSearches.filter(item => 
      item.toLowerCase().includes(queryLower) && !suggestions.includes(item)
    ).slice(0, 3);
    suggestions.push(...matchingPopular);

    // Add site name suggestions from database
    try {
      const sites = searchSites(query);
      const siteNames = sites.slice(0, 3).map(site => site.name);
      siteNames.forEach(name => {
        if (!suggestions.includes(name)) {
          suggestions.push(name);
        }
      });
    } catch (error) {
      console.error('Failed to get site suggestions:', error);
    }

    return suggestions.slice(0, 6);
  }, [searchHistory]);

  // Handle input change with suggestions
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Generate and show suggestions
    const newSuggestions = generateSuggestions(query);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
    
    // Real-time search functionality - trigger search on every keystroke
    onSearch({
      query,
      type: 'all',
      location: '',
      facilities: []
    });
  }, [onSearch, generateSuggestions]);

  // Handle search submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('hoshiarpur-sakhi-search-history', JSON.stringify(newHistory));
    }

    setShowSuggestions(false);
    onSearch({
      query: searchQuery,
      type: 'all',
      location: '',
      facilities: []
    });
  }, [searchQuery, onSearch, searchHistory]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Add to search history
    const newHistory = [suggestion, ...searchHistory.filter(item => item !== suggestion)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('hoshiarpur-sakhi-search-history', JSON.stringify(newHistory));

    onSearch({
      query: suggestion,
      type: 'all',
      location: '',
      facilities: []
    });
  }, [onSearch, searchHistory]);

  // Handle quick filter click
  const handleQuickFilterClick = useCallback((filters: SearchFilters) => {
    setSearchQuery(filters.query);
    setShowSuggestions(false);
    onSearch(filters);
  }, [onSearch]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    const newSuggestions = generateSuggestions(searchQuery);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
  }, [searchQuery, generateSuggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="bg-gradient-to-br from-saffron-50 to-spiritual-blue-light py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          <span className="text-saffron-600">Discover 40+</span>{' '}
          <span className="text-spiritual-blue-dark">Temples & Gurdwaras</span>{' '}
          <span className="text-gray-900">in Hoshiarpur</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore the rich spiritual heritage of Hoshiarpur district with our comprehensive directory 
          of sacred temples and gurdwaras.
        </p>

        {/* Search Bar with Suggestions */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
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
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              placeholder="Search temples, gurdwaras, locations..."
              className="block w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 
                         bg-white shadow-sm placeholder-gray-500"
              aria-label="Search religious sites"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Submit search"
            >
              <div className="bg-saffron-600 hover:bg-saffron-700 text-white px-6 py-2 rounded-md 
                              transition-colors duration-200 font-medium">
                Search
              </div>
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
            >
              {suggestions.length > 0 && (
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-2 py-1 font-medium">
                    {searchQuery.trim() ? 'Suggestions' : 'Popular Searches'}
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors duration-150 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Quick Filter Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleQuickFilterClick(filter.filters)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 shadow-sm"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-saffron-600">40+</div>
            <div className="text-sm text-gray-600">Sacred Sites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-spiritual-blue">2</div>
            <div className="text-sm text-gray-600">Religions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-spiritual-gold-dark">24/7</div>
            <div className="text-sm text-gray-600">Access</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-saffron-500">Free</div>
            <div className="text-sm text-gray-600">Information</div>
          </div>
        </div>
      </div>
    </section>
  );
}