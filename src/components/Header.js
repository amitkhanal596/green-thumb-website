'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { searchPlants } from '@/lib/api';

export default function Header({ onSearch, currentPage = 'products' }) {
  const { getTotalItems, toggleCart } = useCart();
  const { currentCurrency, setCurrency, rates } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const currencyRef = useRef(null);

  useEffect(() => {
    setIsHydrated(true);
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      const searches = JSON.parse(savedSearches);
      setRecentSearches(searches);
    }
    // Note: Recent searches will be empty initially until user makes searches
  }, []);

  // Debounced search for real-time results and suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const results = await searchPlants(searchQuery);
          setSuggestions(results.suggestions || []);
          setShowSuggestions(true);
          setShowRecentSearches(false);
          
          // Update main product grid in real-time using ref
          if (onSearchRef.current) {
            onSearchRef.current(results.data || [], searchQuery);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          if (onSearchRef.current) {
            onSearchRef.current([], searchQuery);
          }
        }
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        
        // Only clear search results when transitioning from having a query to empty
        // This prevents the infinite loop
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // Only searchQuery in dependencies, use ref for onSearch

  // Handle clearing search when input becomes empty
  const prevSearchQuery = useRef('');
  const onSearchRef = useRef(onSearch);
  
  // Keep onSearch ref updated
  useEffect(() => {
    onSearchRef.current = onSearch;
  });
  
  useEffect(() => {
    // Only clear when transitioning from having text to empty
    if (prevSearchQuery.current.length > 0 && searchQuery === '') {
      if (onSearchRef.current) {
        onSearchRef.current(null, ''); // Clear search mode
      }
    }
    prevSearchQuery.current = searchQuery;
  }, [searchQuery]); // Only searchQuery in dependencies, use ref for onSearch

  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && trimmedQuery.length > 1) {
      const updatedSearches = [trimmedQuery, ...recentSearches.filter(s => s !== trimmedQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  // Handle search submission (Enter key or search button)
  const handleSearch = async (query = searchQuery) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && onSearchRef.current) {
      setShowSuggestions(false);
      setShowRecentSearches(false);
      setIsSearching(true);
      
      // Save to recent searches
      saveToRecentSearches(trimmedQuery);
      
      try {
        const results = await searchPlants(trimmedQuery);
        onSearchRef.current(results.data || [], trimmedQuery);
      } catch (error) {
        console.error('Search error:', error);
        onSearchRef.current([], trimmedQuery);
      }
      setIsSearching(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setShowRecentSearches(false);
    handleSearch(suggestion);
  };

  // Handle recent search click
  const handleRecentSearchClick = (recentSearch) => {
    setSearchQuery(recentSearch);
    setShowRecentSearches(false);
    handleSearch(recentSearch);
  };

  // Remove individual recent search
  const removeRecentSearch = (searchToRemove) => {
    const updatedSearches = recentSearches.filter(search => search !== searchToRemove);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Handle input focus - show recent searches if no query (like YouTube)
  const handleInputFocus = () => {
    // Always try to show recent searches when focusing on empty input
    if (!searchQuery.trim()) {
      if (recentSearches.length > 0) {
        setShowRecentSearches(true);
        setShowSuggestions(false);
      }
    }
  };

  // Handle input blur - but with delay to allow clicks on dropdown
  const handleInputBlur = () => {
    // Use setTimeout to allow clicks on dropdown items to register first
    setTimeout(() => {
      setShowRecentSearches(false);
      setShowSuggestions(false);
    }, 150);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show recent searches for empty input, hide when typing
    if (!value.trim()) {
      // Show recent searches when input becomes empty
      if (recentSearches.length > 0) {
        setShowRecentSearches(true);
        setShowSuggestions(false);
      }
    } else {
      // Hide recent searches when user starts typing
      setShowRecentSearches(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Close suggestions when clicking outside (backup to onBlur)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setShowRecentSearches(false);
      }
      
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target)
      ) {
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top green banner - higher z-index to stay above overlay */}
      <div className="sticky top-0 z-60 bg-green-700 text-white py-2 text-sm pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div></div>
          <div className="text-center flex-1">
            FREE SHIPPING ON ALL FULL SUN PLANTS! FEB. 25-28.
          </div>
          <div className="flex space-x-4">
            <div className="relative pointer-events-auto" ref={currencyRef}>
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
              >
                <span>{currentCurrency}</span>
                <svg 
                  className={`w-3 h-3 transform transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCurrencyDropdown && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {Object.entries(rates).map(([code, currency]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex justify-between items-center ${
                        currentCurrency === code ? 'bg-green-50 text-green-700' : 'text-gray-900'
                      }`}
                    >
                      <span className="font-medium">{code}</span>
                      <span className="text-gray-600">{currency.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a 
              href="/contact" 
              className="hover:text-gray-200 transition-colors pointer-events-auto"
            >
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Main header - lower z-index so it gets covered by overlay */}
      <header className="sticky top-[36px] z-25 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">
                Green <span className="font-normal">Thumb</span>
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="/home" 
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'home' 
                    ? 'text-black border-b-2 border-green-600' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                Home
              </a>
              <a 
                href="/" 
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'products' 
                    ? 'text-black border-b-2 border-green-600' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                Products
              </a>
              <a 
                href="/about" 
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'about' 
                    ? 'text-black border-b-2 border-green-600' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                About us
              </a>
              <a 
                href="/contact" 
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'contact' 
                    ? 'text-black border-b-2 border-green-600' 
                    : 'text-black hover:text-gray-700'
                }`}
              >
                Contact us
              </a>
            </nav>
            
            {/* Search and Cart */}
            <div className="flex items-center">
              <div className="relative mr-8" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                />
                <button 
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-green-600 transition-colors"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>

                {/* Search Suggestions Dropdown */}
                {(showSuggestions && suggestions.length > 0) || (showRecentSearches && recentSearches.length > 0) ? (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1"
                  >
                    {/* Recent Searches Section */}
                    {showRecentSearches && recentSearches.length > 0 && (
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          Recent Searches
                        </div>
                        {recentSearches.map((recentSearch, index) => (
                          <div
                            key={`recent-${index}`}
                            className="flex items-center hover:bg-gray-50 focus:bg-gray-50"
                          >
                            <button
                              onClick={() => handleRecentSearchClick(recentSearch)}
                              className="flex-1 text-left px-4 py-2 text-sm text-black focus:outline-none"
                            >
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {recentSearch}
                              </div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(recentSearch);
                              }}
                              className="px-2 py-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                              title="Remove from recent searches"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search Suggestions Section */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="py-1">
                        {showRecentSearches && recentSearches.length > 0 && (
                          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            Suggestions
                          </div>
                        )}
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={`suggestion-${index}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              {suggestion}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              
              {/* Gray separator line */}
              <div className="h-6 w-px bg-gray-400"></div>
              
              <button
                onClick={toggleCart}
                className="flex items-center p-2 text-gray-700 hover:text-gray-900 transition-colors ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
                <span className="ml-2 text-sm">{isHydrated ? getTotalItems() : 0}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}