'use client';

import { useState, useCallback, useEffect } from 'react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string; // Optional action text
}

const guideSteps: GuideStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to HoshiarpurSakhi! 🙏',
    description: 'Let us show you how to explore 40+ temples and gurdwaras in Hoshiarpur district. This quick tour will help you get started.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'search',
    title: 'Search for Sites 🔍',
    description: 'Use this search bar to find temples, gurdwaras, or locations. Try typing "temple" or "parking" to see suggestions.',
    target: 'input[placeholder*="Search temples"]',
    position: 'bottom',
    action: 'Try searching for "temple"'
  },
  {
    id: 'quick-filters',
    title: 'Quick Filter Buttons ⚡',
    description: 'Use these quick filter buttons for common searches like "Temples near me" or "Sites with parking".',
    target: 'button:contains("Temples near me")',
    position: 'top',
    action: 'Click any button to try it'
  },
  {
    id: 'filters',
    title: 'Advanced Filters 🎛️',
    description: 'Use the filter panel to narrow down results by site type, location, or facilities like parking and accommodation.',
    target: '[class*="filter"]',
    position: 'right',
    action: 'Try selecting "Temple" or "Gurdwara"'
  },
  {
    id: 'view-toggle',
    title: 'Switch Views 🗺️',
    description: 'Toggle between table view (list) and map view to see sites geographically. Both views show the same filtered results.',
    target: 'button:contains("Table"), button:contains("Map")',
    position: 'bottom',
    action: 'Click "Map" to see sites on a map'
  },
  {
    id: 'site-details',
    title: 'View Site Details 📋',
    description: 'Click on any site name or map marker to see detailed information including history, timings, facilities, and contact info.',
    target: '[class*="site"], [class*="marker"]',
    position: 'top',
    action: 'Click any site to see details'
  },
  {
    id: 'help',
    title: 'Get Help Anytime 💬',
    description: 'Need help? Click the "Need Help?" button in the bottom-right corner for FAQs and quick answers.',
    target: 'button:contains("Need Help")',
    position: 'left',
    action: 'Click to open help anytime'
  }
];

interface InteractiveGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function InteractiveGuide({ isOpen, onClose, onComplete }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tour completed
      onComplete();
      onClose();
    }
  }, [currentStep, onComplete, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  const currentStepData = guideSteps[currentStep];

  if (!isVisible || !currentStepData) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Guide Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-saffron-100 rounded-full flex items-center justify-center">
                <span className="text-saffron-600 font-semibold text-sm">
                  {currentStep + 1}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Interactive Guide</h3>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close guide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {currentStepData.title}
            </h4>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {currentStepData.description}
            </p>
            
            {currentStepData.action && (
              <div className="bg-saffron-50 border border-saffron-200 rounded-md p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-saffron-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-saffron-800">Try it:</span>
                </div>
                <p className="text-sm text-saffron-700 mt-1">{currentStepData.action}</p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Step {currentStep + 1} of {guideSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / guideSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-saffron-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-saffron-600 rounded-md hover:bg-saffron-700 transition-colors duration-200"
              >
                {currentStep === guideSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for managing guide state
export function useInteractiveGuide() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide before
    const hasSeenGuideBefore = localStorage.getItem('hoshiarpur-sakhi-guide-seen');
    if (hasSeenGuideBefore) {
      setHasSeenGuide(true);
    } else {
      // Show guide automatically for first-time users after a short delay
      const timer = setTimeout(() => {
        setIsGuideOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const openGuide = useCallback(() => {
    setIsGuideOpen(true);
  }, []);

  const closeGuide = useCallback(() => {
    setIsGuideOpen(false);
  }, []);

  const completeGuide = useCallback(() => {
    setHasSeenGuide(true);
    localStorage.setItem('hoshiarpur-sakhi-guide-seen', 'true');
  }, []);

  return {
    isGuideOpen,
    hasSeenGuide,
    openGuide,
    closeGuide,
    completeGuide
  };
}