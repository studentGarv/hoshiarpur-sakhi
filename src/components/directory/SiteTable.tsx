'use client';

import { useState } from 'react';
import { ReligiousSite } from '@/types';
import { LoadingSpinner } from '@/components/ui';

interface SiteTableProps {
  sites: ReligiousSite[];
  onSiteClick: (site: ReligiousSite) => void;
  loading?: boolean;
}

export default function SiteTable({ sites, onSiteClick, loading = false }: SiteTableProps) {
  const [sortField, setSortField] = useState<'name' | 'type' | 'location'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'type' | 'location') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSites = [...sites].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'location':
        aValue = a.location.address;
        bValue = b.location.address;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    const comparison = aValue.localeCompare(bValue);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSiteTypeIcon = (type: 'temple' | 'gurdwara') => {
    return type === 'temple' ? '🛕' : '🏛️';
  };

  const getSiteTypeColor = (type: 'temple' | 'gurdwara') => {
    return type === 'temple' 
      ? 'bg-saffron-100 text-saffron-800 border-saffron-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatFacilities = (facilities: string[]) => {
    if (facilities.length === 0) return 'None listed';
    if (facilities.length <= 3) return facilities.join(', ');
    return `${facilities.slice(0, 3).join(', ')} +${facilities.length - 3} more`;
  };

  const formatTimings = (timings: ReligiousSite['timings']) => {
    return timings.weekdays || 'Contact for timings';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <LoadingSpinner size="lg" text="Loading religious sites..." />
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500 text-lg mb-2">No religious sites found</div>
        <div className="text-gray-400">Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortField === 'name' && (
                    <span className="text-gray-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {sortField === 'type' && (
                    <span className="text-gray-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-1">
                  <span>Location</span>
                  {sortField === 'location' && (
                    <span className="text-gray-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facilities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timings
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSites.map((site) => (
              <tr 
                key={site.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => onSiteClick(site)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getSiteTypeIcon(site.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{site.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{site.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSiteTypeColor(site.type)}`}>
                    {site.type.charAt(0).toUpperCase() + site.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{site.location.address}</div>
                  <div className="text-sm text-gray-500">{site.location.city}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {formatFacilities(site.facilities)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatTimings(site.timings)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSiteClick(site);
                    }}
                    className="text-saffron-600 hover:text-saffron-900 transition-colors duration-150"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm text-gray-600">
            {sites.length} site{sites.length !== 1 ? 's' : ''} found
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedSites.map((site) => (
            <div 
              key={site.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => onSiteClick(site)}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl flex-shrink-0">{getSiteTypeIcon(site.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{site.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSiteTypeColor(site.type)}`}>
                      {site.type.charAt(0).toUpperCase() + site.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{site.description}</p>
                  <div className="text-xs text-gray-400 mb-2">
                    📍 {site.location.address}, {site.location.city}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    🕐 {formatTimings(site.timings)}
                  </div>
                  <div className="text-xs text-gray-400">
                    🏢 {formatFacilities(site.facilities)}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSiteClick(site);
                  }}
                  className="text-sm text-saffron-600 hover:text-saffron-900 font-medium transition-colors duration-150"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}