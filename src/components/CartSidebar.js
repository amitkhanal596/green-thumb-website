'use client';

import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice 
  } = useCart();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-30"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={closeCart}
      />
      
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-70 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-black">My Cart</h2>
            <button
              onClick={closeCart}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2a1 1 0 0 1 2 0v2h6V2a1 1 0 0 1 2 0v2h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h3z"/>
                </svg>
                <p className="text-gray-700">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-0">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
                      {item.default_image?.medium_url ? (
                        <img
                          src={item.default_image.medium_url}
                          alt={item.common_name || item.scientific_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16.5c0-.38-.21-.71-.53-.88l-7.9-4.44c-.16-.12-.36-.18-.57-.18s-.41.06-.57.18l-7.9 4.44c-.32.17-.53.5-.53.88s.21.71.53.88l7.9 4.44c.16.12.36.18.57.18s.41-.06.57-.18l7.9-4.44c.32-.17.53-.5.53-.88zM12 1L3 5l9 5 9-5-9-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-black">
                            {item.common_name || item.scientific_name}
                          </h3>
                          <p className="text-xs text-gray-600">{item.size || 'Small'}</p>
                          <p className="text-xs text-gray-600 mt-1">Quantity</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium px-2 text-black">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-black">{formatPrice(item.price)}</p>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-gray-600 hover:text-red-600 mt-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold text-black">{formatPrice(getTotalPrice())}</span>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors font-medium">
                CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}