'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPlants, getIndoorOutdoorPlants, searchPlants, generateRandomPrice } from '@/lib/api';
import PlantCard from '@/components/PlantCard';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function Home() {
  const searchParams = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sunlightFilter, setSunlightFilter] = useState('all');
  const plantsPerPage = 9;

  // Plant sorting function
  const sortPlants = (plants, sortMethod) => {
    const plantsToSort = [...plants];
    
    switch (sortMethod) {
      case 'Popular':
        // Default order (as received from API)
        return plantsToSort;
      
      case 'Common Name (A-Z)':
        return plantsToSort.sort((a, b) => 
          (a.common_name || '').localeCompare(b.common_name || '', undefined, { sensitivity: 'base' })
        );
      
      case 'Common Name (Z-A)':
        return plantsToSort.sort((a, b) => 
          (b.common_name || '').localeCompare(a.common_name || '', undefined, { sensitivity: 'base' })
        );
      
      case 'Scientific Name (A-Z)':
        return plantsToSort.sort((a, b) => {
          const nameA = String(a.scientific_name || '').toLowerCase();
          const nameB = String(b.scientific_name || '').toLowerCase();
          return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
        });
      
      case 'Scientific Name (Z-A)':
        return plantsToSort.sort((a, b) => {
          const nameA = String(a.scientific_name || '').toLowerCase();
          const nameB = String(b.scientific_name || '').toLowerCase();
          return nameB.localeCompare(nameA, undefined, { sensitivity: 'base' });
        });
      
      case 'Family (A-Z)':
        return plantsToSort.sort((a, b) => 
          (a.family || '').localeCompare(b.family || '', undefined, { sensitivity: 'base' })
        );
      
      case 'Family (Z-A)':
        return plantsToSort.sort((a, b) => 
          (b.family || '').localeCompare(a.family || '', undefined, { sensitivity: 'base' })
        );
      
      case 'Genus (A-Z)':
        return plantsToSort.sort((a, b) => 
          (a.genus || '').localeCompare(b.genus || '', undefined, { sensitivity: 'base' })
        );
      
      case 'Genus (Z-A)':
        return plantsToSort.sort((a, b) => 
          (b.genus || '').localeCompare(a.genus || '', undefined, { sensitivity: 'base' })
        );
      
      case 'Care Level (Easy to Hard)':
        const careOrder = { 'Low': 1, 'Easy': 1, 'Medium': 2, 'Moderate': 2, 'High': 3, 'Hard': 3, 'Difficult': 3 };
        return plantsToSort.sort((a, b) => 
          (careOrder[a.care_level] || 2) - (careOrder[b.care_level] || 2)
        );
      
      case 'Care Level (Hard to Easy)':
        const careOrderReverse = { 'Low': 1, 'Easy': 1, 'Medium': 2, 'Moderate': 2, 'High': 3, 'Hard': 3, 'Difficult': 3 };
        return plantsToSort.sort((a, b) => 
          (careOrderReverse[b.care_level] || 2) - (careOrderReverse[a.care_level] || 2)
        );
      
      case 'Price: Low to High':
        return plantsToSort.sort((a, b) => (a.price || generateRandomPrice()) - (b.price || generateRandomPrice()));
      
      case 'Price: High to Low':
        return plantsToSort.sort((a, b) => (b.price || generateRandomPrice()) - (a.price || generateRandomPrice()));
      
      default:
        return plantsToSort;
    }
  };

  // Mock plant data with enhanced botanical information for sorting
  const mockPlants = [
    { 
      id: 1, 
      common_name: 'Marble Queen', 
      scientific_name: 'Epipremnum aureum', 
      family: 'Araceae',
      genus: 'Epipremnum',
      care_level: 'Easy',
      price: 250,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 2, 
      common_name: 'Neon Pothos', 
      scientific_name: 'Epipremnum aureum', 
      family: 'Araceae',
      genus: 'Epipremnum',
      care_level: 'Easy',
      price: 200,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 3, 
      common_name: 'Syngonium Rayii', 
      scientific_name: 'Syngonium podophyllum', 
      family: 'Araceae',
      genus: 'Syngonium',
      care_level: 'Medium',
      price: 300,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 4, 
      common_name: 'Pineapple', 
      scientific_name: 'Ananas comosus', 
      family: 'Bromeliaceae',
      genus: 'Ananas',
      care_level: 'Hard',
      price: 450,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 5, 
      common_name: 'African Milk Tree', 
      scientific_name: 'Euphorbia trigona', 
      family: 'Euphorbiaceae',
      genus: 'Euphorbia',
      care_level: 'Easy',
      price: 400,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 6, 
      common_name: 'Pothos', 
      scientific_name: 'Epipremnum aureum', 
      family: 'Araceae',
      genus: 'Epipremnum',
      care_level: 'Easy',
      price: 180,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 7, 
      common_name: 'Chinese Evergreen', 
      scientific_name: 'Aglaonema commutatum', 
      family: 'Araceae',
      genus: 'Aglaonema',
      care_level: 'Medium',
      price: 320,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 8, 
      common_name: 'Bird of Paradise', 
      scientific_name: 'Strelitzia reginae', 
      family: 'Strelitziaceae',
      genus: 'Strelitzia',
      care_level: 'Hard',
      price: 500,
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
    { 
      id: 9, 
      common_name: 'Peruvian Cactus', 
      scientific_name: 'Cereus peruvianus', 
      family: 'Cactaceae',
      genus: 'Cereus',
      care_level: 'Easy',
      price: generateRandomPrice(),
      default_image: { medium_url: '/api/placeholder/300/200' } 
    },
  ];

  useEffect(() => {
    fetchPlants(currentPage);
  }, [currentPage]);

  // Handle URL search parameters (from home page redirects)
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery && searchQuery.trim()) {
      // Automatically execute search when page loads with search parameter
      const executeUrlSearch = async () => {
        setLoading(true);
        try {
          const results = await searchPlants(searchQuery);
          handleSearch(results.data || [], searchQuery);
        } catch (error) {
          console.error('URL search error:', error);
          handleSearch([], searchQuery);
        }
        setLoading(false);
      };
      executeUrlSearch();
    }
  }, [searchParams]);

  // Sort plants when sortBy changes
  useEffect(() => {
    if (isSearchMode) {
      // Sort search results
      const sortedResults = sortPlants(searchResults, sortBy);
      setFilteredPlants(sortedResults);
    } else {
      // Sort regular plants
      const sortedPlants = sortPlants(plants, sortBy);
      setFilteredPlants(sortedPlants);
    }
  }, [sortBy, plants, searchResults, isSearchMode]);

  const fetchPlants = async (page) => {
    setLoading(true);
    try {
      const data = await getPlants(page);
      if (data.data && data.data.length > 0) {
        const plantsData = data.data;
        setPlants(plantsData);
        setFilteredPlants(plantsData);
        
        // Calculate total pages based on API response
        // Assuming API returns up to 20 plants per page, we'll estimate total pages
        setTotalPages(Math.ceil(data.total / plantsPerPage) || 10); // Default to 10 pages if no total
      } else {
        // Use mock data only for first page
        if (page === 1) {
          setPlants(mockPlants);
          setFilteredPlants(mockPlants);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error('Error fetching plants:', err);
      // Use mock data only for first page
      if (page === 1) {
        setPlants(mockPlants);
        setFilteredPlants(mockPlants);
        setTotalPages(1);
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply all filters to plants
  const applyFilters = (plantsToFilter, customPriceFilter = null, customSunlightFilter = null) => {
    let filtered = [...plantsToFilter];
    
    // Use custom price filter if provided, otherwise use current state
    const currentPriceFilter = customPriceFilter || priceFilter;
    const currentSunlightFilter = customSunlightFilter || sunlightFilter;
    
    // Apply price filter
    if (currentPriceFilter.min || currentPriceFilter.max) {
      filtered = filtered.filter(plant => {
        const price = plant.price || generateRandomPrice();
        const min = currentPriceFilter.min ? parseInt(currentPriceFilter.min) : 0;
        const max = currentPriceFilter.max ? parseInt(currentPriceFilter.max) : Infinity;
        return price >= min && price <= max;
      });
    }
    
    // Apply sunlight filter
    if (currentSunlightFilter !== 'all') {
      filtered = filtered.filter(plant => {
        if (!plant.sunlight || !Array.isArray(plant.sunlight)) return false;
        
        const sunlightRequirements = plant.sunlight.map(req => req.toLowerCase());
        
        switch (currentSunlightFilter) {
          case 'full sun':
            return sunlightRequirements.includes('full sun');
          case 'part shade':
            return sunlightRequirements.includes('part shade');
          case 'flexible':
            // Plants that can handle both full sun and partial shade
            return sunlightRequirements.includes('full sun') && sunlightRequirements.includes('part shade');
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const handleFilterChange = async (filter) => {
    setLoading(true);
    setCurrentPage(1); // Reset to first page when filtering
    
    try {
      // Handle price filter
      if (filter.type === 'price') {
        setPriceFilter(filter.range);
        // Apply price filter to current plants (either all plants or category-filtered plants)
        const currentPlants = categoryFilter === 'all' ? plants : filteredPlants;
        const priceFiltered = applyFilters(currentPlants, filter.range);
        setFilteredPlants(priceFiltered);
        return;
      }

      // Handle sunlight filter
      if (filter.type === 'sunlight') {
        setSunlightFilter(filter.value);
        // Always start from base plants and apply all active filters
        let basePlants = plants;
        
        // If we have a category filter, get the categorized plants first
        if (categoryFilter !== 'all') {
          const categorizedPlants = await getIndoorOutdoorPlants(1, 20);
          if (categoryFilter === 'indoor') {
            basePlants = categorizedPlants.indoor;
          } else if (categoryFilter === 'outdoor') {
            basePlants = categorizedPlants.outdoor;
          }
        }
        
        // Apply all filters (price + sunlight)
        const allFiltered = applyFilters(basePlants, priceFilter, filter.value);
        setFilteredPlants(allFiltered);
        return;
      }
      
      // Handle category filters
      setCategoryFilter(filter);
      
      if (filter === 'all') {
        setSunlightFilter('all'); // Reset sunlight filter when showing all plants
        const filtered = applyFilters(plants);
        setFilteredPlants(filtered);
      } else {
        // Fetch categorized plants and filter accordingly
        const categorizedPlants = await getIndoorOutdoorPlants(1, 20);
        let categoryFiltered = [];
        
        if (filter === 'indoor') {
          categoryFiltered = categorizedPlants.indoor;
        } else if (filter === 'outdoor') {
          categoryFiltered = categorizedPlants.outdoor;
        }
        
        // Apply price filter to category results
        const filtered = applyFilters(categoryFiltered);
        setFilteredPlants(filtered);
      }
    } catch (error) {
      console.error('Error filtering plants:', error);
      setFilteredPlants(plants); // Fallback to all plants
    } finally {
      setLoading(false);
    }
  };

  // Handle search results from Header - use useCallback to prevent re-creation
  const handleSearch = useCallback((results, query = '') => {
    // If results is null, exit search mode (clear search)
    if (results === null) {
      setIsSearchMode(false);
      setSearchResults([]);
      setSearchQuery('');
      setFilteredPlants(plants);
      setCurrentPage(1);
      // Don't call fetchPlants here to avoid infinite loop
      return;
    }
    
    setSearchResults(results);
    setSearchQuery(query);
    setIsSearchMode(true);
    setCurrentPage(1);
    setFilteredPlants(results);
    setTotalPages(Math.ceil(results.length / plantsPerPage) || 1);
  }, [plants, plantsPerPage]); // Dependencies that this function actually uses

  // Clear search and return to normal mode
  const clearSearch = () => {
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchQuery('');
    setFilteredPlants(plants);
    setCurrentPage(1);
    fetchPlants(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onSearch={handleSearch} currentPage="products" />
        {/* Hero Section */}
        <div className="bg-stone-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-7xl font-light text-gray-900">Shop</h1>
              <div className="w-px bg-gray-400 h-12"></div>
              <p className="text-gray-600">Find the perfect plant for your space</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-8">
              <div className="animate-pulse grid grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <CartSidebar />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={handleSearch} currentPage="products" />
      
      {/* Hero Section */}
      <div className="bg-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-7xl font-light text-black">Shop</h1>
            <div className="w-px bg-gray-400 h-12"></div>
            <p className="text-black">Find the perfect plant for your space</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          <Sidebar onFilterChange={handleFilterChange} />
          
          <div className="flex-1 ml-8">
            {/* Search Results Header */}
            {isSearchMode && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-green-800 font-medium">
                      {filteredPlants.length} results found {searchQuery && `for "${searchQuery}"`}
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-green-600 hover:text-green-800 font-medium text-sm"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}

            {/* Sort and Product Count */}
            <div className="flex justify-between items-center mb-6">
              <div></div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-black">
                  Showing {isSearchMode ? filteredPlants.length : '1023'} Products
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-black">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Popular</option>
                    <optgroup label="Common Name">
                      <option>Common Name (A-Z)</option>
                      <option>Common Name (Z-A)</option>
                    </optgroup>
                    <optgroup label="Scientific Name">
                      <option>Scientific Name (A-Z)</option>
                      <option>Scientific Name (Z-A)</option>
                    </optgroup>
                    <optgroup label="Botanical Classification">
                      <option>Family (A-Z)</option>
                      <option>Family (Z-A)</option>
                      <option>Genus (A-Z)</option>
                      <option>Genus (Z-A)</option>
                    </optgroup>
                    <optgroup label="Care & Difficulty">
                      <option>Care Level (Easy to Hard)</option>
                      <option>Care Level (Hard to Easy)</option>
                    </optgroup>
                    <optgroup label="Price">
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredPlants.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {filteredPlants.map((plant, index) => (
                  <PlantCard key={plant.id || index} plant={plant} />
                ))}
              </div>
            ) : isSearchMode ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? `We couldn't find any plants matching "${searchQuery}"` : 'No results found for your search'}
                </p>
                <button
                  onClick={clearSearch}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Browse all plants
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {/* Loading placeholder or empty state */}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded border ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded border ${
                          currentPage === pageNum
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded border ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  );
}
