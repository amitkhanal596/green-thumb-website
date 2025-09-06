'use client';

import { useState, useEffect } from 'react';
import { getIndoorOutdoorPlants } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';

export default function Sidebar({ onFilterChange }) {
  const { formatPrice, convertPrice } = useCurrency();
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    indoor: false,
    outdoor: false,
    sun: false
  });

  const [selectedFilters, setSelectedFilters] = useState({
    planter: false,
    flowers: false,
    care: false,
    heatPack: false
  });

  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });

  const [categorizedPlants, setCategorizedPlants] = useState({
    indoor: [],
    outdoor: []
  });
  
  const [loading, setLoading] = useState(true);
  const [showMoreStates, setShowMoreStates] = useState({
    indoor: { expanded: false, loading: false },
    outdoor: { expanded: false, loading: false }
  });
  const [expandedPlants, setExpandedPlants] = useState({
    indoor: [],
    outdoor: []
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handlePriceChange = (type, value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setPriceRange(prev => ({
      ...prev,
      [type]: numericValue
    }));
    
    // Call parent component's filter function with price range
    if (onFilterChange) {
      const newRange = {
        ...priceRange,
        [type]: numericValue
      };
      onFilterChange({ type: 'price', range: newRange });
    }
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    if (onFilterChange) {
      onFilterChange({ type: 'price', range: { min: '', max: '' } });
    }
  };

  const loadMorePlants = async (category) => {
    // Set loading state
    setShowMoreStates(prev => ({
      ...prev,
      [category]: { ...prev[category], loading: true }
    }));

    try {
      // Get more plants from API (page 2 to get different plants)
      const morePlants = await getIndoorOutdoorPlants(2, 30);
      const categoryPlants = morePlants[category] || [];
      
      // Add the new plants to expanded plants list
      setExpandedPlants(prev => ({
        ...prev,
        [category]: categoryPlants
      }));

      // Update show more state
      setShowMoreStates(prev => ({
        ...prev,
        [category]: { expanded: true, loading: false }
      }));
    } catch (error) {
      console.error(`Error loading more ${category} plants:`, error);
      // Reset loading state on error
      setShowMoreStates(prev => ({
        ...prev,
        [category]: { ...prev[category], loading: false }
      }));
    }
  };

  const showLessPlants = (category) => {
    setShowMoreStates(prev => ({
      ...prev,
      [category]: { expanded: false, loading: false }
    }));
    setExpandedPlants(prev => ({
      ...prev,
      [category]: []
    }));
  };

  useEffect(() => {
    async function fetchCategorizedPlants() {
      try {
        setLoading(true);
        const plants = await getIndoorOutdoorPlants(1, 20);
        setCategorizedPlants(plants);
      } catch (error) {
        console.error('Error fetching categorized plants:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorizedPlants();
  }, []);

  return (
    <div className="w-72 bg-white p-6 space-y-4">
      {/* All Categories Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <button 
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left font-medium text-black mb-3"
        >
          <span className="flex items-center">
            <svg 
              className={`w-4 h-4 mr-2 transform transition-transform ${
                expandedSections.categories ? 'rotate-90' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            All Categories
          </span>
        </button>

        {/* Indoor Plants */}
        {expandedSections.categories && (
          <div className="ml-6 space-y-2">
            <button
              onClick={() => toggleSection('indoor')}
              className="flex items-center text-left text-black font-medium"
            >
              <svg 
                className={`w-4 h-4 mr-2 transform transition-transform ${
                  expandedSections.indoor ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Indoor Plants
            </button>
            
            {expandedSections.indoor && (
              <div className="ml-6 space-y-1 text-sm text-black">
                {loading ? (
                  <div className="py-1 text-gray-600">Loading...</div>
                ) : categorizedPlants.indoor.length > 0 ? (
                  categorizedPlants.indoor.slice(0, 4).map((plant, index) => (
                    <div 
                      key={plant.id || index} 
                      className="py-1 hover:text-green-600 cursor-pointer"
                      onClick={() => onFilterChange && onFilterChange('indoor')}
                    >
                      {plant.common_name || plant.scientific_name}
                    </div>
                  ))
                ) : (
                  <div className="py-1 text-gray-600">No indoor plants found</div>
                )}
                {/* Additional plants from "Show More" */}
                {showMoreStates.indoor.expanded && expandedPlants.indoor.length > 0 && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    {expandedPlants.indoor.map((plant, index) => (
                      <div 
                        key={plant.id || `expanded-indoor-${index}`} 
                        className="py-1 hover:text-green-600 cursor-pointer text-sm"
                        onClick={() => onFilterChange && onFilterChange('indoor')}
                      >
                        {plant.common_name || plant.scientific_name}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Show More / Show Less button */}
                {!loading && categorizedPlants.indoor.length > 4 && (
                  <div className="pt-2">
                    {!showMoreStates.indoor.expanded ? (
                      <button 
                        onClick={() => loadMorePlants('indoor')}
                        disabled={showMoreStates.indoor.loading}
                        className="text-green-600 hover:text-green-700 py-1 flex items-center space-x-1 disabled:opacity-50"
                      >
                        {showMoreStates.indoor.loading ? (
                          <>
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Show More</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => showLessPlants('indoor')}
                        className="text-green-600 hover:text-green-700 py-1 flex items-center space-x-1"
                      >
                        <span>Show Less</span>
                        <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => toggleSection('outdoor')}
              className="flex items-center text-left text-black font-medium"
            >
              <svg 
                className={`w-4 h-4 mr-2 transform transition-transform ${
                  expandedSections.outdoor ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Outdoor plants
            </button>

            {expandedSections.outdoor && (
              <div className="ml-6 space-y-1 text-sm text-black">
                {loading ? (
                  <div className="py-1 text-gray-600">Loading...</div>
                ) : categorizedPlants.outdoor.length > 0 ? (
                  categorizedPlants.outdoor.slice(0, 4).map((plant, index) => (
                    <div 
                      key={plant.id || index} 
                      className="py-1 hover:text-green-600 cursor-pointer"
                      onClick={() => onFilterChange && onFilterChange('outdoor')}
                    >
                      {plant.common_name || plant.scientific_name}
                    </div>
                  ))
                ) : (
                  <div className="py-1 text-gray-600">No outdoor plants found</div>
                )}
                {/* Additional plants from "Show More" */}
                {showMoreStates.outdoor.expanded && expandedPlants.outdoor.length > 0 && (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    {expandedPlants.outdoor.map((plant, index) => (
                      <div 
                        key={plant.id || `expanded-outdoor-${index}`} 
                        className="py-1 hover:text-green-600 cursor-pointer text-sm"
                        onClick={() => onFilterChange && onFilterChange('outdoor')}
                      >
                        {plant.common_name || plant.scientific_name}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Show More / Show Less button */}
                {!loading && categorizedPlants.outdoor.length > 4 && (
                  <div className="pt-2">
                    {!showMoreStates.outdoor.expanded ? (
                      <button 
                        onClick={() => loadMorePlants('outdoor')}
                        disabled={showMoreStates.outdoor.loading}
                        className="text-green-600 hover:text-green-700 py-1 flex items-center space-x-1 disabled:opacity-50"
                      >
                        {showMoreStates.outdoor.loading ? (
                          <>
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Show More</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => showLessPlants('outdoor')}
                        className="text-green-600 hover:text-green-700 py-1 flex items-center space-x-1"
                      >
                        <span>Show Less</span>
                        <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => toggleSection('sun')}
              className="flex items-center text-left text-black font-medium"
            >
              <svg 
                className={`w-4 h-4 mr-2 transform transition-transform ${
                  expandedSections.sun ? 'rotate-90' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Sun requirements
            </button>

            {expandedSections.sun && (
              <div className="ml-6 space-y-1 text-sm text-black">
                <div 
                  className="py-1 hover:text-green-600 cursor-pointer"
                  onClick={() => onFilterChange && onFilterChange({ type: 'sunlight', value: 'full sun' })}
                >
                  Full Sun
                </div>
                <div 
                  className="py-1 hover:text-green-600 cursor-pointer"
                  onClick={() => onFilterChange && onFilterChange({ type: 'sunlight', value: 'part shade' })}
                >
                  Partial Shade
                </div>
                <div 
                  className="py-1 hover:text-green-600 cursor-pointer"
                  onClick={() => onFilterChange && onFilterChange({ type: 'sunlight', value: 'flexible' })}
                >
                  Full Sun or Partial
                </div>
                <div 
                  className="py-1 hover:text-green-600 cursor-pointer"
                  onClick={() => onFilterChange && onFilterChange({ type: 'sunlight', value: 'all' })}
                >
                  All Sunlight Types
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-black">Price</h3>
          {(priceRange.min || priceRange.max) && (
            <button 
              onClick={clearPriceFilter}
              className="text-xs text-green-600 hover:text-green-700"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-black focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <span className="text-gray-600">-</span>
            <input 
              type="text" 
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-black focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          {(priceRange.min || priceRange.max) && (
            <div className="text-xs text-gray-600">
              {priceRange.min && priceRange.max 
                ? `${formatPrice(parseInt(priceRange.min))} - ${formatPrice(parseInt(priceRange.max))}`
                : priceRange.min 
                ? `${formatPrice(parseInt(priceRange.min))}+`
                : `Up to ${formatPrice(parseInt(priceRange.max))}`
              }
            </div>
          )}
        </div>
      </div>

      {/* Include Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <h3 className="font-medium text-black mb-3">Include</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="include"
              checked={selectedFilters.planter}
              onChange={() => handleFilterChange('planter')}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-black">Planter</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="include"
              checked={selectedFilters.flowers}
              onChange={() => handleFilterChange('flowers')}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-black">Flowers</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="include"
              checked={selectedFilters.care}
              onChange={() => handleFilterChange('care')}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-black">Care</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="include"
              checked={selectedFilters.heatPack}
              onChange={() => handleFilterChange('heatPack')}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-black">Heat pack</span>
          </label>
        </div>
      </div>
    </div>
  );
}