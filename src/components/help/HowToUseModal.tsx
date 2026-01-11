'use client';

import { useCallback } from 'react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGuide?: () => void;
}

const features = [
  {
    icon: '🔍',
    title: 'Smart Search',
    description: 'Search by name, location, or facilities. Get suggestions as you type and use quick filter buttons for common searches.',
    tips: ['Try "temple parking" or "gurdwara accommodation"', 'Use the suggestions dropdown for popular searches', 'Search history is saved for quick access']
  },
  {
    icon: '🎛️',
    title: 'Advanced Filters',
    description: 'Filter by site type (temple/gurdwara), location, and available facilities to find exactly what you need.',
    tips: ['Combine multiple filters for precise results', 'Clear all filters to see all sites', 'Filters work in both table and map views']
  },
  {
    icon: '🗺️',
    title: 'Interactive Map',
    description: 'Switch between table and map views. See sites geographically with clustering and custom icons.',
    tips: ['Click markers for quick info popups', 'Use map controls to reset or center on selected sites', 'Zoom in to see individual sites clearly']
  },
  {
    icon: '📋',
    title: 'Detailed Information',
    description: 'Click any site to see comprehensive details including history, timings, facilities, and contact information.',
    tips: ['Each site shows visiting hours and special timings', 'Contact information includes phone and email when available', 'History section provides cultural context']
  },
  {
    icon: '📱',
    title: 'Mobile Optimized',
    description: 'Fully responsive design works perfectly on phones and tablets with touch-friendly interfaces.',
    tips: ['Swipe through site cards on mobile', 'Touch-friendly buttons and controls', 'Optimized for slow internet connections']
  },
  {
    icon: '💬',
    title: 'Help & Support',
    description: 'Get instant help with FAQs, categorized by topic, and contextual tooltips throughout the interface.',
    tips: ['FAQ widget is always available in bottom-right', 'Search FAQs by category', 'Take the interactive tour anytime']
  }
];

export default function HowToUseModal({ isOpen, onClose, onStartGuide }: HowToUseModalProps) {
  const handleStartGuide = useCallback(() => {
    onClose();
    if (onStartGuide) {
      onStartGuide();
    }
  }, [onClose, onStartGuide]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-saffron-50 to-spiritual-blue-light px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">How to Use HoshiarpurSakhi</h2>
                <p className="text-gray-600 mt-1">Your guide to exploring religious sites in Hoshiarpur</p>
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
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6">
              {/* Quick Start Section */}
              <div className="mb-8 p-4 bg-saffron-50 border border-saffron-200 rounded-lg">
                <h3 className="text-lg font-semibold text-saffron-900 mb-2 flex items-center">
                  <span className="mr-2">🚀</span>
                  Quick Start
                </h3>
                <p className="text-saffron-800 mb-3">
                  New to HoshiarpurSakhi? Take our interactive tour to learn all the features in just 2 minutes!
                </p>
                <button
                  onClick={handleStartGuide}
                  className="bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Start Interactive Tour
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tips:</div>
                          {feature.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-saffron-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-xs text-gray-600">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Help Section */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Need More Help?
                </h3>
                <div className="text-blue-800 space-y-2 text-sm">
                  <p>• Click the "Need Help? 💬" button anytime for instant FAQ access</p>
                  <p>• Use the search suggestions for popular queries</p>
                  <p>• Try the quick filter buttons for common searches</p>
                  <p>• Switch between table and map views to find sites your way</p>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">⌨️</span>
                  Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Focus search</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Close modal</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Esc</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toggle view</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl + M</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open help</span>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">?</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Explore 40+ temples and gurdwaras with confidence
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleStartGuide}
                  className="px-4 py-2 text-sm font-medium text-saffron-600 bg-saffron-100 rounded-md hover:bg-saffron-200 transition-colors duration-200"
                >
                  Take Tour
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}