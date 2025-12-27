import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '../FilterPanel';
import { SearchFilters } from '@/types';

// Mock the database utilities
jest.mock('@/utils/database', () => ({
  getDatabaseStats: jest.fn(() => ({
    uniqueFacilities: ['Langar Hall', 'Parking', 'Library', 'Medical Aid']
  })),
  getUniqueLocations: jest.fn(() => ['Hoshiarpur', 'Dasuya', 'Mukerian'])
}));

describe('FilterPanel', () => {
  const mockOnFiltersChange = jest.fn();
  const defaultFilters: SearchFilters = {
    query: '',
    type: 'all',
    location: '',
    facilities: []
  };

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
  });

  it('should render filter options', () => {
    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={defaultFilters}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Site Type')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Facilities')).toBeInTheDocument();
  });

  it('should show site type options', () => {
    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={defaultFilters}
      />
    );

    expect(screen.getByText('All Sites')).toBeInTheDocument();
    expect(screen.getByText('Temples')).toBeInTheDocument();
    expect(screen.getByText('Gurdwaras')).toBeInTheDocument();
  });

  it('should call onFiltersChange when site type is changed', () => {
    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={defaultFilters}
      />
    );

    const templeRadio = screen.getByDisplayValue('temple');
    fireEvent.click(templeRadio);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      type: 'temple'
    });
  });

  it('should call onFiltersChange when location is changed', () => {
    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={defaultFilters}
      />
    );

    const locationSelect = screen.getByDisplayValue('All Locations');
    fireEvent.change(locationSelect, { target: { value: 'Hoshiarpur' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      location: 'Hoshiarpur'
    });
  });

  it('should show active filter count', () => {
    const filtersWithActive: SearchFilters = {
      query: '',
      type: 'temple',
      location: 'Hoshiarpur',
      facilities: ['Parking']
    };

    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={filtersWithActive}
      />
    );

    expect(screen.getByText('3 active')).toBeInTheDocument();
  });

  it('should show clear all button when filters are active', () => {
    const filtersWithActive: SearchFilters = {
      query: '',
      type: 'temple',
      location: '',
      facilities: []
    };

    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={filtersWithActive}
      />
    );

    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('should clear filters when clear all is clicked', () => {
    const filtersWithActive: SearchFilters = {
      query: 'test',
      type: 'temple',
      location: 'Hoshiarpur',
      facilities: ['Parking']
    };

    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={filtersWithActive}
      />
    );

    const clearButton = screen.getByText('Clear all');
    fireEvent.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      query: 'test', // Should keep the search query
      type: 'all',
      location: '',
      facilities: []
    });
  });

  it('should handle facility toggle', () => {
    render(
      <FilterPanel 
        onFiltersChange={mockOnFiltersChange}
        currentFilters={defaultFilters}
      />
    );

    // Wait for facilities to load and then click on one
    const parkingCheckbox = screen.getByRole('checkbox', { name: /parking/i });
    fireEvent.click(parkingCheckbox);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      facilities: ['Parking']
    });
  });
});