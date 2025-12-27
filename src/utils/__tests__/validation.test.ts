import { validateReligiousSite, validateSiteCollection } from '../validation';
import { ReligiousSite } from '@/types';

describe('validateReligiousSite', () => {
  const validSite: ReligiousSite = {
    id: 'test-1',
    name: 'Test Temple',
    type: 'temple',
    location: {
      address: '123 Test Street',
      city: 'Hoshiarpur',
      coordinates: {
        lat: 31.5204,
        lng: 75.911,
      },
    },
    description: 'A test temple',
    history: 'Built in test times',
    timings: {
      weekdays: '6:00 AM - 8:00 PM',
      weekends: '5:00 AM - 9:00 PM',
    },
    facilities: ['Parking', 'Prasad'],
  };

  it('should validate a complete religious site', () => {
    const result = validateReligiousSite(validSite);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject site without required fields', () => {
    const invalidSite = {
      id: '',
      name: '',
    };

    const result = validateReligiousSite(invalidSite);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject site with invalid type', () => {
    const invalidSite = {
      ...validSite,
      type: 'invalid' as 'temple' | 'gurdwara',
    };

    const result = validateReligiousSite(invalidSite);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Site type must be either "temple" or "gurdwara"'
    );
  });
});

describe('validateSiteCollection', () => {
  it('should validate collection of valid sites', () => {
    const validSite: ReligiousSite = {
      id: 'test-1',
      name: 'Test Temple',
      type: 'temple',
      location: {
        address: '123 Test Street',
        city: 'Hoshiarpur',
        coordinates: {
          lat: 31.5204,
          lng: 75.911,
        },
      },
      description: 'A test temple',
      history: 'Built in test times',
      timings: {
        weekdays: '6:00 AM - 8:00 PM',
        weekends: '5:00 AM - 9:00 PM',
      },
      facilities: ['Parking', 'Prasad'],
    };

    const result = validateSiteCollection([validSite]);
    expect(result.isValid).toBe(true);
    expect(result.invalidSites).toHaveLength(0);
  });
});
