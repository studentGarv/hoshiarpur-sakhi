// Core data types for the HoshiarpurSakhi application

export interface ReligiousSite {
  id: string;
  name: string;
  type: 'temple' | 'gurdwara';
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  history: string;
  timings: {
    weekdays: string;
    weekends: string;
    specialDays?: string;
  };
  facilities: string[];
  contact?: {
    phone?: string;
    email?: string;
  };
  images?: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface SearchFilters {
  query: string;
  type: 'all' | 'temple' | 'gurdwara';
  location: string;
  facilities: string[];
}

// Additional utility types
export type SiteType = ReligiousSite['type'];

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  site: ReligiousSite;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SearchResult {
  sites: ReligiousSite[];
  totalCount: number;
  filters: SearchFilters;
}
