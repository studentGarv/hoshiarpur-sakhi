import { ReligiousSite } from '@/types';

/**
 * Validates that a religious site has all required fields
 * Requirements: 7.2, 7.5
 */
export function validateReligiousSite(site: Partial<ReligiousSite>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required string fields
  if (!site.id || site.id.trim() === '') {
    errors.push('Site ID is required');
  }

  if (!site.name || site.name.trim() === '') {
    errors.push('Site name is required');
  }

  if (!site.type || !['temple', 'gurdwara'].includes(site.type)) {
    errors.push('Site type must be either "temple" or "gurdwara"');
  }

  if (!site.description || site.description.trim() === '') {
    errors.push('Site description is required');
  }

  if (!site.history || site.history.trim() === '') {
    errors.push('Site history is required');
  }

  // Check location object
  if (!site.location) {
    errors.push('Location information is required');
  } else {
    if (!site.location.address || site.location.address.trim() === '') {
      errors.push('Location address is required');
    }

    if (!site.location.city || site.location.city.trim() === '') {
      errors.push('Location city is required');
    }

    if (!site.location.coordinates) {
      errors.push('Location coordinates are required');
    } else {
      if (typeof site.location.coordinates.lat !== 'number') {
        errors.push('Location latitude must be a number');
      }

      if (typeof site.location.coordinates.lng !== 'number') {
        errors.push('Location longitude must be a number');
      }
    }
  }

  // Check timings object
  if (!site.timings) {
    errors.push('Timings information is required');
  } else {
    if (!site.timings.weekdays || site.timings.weekdays.trim() === '') {
      errors.push('Weekday timings are required');
    }

    if (!site.timings.weekends || site.timings.weekends.trim() === '') {
      errors.push('Weekend timings are required');
    }
  }

  // Check facilities array
  if (!site.facilities || !Array.isArray(site.facilities)) {
    errors.push('Facilities must be provided as an array');
  } else if (site.facilities.length === 0) {
    errors.push('At least one facility must be specified');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that all sites in a collection have complete required fields
 * Requirements: 7.2
 */
export function validateSiteCollection(sites: Partial<ReligiousSite>[]): {
  isValid: boolean;
  invalidSites: Array<{ index: number; errors: string[] }>;
} {
  const invalidSites: Array<{ index: number; errors: string[] }> = [];

  sites.forEach((site, index) => {
    const validation = validateReligiousSite(site);
    if (!validation.isValid) {
      invalidSites.push({
        index,
        errors: validation.errors,
      });
    }
  });

  return {
    isValid: invalidSites.length === 0,
    invalidSites,
  };
}
/**
 * Validates coordinate values are within valid ranges
 * Requirements: 7.5
 */
export function validateCoordinates(lat: number, lng: number): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate latitude range (-90 to 90)
  if (lat < -90 || lat > 90) {
    errors.push('Latitude must be between -90 and 90 degrees');
  }

  // Validate longitude range (-180 to 180)
  if (lng < -180 || lng > 180) {
    errors.push('Longitude must be between -180 and 180 degrees');
  }

  // Check for reasonable coordinates for Punjab region
  // Punjab is approximately between 29.5°N to 32.5°N and 74°E to 77°E
  if (lat < 29.0 || lat > 33.0) {
    errors.push('Latitude appears to be outside Punjab region (29°N - 33°N)');
  }

  if (lng < 73.0 || lng > 78.0) {
    errors.push('Longitude appears to be outside Punjab region (73°E - 78°E)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that site ID follows the expected format
 * Requirements: 7.5
 */
export function validateSiteId(id: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!id || id.trim() === '') {
    errors.push('Site ID cannot be empty');
    return { isValid: false, errors };
  }

  // Check for valid format: type-name-location (kebab-case)
  const idPattern = /^(temple|gurdwara)-[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!idPattern.test(id)) {
    errors.push('Site ID must follow format: "temple-" or "gurdwara-" followed by kebab-case name');
  }

  // Check length constraints
  if (id.length < 5) {
    errors.push('Site ID must be at least 5 characters long');
  }

  if (id.length > 100) {
    errors.push('Site ID must not exceed 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates timing format strings
 * Requirements: 7.5
 */
export function validateTimings(timings: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!timings || timings.trim() === '') {
    errors.push('Timings cannot be empty');
    return { isValid: false, errors };
  }

  // Check for basic time format patterns
  const timePattern = /\d{1,2}:\d{2}\s*(AM|PM)/i;
  const rangePattern = /\d{1,2}:\d{2}\s*(AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)/i;

  if (!timePattern.test(timings) && !rangePattern.test(timings) && !timings.toLowerCase().includes('hours')) {
    errors.push('Timings must include valid time format (e.g., "9:00 AM - 6:00 PM" or "24 hours")');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates that facilities array contains meaningful values
 * Requirements: 7.5
 */
export function validateFacilities(facilities: string[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!facilities || !Array.isArray(facilities)) {
    errors.push('Facilities must be provided as an array');
    return { isValid: false, errors };
  }

  if (facilities.length === 0) {
    errors.push('At least one facility must be specified');
    return { isValid: false, errors };
  }

  // Check for empty or invalid facility entries
  facilities.forEach((facility, index) => {
    if (!facility || typeof facility !== 'string' || facility.trim() === '') {
      errors.push(`Facility at index ${index} is empty or invalid`);
    }
  });

  // Check for reasonable facility names
  const validFacilities = [
    'Langar Hall', 'Parking', 'Accommodation', 'Library', 'Medical Aid',
    'Community Hall', 'Rest Rooms', 'Shoe Stand', 'Drinking Water',
    'Prasad Counter', 'Donation Box', 'Rest Area', 'Study Hall',
    'Prayer Hall', 'Educational Center', 'Meditation Hall', 'Satsang Hall'
  ];

  facilities.forEach((facility) => {
    if (facility && !validFacilities.includes(facility)) {
      // This is a warning, not an error - allows for new facilities
      console.warn(`Facility "${facility}" is not in the standard list of recognized facilities`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates phone number format
 * Requirements: 7.5
 */
export function validatePhoneNumber(phone: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!phone || phone.trim() === '') {
    errors.push('Phone number cannot be empty');
    return { isValid: false, errors };
  }

  // Indian phone number format: +91-XXXX-XXXXXX
  const phonePattern = /^\+91-\d{4}-\d{6}$/;
  if (!phonePattern.test(phone)) {
    errors.push('Phone number must follow format: +91-XXXX-XXXXXX');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 * Requirements: 7.5
 */
export function validateEmail(email: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('Email cannot be empty');
    return { isValid: false, errors };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push('Email must be in valid format (e.g., example@domain.com)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Comprehensive validation for a complete religious site
 * Requirements: 7.2, 7.5
 */
export function validateCompleteSite(site: Partial<ReligiousSite>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation first
  const basicValidation = validateReligiousSite(site);
  errors.push(...basicValidation.errors);

  // Additional detailed validations if basic validation passes
  if (basicValidation.isValid) {
    // Validate site ID format
    if (site.id) {
      const idValidation = validateSiteId(site.id);
      errors.push(...idValidation.errors);
    }

    // Validate coordinates
    if (site.location?.coordinates) {
      const coordValidation = validateCoordinates(
        site.location.coordinates.lat,
        site.location.coordinates.lng
      );
      errors.push(...coordValidation.errors);
    }

    // Validate timings
    if (site.timings) {
      if (site.timings.weekdays) {
        const weekdayValidation = validateTimings(site.timings.weekdays);
        errors.push(...weekdayValidation.errors);
      }
      if (site.timings.weekends) {
        const weekendValidation = validateTimings(site.timings.weekends);
        errors.push(...weekendValidation.errors);
      }
    }

    // Validate facilities
    if (site.facilities) {
      const facilitiesValidation = validateFacilities(site.facilities);
      errors.push(...facilitiesValidation.errors);
    }

    // Validate contact information if provided
    if (site.contact) {
      if (site.contact.phone) {
        const phoneValidation = validatePhoneNumber(site.contact.phone);
        errors.push(...phoneValidation.errors);
      }
      if (site.contact.email) {
        const emailValidation = validateEmail(site.contact.email);
        errors.push(...emailValidation.errors);
      }
    }

    // Check for recommended fields (warnings, not errors)
    if (!site.contact || (!site.contact.phone && !site.contact.email)) {
      warnings.push('Contact information (phone or email) is recommended');
    }

    if (!site.images || site.images.length === 0) {
      warnings.push('Images are recommended for better user experience');
    }

    if (site.description && site.description.length < 50) {
      warnings.push('Description should be at least 50 characters for better information');
    }

    if (site.history && site.history.length < 100) {
      warnings.push('History should be at least 100 characters for comprehensive information');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates the entire religious sites database
 * Requirements: 7.1, 7.2, 7.5
 */
export function validateDatabase(data: { sites: Partial<ReligiousSite>[] }): {
  isValid: boolean;
  totalSites: number;
  validSites: number;
  invalidSites: Array<{ index: number; id?: string; errors: string[]; warnings: string[] }>;
  summary: {
    temples: number;
    gurdwaras: number;
    sitesWithContact: number;
    sitesWithImages: number;
  };
} {
  const invalidSites: Array<{ index: number; id?: string; errors: string[]; warnings: string[] }> = [];
  let validSites = 0;
  let temples = 0;
  let gurdwaras = 0;
  let sitesWithContact = 0;
  let sitesWithImages = 0;

  if (!data || !data.sites || !Array.isArray(data.sites)) {
    return {
      isValid: false,
      totalSites: 0,
      validSites: 0,
      invalidSites: [{ index: -1, errors: ['Database structure is invalid - missing sites array'], warnings: [] }],
      summary: { temples: 0, gurdwaras: 0, sitesWithContact: 0, sitesWithImages: 0 },
    };
  }

  data.sites.forEach((site, index) => {
    const validation = validateCompleteSite(site);
    
    if (validation.isValid) {
      validSites++;
      
      // Count site types
      if (site.type === 'temple') temples++;
      if (site.type === 'gurdwara') gurdwaras++;
      
      // Count sites with contact info
      if (site.contact && (site.contact.phone || site.contact.email)) {
        sitesWithContact++;
      }
      
      // Count sites with images
      if (site.images && site.images.length > 0) {
        sitesWithImages++;
      }
    } else {
      invalidSites.push({
        index,
        id: site.id,
        errors: validation.errors,
        warnings: validation.warnings,
      });
    }
  });

  return {
    isValid: invalidSites.length === 0,
    totalSites: data.sites.length,
    validSites,
    invalidSites,
    summary: {
      temples,
      gurdwaras,
      sitesWithContact,
      sitesWithImages,
    },
  };
}