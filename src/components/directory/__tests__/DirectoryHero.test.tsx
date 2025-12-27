import { render, screen, fireEvent } from '@testing-library/react';
import DirectoryHero from '../DirectoryHero';

describe('DirectoryHero', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should display the correct hero text', () => {
    render(<DirectoryHero onSearch={mockOnSearch} />);
    
    // Check for the exact text as specified in requirements 1.1
    expect(screen.getByText('Discover 40+')).toBeInTheDocument();
    expect(screen.getByText('Temples & Gurdwaras')).toBeInTheDocument();
    expect(screen.getByText('in Hoshiarpur')).toBeInTheDocument();
  });

  it('should have a search bar', () => {
    render(<DirectoryHero onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Search temples, gurdwaras, locations...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should call onSearch when typing in search bar', () => {
    render(<DirectoryHero onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Search temples, gurdwaras, locations...');
    fireEvent.change(searchInput, { target: { value: 'temple' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      query: 'temple',
      type: 'all',
      location: '',
      facilities: []
    });
  });

  it('should call onSearch when submitting the form', () => {
    render(<DirectoryHero onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Search temples, gurdwaras, locations...');
    const form = searchInput.closest('form');
    
    fireEvent.change(searchInput, { target: { value: 'gurdwara' } });
    fireEvent.submit(form!);
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      query: 'gurdwara',
      type: 'all',
      location: '',
      facilities: []
    });
  });
});