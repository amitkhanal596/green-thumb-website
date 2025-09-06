'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.size === action.payload.size
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.size === action.payload.size)
        ),
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    
    default:
      return state;
  }
};

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return {
          items: parsedCart.items || [],
          isOpen: false,
        };
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
  return {
    items: [],
    isOpen: false,
  };
};

const initialState = getInitialState();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify({ items: state.items }));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items]);
  
  const addToCart = (plant) => {
    dispatch({ type: 'ADD_TO_CART', payload: plant });
  };
  
  const removeFromCart = (id, size) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } });
  };
  
  const updateQuantity = (id, size, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
  };
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        closeCart,
        openCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}