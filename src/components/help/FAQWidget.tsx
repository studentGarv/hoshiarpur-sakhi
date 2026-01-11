'use client';

import { useState, useCallback } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'search' | 'navigation' | 'sites' | 'general';
}

const faqData: FAQItem[] = [
  {
    id: 'find-nearest-temple',
    question: 'How do I find the nearest temple?',
    answer: 'Use the search bar to type "temple" or your location, then use the map view to see temples near you. You can also filter by "Temples" in the filter panel.',
    category: 'search'
  },
  {
    id: 'visiting-timings',
    question: 'What are the visiting hours?',
    answer: 'Each site has different timings. Click on any site to view its detailed card which shows weekday and weekend timings. Most temples are open 5 AM - 9 PM, while gurdwaras often have extended hours.',
    category: 'sites'
  },
  {
    id: 'filter-facilities',
    question: 'How do I filter by facilities?',
    answer: 'Use the Filter panel on the left side. Under "Facilities", check the boxes for amenities you need like Parking, Langar Hall, or Accommodation.',
    category: 'search'
  },
  {
    id: 'map-vs-table',
    question: 'How do I switch between map and table view?',
    answer: 'Look for the toggle buttons at the top right of the main content area. Click "Table" for list view or "Map" for geographical view.',
    category: 'navigation'
  },
  {
    id: 'site-details',
    question: 'How do I get more information about a site?',
    answer: 'Click on any site name in the table or click on a map marker. This will open a detailed card with history, facilities, timings, and contact information.',
    category: 'sites'
  },
  {
    id: 'search-tips',
    question: 'How does the search work?',
    answer: 'The search looks through site names, descriptions, locations, and histories. Try searching for "parking", "24 hours", or specific area names like "Dasuya".',
    category: 'search'
  },
  {
    id: 'mobile-usage',
    question: 'Does this work on mobile phones?',
    answer: 'Yes! The site is optimized for mobile devices. All features work on phones and tablets with touch-friendly interfaces.',
    category: 'general'
  },
  {
    id: 'contact-info',
    question: 'How do I get contact information?',
    answer: 'Click on any site to view its detail card. Contact information (phone numbers and emails) are shown at the bottom of the card when available.',
    category: 'sites'
  }
];

const categoryLabels = {
  search: '🔍 Search & Filters',
  navigation: '🧭 Navigation',
  sites: '🏛️ Site Information',
  general: '❓ General'
};

interface FAQWidgetProps {
  className?: string;
}

export default function FAQWidget({ className = '' }: FAQWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Reset state when opening
      setSelectedCategory('all');
      setExpandedFAQ(null);
    }
  }, [isExpanded]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setExpandedFAQ(null); // Close any open FAQ when changing category
  }, []);

  const handleFAQToggle = useCallback((faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  }, [expandedFAQ]);

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Floating Widget Button */}
      {!isExpanded && (
        <button
          onClick={handleToggleExpanded}
          className="bg-saffron-600 hover:bg-saffron-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          aria-label="Open help"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Need Help? 💬</span>
        </button>
      )}

      {/* Expanded FAQ Interface */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-saffron-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-saffron-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-gray-900">Help & FAQ</h3>
            </div>
            <button
              onClick={handleToggleExpanded}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close help"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Filter */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-saffron-100 text-saffron-700 border border-saffron-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-saffron-100 text-saffron-700 border border-saffron-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredFAQs.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">No FAQs found for this category.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-md">
                  <button
                    onClick={() => handleFAQToggle(faq.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-900 pr-2">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        expandedFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-3 pb-3">
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Still need help? Try using the search and filter options above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}