'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPlantById, getPlants } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';
import PlantCard from '@/components/PlantCard';

export default function PlantDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();
  
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Small');
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState('watering');
  
  const price = plant?.price || 350;

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current plant and related plants in parallel
        const [plantData, relatedData] = await Promise.all([
          getPlantById(id),
          getPlants(Math.floor(Math.random() * 3) + 1) // Random page 1-3
        ]);
        
        setPlant(plantData);
        
        // Filter out current plant and get 4 random related plants
        const filteredPlants = relatedData.data?.filter(p => p.id !== parseInt(id)) || [];
        const shuffled = filteredPlants.sort(() => 0.5 - Math.random());
        setRelatedPlants(shuffled.slice(0, 4));
        
      } catch (err) {
        setError('Failed to load plant details. Please try again later.');
        console.error('Error fetching plant data:', err);
        
        // Fallback mock data for related plants if API fails
        setRelatedPlants([
          { id: 'fallback-1', common_name: 'String of Hearts', scientific_name: 'Ceropegia woodii' },
          { id: 'fallback-2', common_name: 'Red Secret Alocasia', scientific_name: 'Alocasia cuprea' },
          { id: 'fallback-3', common_name: 'Jewel Alocasia', scientific_name: 'Alocasia reginula' },
          { id: 'fallback-4', common_name: 'Hoya Retusa', scientific_name: 'Hoya retusa' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (plant) {
      const plantWithPrice = {
        ...plant,
        price: price,
        size: selectedSize,
        quantity: quantity
      };
      for (let i = 0; i < quantity; i++) {
        addToCart(plantWithPrice);
      }
      openCart();
    }
  };

  if (loading || !plant) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="products" />
        {/* Hero Section */}
        <div className="bg-stone-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-6xl font-light text-black">Plant</h1>
              <span className="text-2xl text-gray-400">|</span>
              <p className="text-black">Loading...</p>
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
      <Header currentPage="products" />
      
      {/* Hero Section */}
      <div className="bg-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-6xl font-light text-black">Plant</h1>
            <span className="text-2xl text-gray-400">|</span>
            <p className="text-black">{plant.common_name || plant.scientific_name}</p>
          </div>
        </div>
      </div>

      {/* Back to Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {plant.default_image?.medium_url && index === 1 ? (
                  <img
                    src={plant.default_image.medium_url}
                    alt={plant.common_name || plant.scientific_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16.5c0-.38-.21-.71-.53-.88l-7.9-4.44c-.16-.12-.36-.18-.57-.18s-.41.06-.57.18l-7.9 4.44c-.32.17-.53.5-.53.88s.21.71.53.88l7.9 4.44c.16.12.36.18.57.18s.41-.06.57-.18l7.9-4.44c.32-.17.53-.5.53-.88zM12 1L3 5l9 5 9-5-9-4z"/>
                  </svg>
                </div>
                {index === 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                {plant.common_name || plant.scientific_name}
              </h1>
              <p className="text-2xl font-bold text-black">{formatPrice(price)}</p>
            </div>

            <div className="prose text-gray-800">
              <p>
                {plant.description || `${plant.common_name || plant.scientific_name} is a popular houseplant that is known for its beautiful foliage. It is a relatively easy plant to care for, making it a good choice for beginners.`}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="text-sm font-medium text-black mb-3">Size</h3>
              <div className="flex space-x-2">
                {[
                  { label: 'S', value: 'Small' },
                  { label: 'M', value: 'Medium' },
                  { label: 'L', value: 'Large' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`px-4 py-2 border text-sm font-medium ${
                      selectedSize === size.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-black hover:border-gray-400'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-black mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-black"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-black"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-green-700 text-white py-3 px-6 rounded hover:bg-green-800 transition-colors font-medium"
              >
                ADD TO CART
              </button>
              
              <p className="text-sm text-gray-700">Free standard shipping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Care Section */}
      <div className="bg-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-4">
              <div>
                <button className="flex items-center text-black font-medium w-full text-left">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Plant care
                </button>
                <div className="ml-6 mt-2 space-y-1">
                  <button 
                    onClick={() => setExpandedSection('watering')}
                    className={`block text-sm w-full text-left hover:text-black transition-colors ${expandedSection === 'watering' ? 'text-black font-medium' : 'text-gray-800'}`}
                  >
                    Watering
                  </button>
                  <button 
                    onClick={() => setExpandedSection('sunlight')}
                    className={`block text-sm w-full text-left hover:text-black transition-colors ${expandedSection === 'sunlight' ? 'text-black font-medium' : 'text-gray-800'}`}
                  >
                    Sunlight
                  </button>
                  <button 
                    onClick={() => setExpandedSection('soil')}
                    className={`block text-sm w-full text-left hover:text-black transition-colors ${expandedSection === 'soil' ? 'text-black font-medium' : 'text-gray-800'}`}
                  >
                    Soil & Fertilizing
                  </button>
                  <button 
                    onClick={() => setExpandedSection('humidity')}
                    className={`block text-sm w-full text-left hover:text-black transition-colors ${expandedSection === 'humidity' ? 'text-black font-medium' : 'text-gray-800'}`}
                  >
                    Humidity
                  </button>
                  <button 
                    onClick={() => setExpandedSection('toxicity')}
                    className={`block text-sm w-full text-left hover:text-black transition-colors ${expandedSection === 'toxicity' ? 'text-black font-medium' : 'text-gray-800'}`}
                  >
                    Toxicity
                  </button>
                  <button 
                    onClick={() => setExpandedSection('benefits')}
                    className={`block text-sm w-full text-left hover:text-black transition-colors ${expandedSection === 'benefits' ? 'text-black font-medium' : 'text-gray-800'}`}
                  >
                    Benefits
                  </button>
                </div>
              </div>
              <div>
                <button 
                  onClick={() => setExpandedSection('origin')}
                  className="flex items-center text-black w-full text-left hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Origin story
                </button>
              </div>
              <div>
                <button 
                  onClick={() => setExpandedSection('scientific')}
                  className="flex items-center text-black w-full text-left hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Scientific data
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {expandedSection === 'watering' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Watering</h2>
                  <div className="space-y-4 text-black">
                    <p>
                      {plant.watering_general_benchmark?.value ? 
                        `Water your ${plant.common_name || plant.scientific_name} every ${plant.watering_general_benchmark.value} days. It's important to let the soil dry slightly between waterings to prevent root rot.` :
                        plant.watering || `${plant.common_name || plant.scientific_name} requires regular watering, but it's important to let the soil dry between waterings.`
                      }
                    </p>
                    <p>
                      The best way to determine when to water your {plant.common_name || plant.scientific_name} is to stick your finger into the soil. If the top inch of soil is dry, it is time to water your plant.
                    </p>
                    <p>
                      When you water your {plant.common_name || plant.scientific_name}, water deeply until the water runs out of the drainage holes. This will ensure that the roots are getting enough water.
                    </p>
                  </div>
                </div>
              )}

              {expandedSection === 'sunlight' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Sunlight</h2>
                  <div className="space-y-4 text-black">
                    <p>
                      <strong>Light Requirements:</strong> {plant.sunlight ? plant.sunlight.join(', ') : 'Bright, indirect light is preferred for most indoor plants.'}
                    </p>
                    {plant.light_ideal && (
                      <p>
                        <strong>Ideal Light:</strong> {plant.light_ideal} lux
                      </p>
                    )}
                    {plant.light_tolerated && (
                      <p>
                        <strong>Tolerated Light Range:</strong> {plant.light_tolerated} lux
                      </p>
                    )}
                    <p>
                      Proper lighting is essential for your {plant.common_name || plant.scientific_name} to thrive. Too little light can cause leggy growth, while too much direct sunlight can scorch the leaves.
                    </p>
                  </div>
                </div>
              )}

              {expandedSection === 'soil' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Soil & Fertilizing</h2>
                  <div className="space-y-4 text-black">
                    <p>
                      <strong>Soil Type:</strong> {(plant.soil && typeof plant.soil === 'string' && plant.soil.trim()) || 'Well-draining potting mix is recommended for most houseplants.'}
                    </p>
                    {plant.fertilizer && (
                      <p>
                        <strong>Fertilizer:</strong> {plant.fertilizer}
                      </p>
                    )}
                    <p>
                      Good drainage is crucial for {plant.common_name || plant.scientific_name}. Make sure your pot has drainage holes and use a high-quality potting mix that doesn't retain too much moisture.
                    </p>
                    <p>
                      Feed your plant with a balanced liquid fertilizer every 2-4 weeks during the growing season (spring and summer).
                    </p>
                  </div>
                </div>
              )}

              {expandedSection === 'humidity' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Humidity</h2>
                  <div className="space-y-4 text-black">
                    {plant.humidity && (
                      <p>
                        <strong>Humidity Requirements:</strong> {plant.humidity}%
                      </p>
                    )}
                    <p>
                      {plant.common_name || plant.scientific_name} {plant.humidity ? `prefers humidity levels around ${plant.humidity}%` : 'benefits from moderate humidity levels (40-60%)'}.
                    </p>
                    <p>
                      You can increase humidity around your plant by placing it on a pebble tray filled with water, grouping plants together, or using a humidifier.
                    </p>
                  </div>
                </div>
              )}

              {expandedSection === 'toxicity' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Toxicity</h2>
                  <div className="space-y-4 text-black">
                    {plant.poisonous_to_humans !== undefined && (
                      <p>
                        <strong>Toxic to Humans:</strong> {plant.poisonous_to_humans ? 'Yes - Keep away from children' : 'No - Generally safe around humans'}
                      </p>
                    )}
                    {plant.poisonous_to_pets !== undefined && (
                      <p>
                        <strong>Toxic to Pets:</strong> {plant.poisonous_to_pets ? 'Yes - Keep away from pets' : 'No - Generally safe around pets'}
                      </p>
                    )}
                    <p>
                      Always wash your hands after handling plants and keep potentially toxic plants out of reach of children and pets. If ingestion occurs, contact poison control or a veterinarian immediately.
                    </p>
                  </div>
                </div>
              )}

              {expandedSection === 'benefits' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Benefits</h2>
                  <div className="space-y-4 text-black">
                    <p>
                      {plant.common_name || plant.scientific_name} offers several benefits as a houseplant:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Improves indoor air quality by filtering toxins</li>
                      <li>Adds natural beauty and greenery to your space</li>
                      <li>Can help reduce stress and improve mood</li>
                      <li>Low maintenance and perfect for beginners</li>
                      {plant.attracts && plant.attracts.length > 0 && (
                        <li>Attracts: {plant.attracts.join(', ')}</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {expandedSection === 'origin' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Origin Story</h2>
                  <div className="space-y-4 text-black">
                    {plant.origin && plant.origin.length > 0 && (
                      <p>
                        <strong>Native to:</strong> {plant.origin.join(', ')}
                      </p>
                    )}
                    {plant.family && (
                      <p>
                        <strong>Plant Family:</strong> {plant.family}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {expandedSection === 'scientific' && (
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Scientific Data</h2>
                  <div className="space-y-4 text-black">
                    <p>
                      <strong>Scientific Name:</strong> <em>{plant.scientific_name}</em>
                    </p>
                    {plant.family && (
                      <p>
                        <strong>Family:</strong> {plant.family}
                      </p>
                    )}
                    {plant.genus && (
                      <p>
                        <strong>Genus:</strong> {plant.genus}
                      </p>
                    )}
                    {plant.type && (
                      <p>
                        <strong>Plant Type:</strong> {plant.type}
                      </p>
                    )}
                    {plant.cycle && (
                      <p>
                        <strong>Life Cycle:</strong> {plant.cycle}
                      </p>
                    )}
                    {plant.attracts && plant.attracts.length > 0 && (
                      <p>
                        <strong>Attracts:</strong> {plant.attracts.join(', ')}
                      </p>
                    )}
                    {plant.propagation && plant.propagation.length > 0 && (
                      <p>
                        <strong>Propagation Methods:</strong> {plant.propagation.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile responsive tabs */}
          <div className="lg:hidden mt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {['watering', 'sunlight', 'soil', 'humidity', 'toxicity', 'benefits', 'origin', 'scientific'].map((section) => (
                <button
                  key={section}
                  onClick={() => setExpandedSection(section)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    expandedSection === section
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-black mb-2">
            You'll love <span className="font-bold">these too...</span>
          </h2>
          <div className="w-full h-px bg-gray-300 mb-12"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedPlants.map((relatedPlant, index) => (
              <PlantCard 
                key={relatedPlant.id} 
                plant={relatedPlant} 
                price={relatedPlant.price} 
                showDiscount={index < 3} // Show discount on first 3 plants
              />
            ))}
          </div>
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  );
}