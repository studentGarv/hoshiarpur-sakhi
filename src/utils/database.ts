import { ReligiousSite } from '@/types';
import { validateDatabase } from './validation';
import religiousSitesData from '@/data/religious-sites.json';

/**
 * Loads and validates the religious sites database
 * Requirements: 7.1, 7.2, 7.5
 */
export function loadReligiousSitesDatabase(): {
  sites: ReligiousSite[];
  isValid: boolean;
  validationReport: ReturnType<typeof validateDatabase>;
} {
  try {
    // Type assertion for the imported JSON data
    const typedData = religiousSitesData as { sites: ReligiousSite[] };
    
    // Validate the loaded data
    const validationReport = validateDatabase(typedData);
    
    if (!validationReport.isValid) {
      console.error('Database validation failed:', validationReport.invalidSites);
    }

    return {
      sites: typedData.sites,
      isValid: validationReport.isValid,
      validationReport,
    };
  } catch (error) {
    console.error('Failed to load religious sites database:', error);
    return {
      sites: [],
      isValid: false,
      validationReport: {
        isValid: false,
        totalSites: 0,
        validSites: 0,
        invalidSites: [{ index: -1, errors: ['Failed to load database file'], warnings: [] }],
        summary: { temples: 0, gurdwaras: 0, sitesWithContact: 0, sitesWithImages: 0 },
      },
    };
  }
}

/**
 * Gets a religious site by ID
 * Requirements: 7.1
 */
export function getSiteById(id: string): ReligiousSite | null {
  const { sites } = loadReligiousSitesDatabase();
  return sites.find(site => site.id === id) || null;
}

/**
 * Gets all sites of a specific type
 * Requirements: 7.1
 */
export function getSitesByType(type: 'temple' | 'gurdwara'): ReligiousSite[] {
  const { sites } = loadReligiousSitesDatabase();
  return sites.filter(site => site.type === type);
}

/**
 * Gets sites by location/city
 * Requirements: 7.1
 */
export function getSitesByLocation(location: string): ReligiousSite[] {
  const { sites } = loadReligiousSitesDatabase();
  const searchTerm = location.toLowerCase();
  
  return sites.filter(site => 
    site.location.city.toLowerCase().includes(searchTerm) ||
    site.location.address.toLowerCase().includes(searchTerm)
  );
}

/**
 * Searches sites by name, description, or location
 * Requirements: 7.1
 */
export function searchSites(query: string): ReligiousSite[] {
  const { sites } = loadReligiousSitesDatabase();
  const searchTerm = query.toLowerCase();
  
  return sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm) ||
    site.description.toLowerCase().includes(searchTerm) ||
    site.location.address.toLowerCase().includes(searchTerm) ||
    site.location.city.toLowerCase().includes(searchTerm) ||
    site.history.toLowerCase().includes(searchTerm)
  );
}

/**
 * Gets sites with specific facilities
 * Requirements: 7.1
 */
export function getSitesByFacilities(facilities: string[]): ReligiousSite[] {
  const { sites } = loadReligiousSitesDatabase();
  
  return sites.filter(site => 
    facilities.every(facility => 
      site.facilities.some(siteFacility => 
        siteFacility.toLowerCase().includes(facility.toLowerCase())
      )
    )
  );
}

/**
 * Gets database statistics
 * Requirements: 7.2
 */
export function getDatabaseStats(): {
  totalSites: number;
  temples: number;
  gurdwaras: number;
  sitesWithContact: number;
  sitesWithImages: number;
  averageDescriptionLength: number;
  averageHistoryLength: number;
  uniqueFacilities: string[];
} {
  const { sites, validationReport } = loadReligiousSitesDatabase();
  
  const totalDescriptionLength = sites.reduce((sum, site) => sum + site.description.length, 0);
  const totalHistoryLength = sites.reduce((sum, site) => sum + site.history.length, 0);
  
  const allFacilities = sites.flatMap(site => site.facilities);
  const uniqueFacilities = Array.from(new Set(allFacilities)).sort();
  
  return {
    totalSites: validationReport.totalSites,
    temples: validationReport.summary.temples,
    gurdwaras: validationReport.summary.gurdwaras,
    sitesWithContact: validationReport.summary.sitesWithContact,
    sitesWithImages: validationReport.summary.sitesWithImages,
    averageDescriptionLength: Math.round(totalDescriptionLength / sites.length),
    averageHistoryLength: Math.round(totalHistoryLength / sites.length),
    uniqueFacilities,
  };
}

