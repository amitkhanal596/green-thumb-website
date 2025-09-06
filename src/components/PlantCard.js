'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { generateRandomPrice } from '@/lib/api';

export default function PlantCard({ plant, price, showDiscount = false }) {
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();

  // Use plant's price, passed price prop, or generate a random price
  const finalPrice = plant.price || price || generateRandomPrice();

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const plantWithPrice = { ...plant, price: finalPrice, size: 'Small' };
    addToCart(plantWithPrice);
    openCart();
  };

  // Generate random discount for variety (20% or 25%)
  const discounts = ['20%', '25%'];
  const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
  const originalPrice = Math.floor(finalPrice * 1.3); // Calculate original price

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
      <div className="p-2">
        <Link href={`/plant/${plant.id}`}>
          <div className="relative aspect-[4/3] bg-gray-200 border border-gray-300 rounded-lg overflow-hidden">
            {showDiscount && (
              <div className="absolute top-3 left-3 bg-green-700 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                {randomDiscount}
              </div>
            )}
            {plant.default_image?.medium_url && plant.default_image.medium_url !== '/api/placeholder/300/200' ? (
              <img
                src={plant.default_image.medium_url}
                alt={plant.common_name || plant.scientific_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600" style={{ display: plant.default_image?.medium_url && plant.default_image.medium_url !== '/api/placeholder/300/200' ? 'none' : 'flex' }}>
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16.5c0-.38-.21-.71-.53-.88l-7.9-4.44c-.16-.12-.36-.18-.57-.18s-.41.06-.57.18l-7.9 4.44c-.32.17-.53.5-.53.88s.21.71.53.88l7.9 4.44c.16.12.36.18.57.18s.41-.06.57-.18l7.9-4.44c.32-.17.53-.5.53-.88zM12 1L3 5l9 5 9-5-9-4z"/>
              </svg>
            </div>
          </div>
        </Link>
      </div>
        
      <div className="p-3 space-y-2">
        <Link href={`/plant/${plant.id}`}>
          <h3 className="font-medium text-black hover:text-gray-700 line-clamp-1 text-sm">
            {plant.common_name || plant.scientific_name || 'Unknown Plant'}
          </h3>
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-base font-bold text-black">{formatPrice(finalPrice)}</span>
          {showDiscount && (
            <span className="text-xs text-red-500 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>
        <button
          onClick={handleBuyClick}
          className="w-full bg-green-700 text-white py-1.5 px-3 rounded hover:bg-green-800 transition-colors font-medium text-sm"
        >
          Buy
        </button>
      </div>
    </div>
  );
}