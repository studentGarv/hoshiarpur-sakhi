import { render, screen, fireEvent } from '@testing-library/react';
import SiteTable from '../SiteTable';
import { ReligiousSite } from '@/types';

const mockSites: ReligiousSite[] = [
  {
    id: 'test-temple-1',
    name: 'Test Temple',
    type: 'temple',
    location: {
      address: 'Test Address',
      city: 'Hoshiarpur',
      coordinates: { lat: 31.5, lng: 75.9 }
    },
    description: 'A test temple',
    history: 'Test history',
    timings: {
      weekdays: '5:00 AM - 9:00 PM',
      weekends: '5:00 AM - 9:00 PM'
    },
    facilities: ['Parking', 'Prasad Counter']
  },
  {
    id: 'test-gurdwara-1',
    name: 'Test Gurdwara',
    type: 'gurdwara',
    location: {
      address: 'Test Gurdwara Address',
      city: 'Hoshiarpur',
      coordinates: { lat: 31.6, lng: 75.8 }
    },
    description: 'A test gurdwara',
    history: 'Test gurdwara history',
    timings: {
      weekdays: '4:00 AM - 10:00 PM',
      weekends: '4:00 AM - 10:00 PM'
    },
    facilities: ['Langar Hall', 'Accommodation']
  }
];

describe('SiteTable', () => {
  const mockOnSiteClick = jest.fn();

  beforeEach(() => {
    mockOnSiteClick.mockClear();
  });

  it('should display sites in the table', () => {
    render(<SiteTable sites={mockSites} onSiteClick={mockOnSiteClick} />);
    
    expect(screen.getAllByText('Test Temple')).toHaveLength(2); // Desktop and mobile views
    expect(screen.getAllByText('Test Gurdwara')).toHaveLength(2); // Desktop and mobile views
  });

  it('should show loading state', () => {
    render(<SiteTable sites={[]} onSiteClick={mockOnSiteClick} loading={true} />);
    
    // Should show loading animation (check for the animate-pulse class)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should show empty state when no sites', () => {
    render(<SiteTable sites={[]} onSiteClick={mockOnSiteClick} loading={false} />);
    
    expect(screen.getByText('No religious sites found')).toBeInTheDocument();
  });

  it('should call onSiteClick when clicking on a site row', () => {
    render(<SiteTable sites={mockSites} onSiteClick={mockOnSiteClick} />);
    
    // Click on the first table row (desktop view)
    const tableRows = screen.getAllByRole('row');
    const firstDataRow = tableRows[1]; // Skip header row
    fireEvent.click(firstDataRow);
    
    expect(mockOnSiteClick).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Gurdwara' // First in sorted order
    }));
  });

  it('should display site information correctly', () => {
    render(<SiteTable sites={mockSites} onSiteClick={mockOnSiteClick} />);
    
    // Check that essential information is displayed
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('5:00 AM - 9:00 PM')).toBeInTheDocument();
    // Check for facilities in desktop view
    expect(screen.getByText('Parking, Prasad Counter')).toBeInTheDocument();
  });

  it('should handle sorting by name', () => {
    render(<SiteTable sites={mockSites} onSiteClick={mockOnSiteClick} />);
    
    const nameHeader = screen.getByText('Name').closest('th');
    fireEvent.click(nameHeader!);
    
    // Should show sort indicator
    expect(screen.getByText('↓')).toBeInTheDocument();
  });
});