/**
 * Comprehensive filtering function that applies all filter criteria
 * Requirements: 1.5, 3.3
 */
export function filterSites(filters: {
  query?: string;
  type?: 'all' | 'temple' | 'gurdwara';
  location?: string;
  facilities?: string[];
}): ReligiousSite[] {
  const { sites } = loadReligiousSitesDatabase();
  let filteredSites = [...sites];

  // Apply text search filter
  if (filters.query && filters.query.trim()) {
    const searchTerm = filters.query.toLowerCase();
    filteredSites = filteredSites.filter(site => 
      site.name.toLowerCase().includes(searchTerm) ||
      site.description.toLowerCase().includes(searchTerm) ||
      site.location.address.toLowerCase().includes(searchTerm) ||
      site.location.city.toLowerCase().includes(searchTerm) ||
      site.history.toLowerCase().includes(searchTerm)
    );
  }

  // Apply site type filter
  if (filters.type && filters.type !== 'all') {
    filteredSites = filteredSites.filter(site => site.type === filters.type);
  }

  // Apply location filter
  if (filters.location && filters.location.trim()) {
    const locationTerm = filters.location.toLowerCase();
    filteredSites = filteredSites.filter(site => 
      site.location.city.toLowerCase().includes(locationTerm) ||
      site.location.address.toLowerCase().includes(locationTerm)
    );
  }

  // Apply facilities filter
  if (filters.facilities && filters.facilities.length > 0) {
    filteredSites = filteredSites.filter(site => 
      filters.facilities!.every(facility => 
        site.facilities.some(siteFacility => 
          siteFacility.toLowerCase().includes(facility.toLowerCase())
        )
      )
    );
  }

  return filteredSites;
}

/**
 * Gets unique locations from all sites for filter options
 * Requirements: 1.5
 */
export function getUniqueLocations(): string[] {
  const { sites } = loadReligiousSitesDatabase();
  const locations = new Set<string>();
  
  sites.forEach(site => {
    locations.add(site.location.city);
    // Extract area/district from address if it contains common patterns
    const addressParts = site.location.address.split(',');
    if (addressParts.length > 1) {
      const area = addressParts[0].trim();
      if (area && area !== site.location.city) {
        locations.add(area);
      }
    }
  });
  
  return Array.from(locations).sort();
}

/**
 * Validates that the database meets the minimum requirements
 * Requirements: 7.1, 7.2
 */
export function validateDatabaseRequirements(): {
  meetsRequirements: boolean;
  issues: string[];
  stats: ReturnType<typeof getDatabaseStats>;
} {
  const stats = getDatabaseStats();
  const issues: string[] = [];
  
  // Check minimum site count (40+ required)
  if (stats.totalSites < 40) {
    issues.push(`Database contains only ${stats.totalSites} sites, but requires 40+`);
  }
  
  // Check that both temples and gurdwaras are present
  if (stats.temples === 0) {
    issues.push('Database contains no temples');
  }
  
  if (stats.gurdwaras === 0) {
    issues.push('Database contains no gurdwaras');
  }
  
  // Check for reasonable distribution
  const templePercentage = (stats.temples / stats.totalSites) * 100;
  const gurdwaraPercentage = (stats.gurdwaras / stats.totalSites) * 100;
  
  if (templePercentage < 20 || templePercentage > 80) {
    issues.push(`Temple distribution (${templePercentage.toFixed(1)}%) may not be representative`);
  }
  
  if (gurdwaraPercentage < 20 || gurdwaraPercentage > 80) {
    issues.push(`Gurdwara distribution (${gurdwaraPercentage.toFixed(1)}%) may not be representative`);
  }
  
  // Check for adequate contact information
  const contactPercentage = (stats.sitesWithContact / stats.totalSites) * 100;
  if (contactPercentage < 50) {
    issues.push(`Only ${contactPercentage.toFixed(1)}% of sites have contact information`);
  }
  
  // Check for minimum content quality
  if (stats.averageDescriptionLength < 50) {
    issues.push(`Average description length (${stats.averageDescriptionLength}) is too short`);
  }
  
  if (stats.averageHistoryLength < 100) {
    issues.push(`Average history length (${stats.averageHistoryLength}) is too short`);
  }
  
  return {
    meetsRequirements: issues.length === 0,
    issues,
    stats,
  };
}