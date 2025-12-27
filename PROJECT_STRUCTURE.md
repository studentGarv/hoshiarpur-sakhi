# HoshiarpurSakhi Project Structure

This document outlines the feature-based project structure for the HoshiarpurSakhi web application.

## Directory Structure

```
src/
├── app/                    # Next.js 14 App Router pages
├── components/             # React components organized by feature
│   ├── directory/          # Religious sites directory components
│   ├── map/               # Interactive map components
│   ├── chatbot/           # AI chatbot components
│   └── ui/                # Reusable UI components
├── data/                  # Static data files (JSON)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions and helpers
```

## Key Files

- `src/types/index.ts` - Core TypeScript interfaces for ReligiousSite and related data models
- `src/utils/validation.ts` - Data validation utilities for religious sites
- `src/lib/utils.ts` - Common utility functions (class merging, debounce, etc.)

## Development Setup

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run format` - Format code with Prettier

## Requirements Addressed

- **7.2**: Database structure with comprehensive site information
- **7.5**: Data validation utilities for integrity checking