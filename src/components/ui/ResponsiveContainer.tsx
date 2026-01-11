'use client';

import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full'
};

const paddingClasses = {
  none: '',
  sm: 'px-2 sm:px-4',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12'
};

export default function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = '2xl',
  padding = 'md'
}: ResponsiveContainerProps) {
  return (
    <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

// Touch-friendly button component
interface TouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const buttonVariants = {
  primary: 'bg-saffron-600 hover:bg-saffron-700 text-white border-saffron-600',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent'
};

const buttonSizes = {
  sm: 'px-3 py-2 text-sm min-h-touch min-w-touch',
  md: 'px-4 py-3 text-base min-h-touch min-w-touch',
  lg: 'px-6 py-4 text-lg min-h-touch min-w-touch'
};

export function TouchButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}: TouchButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md border
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        touch:active:scale-95 transform transition-transform
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  interactive?: boolean;
}

const cardPadding = {
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8'
};

export function MobileCard({ 
  children, 
  className = '', 
  padding = 'md',
  onClick,
  interactive = false
}: MobileCardProps) {
  const baseClasses = `
    bg-white rounded-lg border border-gray-200 shadow-sm
    ${cardPadding[padding]}
    ${className}
  `;

  const interactiveClasses = interactive ? `
    cursor-pointer transition-all duration-200
    hover:shadow-md hover:border-gray-300
    touch:active:scale-98 transform
    focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2
  ` : '';

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses} w-full text-left`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${baseClasses} ${interactive ? interactiveClasses : ''}`}>
      {children}
    </div>
  );
}