/**
 * Property-based tests for database search functionality
 * Feature: hoshiarpur-sakhi
 */

import * as fc from 'fast-check';
import { filterSites, searchSites } from '../database';
import { SearchFilters } from '@/types';

describe('Database Search Property Tests', () => {
  /**
   * Property 7: Search Term Matching
   * For any search query, all returned results should contain the search terms 
   * in either the site name, location, or description fields
   * **Validates: Requirements 3.2**
   */
  test('Property 7: Search Term Matching', () => {
    // Feature: hoshiarpur-sakhi, Property 7: Search Term Matching
    fc.assert(
      fc.property(
        // Generate non-empty search queries with reasonable length
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        (searchQuery) => {
          const trimmedQuery = searchQuery.trim().toLowerCase();
          
          // Test the searchSites function
          const searchResults = searchSites(searchQuery);
          
          // Every result should contain the search term in one of the searchable fields
          const allResultsMatch = searchResults.every(site => {
            const searchableText = [
              site.name.toLowerCase(),
              site.description.toLowerCase(),
              site.location.address.toLowerCase(),
              site.location.city.toLowerCase(),
              site.history.toLowerCase()
            ].join(' ');
            
            return searchableText.includes(trimmedQuery);
          });
          
          return allResultsMatch;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test for filterSites function with search query
   * This ensures the comprehensive filtering function also respects search term matching
   */
  test('Property 7 Extended: Filter Sites Search Term Matching', () => {
    // Feature: hoshiarpur-sakhi, Property 7: Filter Sites Search Term Matching
    fc.assert(
      fc.property(
        // Generate search filters with query
        fc.record({
          query: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          type: fc.constantFrom('all', 'temple', 'gurdwara'),
          location: fc.string({ maxLength: 30 }),
          facilities: fc.array(fc.string({ maxLength: 20 }), { maxLength: 5 })
        }),
        (filters: SearchFilters) => {
          const trimmedQuery = filters.query.trim().toLowerCase();
          
          // Test the filterSites function
          const filterResults = filterSites(filters);
          
          // Every result should contain the search term in one of the searchable fields
          const allResultsMatch = filterResults.every(site => {
            const searchableText = [
              site.name.toLowerCase(),
              site.description.toLowerCase(),
              site.location.address.toLowerCase(),
              site.location.city.toLowerCase(),
              site.history.toLowerCase()
            ].join(' ');
            
            return searchableText.includes(trimmedQuery);
          });
          
          return allResultsMatch;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test for empty search queries
   * Empty or whitespace-only queries should return all sites
   */
  test('Property 7 Edge Case: Empty Search Queries', () => {
    // Feature: hoshiarpur-sakhi, Property 7: Empty Search Queries
    fc.assert(
      fc.property(
        // Generate whitespace-only strings
        fc.string().filter(s => s.trim().length === 0),
        (emptyQuery) => {
          const searchResults = searchSites(emptyQuery);
          const filterResults = filterSites({ query: emptyQuery, type: 'all', location: '', facilities: [] });
          
          // Both should return all sites when query is empty/whitespace
          // We can't know the exact count without loading the database, but both should return the same count
          return searchResults.length === filterResults.length;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 3: Filter Functionality
   * For any combination of valid filters (type, location, facilities), 
   * the search results should contain only sites that match all applied filter criteria
   * **Validates: Requirements 1.5, 3.3**
   */
  test('Property 3: Filter Functionality', () => {
    // Feature: hoshiarpur-sakhi, Property 3: Filter Functionality
    fc.assert(
      fc.property(
        // Generate valid filter combinations
        fc.record({
          query: fc.string({ maxLength: 30 }),
          type: fc.constantFrom('all', 'temple', 'gurdwara'),
          location: fc.string({ maxLength: 20 }),
          facilities: fc.array(fc.string({ maxLength: 15 }), { maxLength: 3 })
        }),
        (filters: SearchFilters) => {
          const results = filterSites(filters);
          
          // Every result should match all applied filter criteria
          return results.every(site => {
            // Check type filter
            if (filters.type !== 'all' && site.type !== filters.type) {
              return false;
            }
            
            // Check location filter
            if (filters.location && filters.location.trim()) {
              const locationTerm = filters.location.toLowerCase();
              const matchesLocation = 
                site.location.city.toLowerCase().includes(locationTerm) ||
                site.location.address.toLowerCase().includes(locationTerm);
              if (!matchesLocation) {
                return false;
              }
            }
            
            // Check facilities filter
            if (filters.facilities && filters.facilities.length > 0) {
              const matchesAllFacilities = filters.facilities.every(facility => 
                site.facilities.some(siteFacility => 
                  siteFacility.toLowerCase().includes(facility.toLowerCase())
                )
              );
              if (!matchesAllFacilities) {
                return false;
              }
            }
            
            // Check search query filter
            if (filters.query && filters.query.trim()) {
              const searchTerm = filters.query.toLowerCase();
              const searchableText = [
                site.name.toLowerCase(),
                site.description.toLowerCase(),
                site.location.address.toLowerCase(),
                site.location.city.toLowerCase(),
                site.history.toLowerCase()
              ].join(' ');
              
              if (!searchableText.includes(searchTerm)) {
                return false;
              }
            }
            
            return true;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test for type filter consistency
   * When filtering by type, all results should be of that type
   */
  test('Property 3 Extended: Type Filter Consistency', () => {
    // Feature: hoshiarpur-sakhi, Property 3: Type Filter Consistency
    fc.assert(
      fc.property(
        fc.constantFrom('temple', 'gurdwara'),
        (siteType: 'temple' | 'gurdwara') => {
          const results = filterSites({ 
            query: '', 
            type: siteType, 
            location: '', 
            facilities: [] 
          });
          
          // All results should be of the specified type
          return results.every(site => site.type === siteType);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property test for facilities filter logic
   * When filtering by facilities, all results should have ALL specified facilities
   */
  test('Property 3 Extended: Facilities Filter Logic', () => {
    // Feature: hoshiarpur-sakhi, Property 3: Facilities Filter Logic
    fc.assert(
      fc.property(
        // Generate realistic facility names that might exist in the database
        fc.array(
          fc.constantFrom('Parking', 'Restroom', 'Wheelchair Access', 'Food', 'Library', 'Hall'), 
          { minLength: 1, maxLength: 2 }
        ),
        (facilities: string[]) => {
          const results = filterSites({ 
            query: '', 
            type: 'all', 
            location: '', 
            facilities 
          });
          
          // All results should have ALL specified facilities
          return results.every(site => 
            facilities.every(facility => 
              site.facilities.some(siteFacility => 
                siteFacility.toLowerCase().includes(facility.toLowerCase())
              )
            )
          );
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 8: Search Term Highlighting
   * For any search query that returns results, the matching terms should be 
   * visually highlighted in the displayed results
   * **Validates: Requirements 3.5**
   * 
   * Note: This test validates the highlighting logic that should be implemented
   * in the UI components. Currently testing the underlying logic that would
   * support highlighting functionality.
   */
  test('Property 8: Search Term Highlighting', () => {
    // Feature: hoshiarpur-sakhi, Property 8: Search Term Highlighting
    fc.assert(
      fc.property(
        // Generate non-empty search queries
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        (searchQuery) => {
          const trimmedQuery = searchQuery.trim().toLowerCase();
          const results = searchSites(searchQuery);
          
          // For each result, verify that the search term appears in searchable content
          // This validates that the data is available for highlighting
          return results.every(site => {
            const searchableFields = [
              site.name,
              site.description,
              site.location.address,
              site.location.city,
              site.history
            ];
            
            // At least one field should contain the search term (case-insensitive)
            const hasMatchingField = searchableFields.some(field => 
              field.toLowerCase().includes(trimmedQuery)
            );
            
            // Additionally, verify that we can identify which fields contain matches
            // This simulates what a highlighting function would need to do
            if (hasMatchingField) {
              const matchingFields = searchableFields.filter(field => 
                field.toLowerCase().includes(trimmedQuery)
              );
              
              // Should have at least one matching field
              return matchingFields.length > 0;
            }
            
            return hasMatchingField;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test for search term position identification
   * This validates that we can identify where search terms appear in text,
   * which is essential for highlighting functionality
   */
  test('Property 8 Extended: Search Term Position Identification', () => {
    // Feature: hoshiarpur-sakhi, Property 8: Search Term Position Identification
    fc.assert(
      fc.property(
        // Generate search queries that we know exist in the database
        fc.constantFrom('temple', 'gurdwara', 'hoshiarpur', 'parking', 'hall'),
        (searchTerm) => {
          const results = searchSites(searchTerm);
          
          // For each result, verify we can identify term positions
          return results.every(site => {
            const searchableText = [
              site.name,
              site.description,
              site.location.address,
              site.location.city,
              site.history
            ].join(' ').toLowerCase();
            
            const termLower = searchTerm.toLowerCase();
            const position = searchableText.indexOf(termLower);
            
            // Should be able to find the term position (needed for highlighting)
            return position >= 0;
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property test for multiple search terms highlighting
   * When searching with multiple words, each word should be identifiable for highlighting
   */
  test('Property 8 Extended: Multiple Search Terms', () => {
    // Feature: hoshiarpur-sakhi, Property 8: Multiple Search Terms
    fc.assert(
      fc.property(
        // Generate multi-word search queries
        fc.array(
          fc.constantFrom('temple', 'gurdwara', 'parking', 'hall', 'food'),
          { minLength: 2, maxLength: 3 }
        ).map(words => words.join(' ')),
        (multiWordQuery) => {
          const results = searchSites(multiWordQuery);
          const searchTerms = multiWordQuery.toLowerCase().split(' ').filter(term => term.length > 0);
          
          // Each result should contain at least one of the search terms
          return results.every(site => {
            const searchableText = [
              site.name,
              site.description,
              site.location.address,
              site.location.city,
              site.history
            ].join(' ').toLowerCase();
            
            // At least one search term should be found
            return searchTerms.some(term => searchableText.includes(term));
          });
        }
      ),
      { numRuns: 30 }
    );
  });
});