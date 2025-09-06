'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getPlants } from '@/lib/api';
import PlantCard from '@/components/PlantCard';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';

export default function Home() {
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Featured plants for the home page (first 3 plants)
  useEffect(() => {
    const fetchFeaturedPlants = async () => {
      setLoading(true);
      try {
        const data = await getPlants(1);
        if (data.data && data.data.length > 0) {
          setFeaturedPlants(data.data.slice(0, 3));
        } else {
          // Fallback featured plants
          setFeaturedPlants([
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
              common_name: 'Bird of Paradise', 
              scientific_name: 'Strelitzia reginae', 
              family: 'Strelitziaceae',
              genus: 'Strelitzia',
              care_level: 'Hard',
              price: 500,
              default_image: { medium_url: '/api/placeholder/300/200' } 
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching featured plants:', error);
        // Use fallback plants on error
        setFeaturedPlants([
          { 
            id: 1, 
            common_name: 'Marble Queen', 
            scientific_name: 'Epipremnum aureum', 
            price: 250,
            default_image: { medium_url: '/api/placeholder/300/200' } 
          },
          { 
            id: 2, 
            common_name: 'Neon Pothos', 
            scientific_name: 'Epipremnum aureum', 
            price: 200,
            default_image: { medium_url: '/api/placeholder/300/200' } 
          },
          { 
            id: 3, 
            common_name: 'Bird of Paradise', 
            scientific_name: 'Strelitzia reginae', 
            price: 500,
            default_image: { medium_url: '/api/placeholder/300/200' } 
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPlants();
  }, []);

  // Simple search handler that redirects to products page (now root route)
  const handleSearch = (_, query) => {
    if (query && query.trim()) {
      // Redirect to products page with search (root route)
      window.location.href = `/?search=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={handleSearch} currentPage="home" />
      
      {/* Hero Section */}
      <div className="bg-stone-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-light text-black mb-4">
              Welcome to <span className="font-medium">Green Thumb</span>
            </h1>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-px bg-gray-400"></div>
              <p className="text-xl text-black">Transform your space with beautiful plants</p>
              <div className="w-16 h-px bg-gray-400"></div>
            </div>
            <Link 
              href="/"
              className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors inline-block"
            >
              Shop All Plants
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-black mb-4">Why Choose Green Thumb?</h2>
            <div className="w-24 h-px bg-green-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-2">Expert Care Guides</h3>
              <p className="text-gray-600">Detailed care instructions for every plant, from beginners to experts.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-2">Premium Quality</h3>
              <p className="text-gray-600">Hand-selected plants delivered fresh and healthy to your door.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-2">Plant Matching</h3>
              <p className="text-gray-600">Find the perfect plants for your space, light, and experience level.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Plants Section */}
      <div className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-black mb-4">Featured Plants</h2>
            <div className="w-24 h-px bg-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Discover our most popular and beginner-friendly plants</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPlants.map((plant, index) => (
                <PlantCard key={plant.id || index} plant={plant} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              href="/"
              className="bg-white text-green-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors border border-green-600 inline-block"
            >
              View All Plants
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Ready to Start Your Plant Journey?</h2>
          <p className="text-xl text-green-100 mb-8">Join thousands of happy plant parents who trust Green Thumb</p>
          <Link 
            href="/"
            className="bg-white text-green-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  );
}