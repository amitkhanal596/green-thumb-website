'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CurrencyContext = createContext();

// Currency conversion rates (relative to USD)
const CURRENCY_RATES = {
  USD: { rate: 1, symbol: '$', name: 'US Dollar' },
  EUR: { rate: 0.85, symbol: '€', name: 'Euro' },
  GBP: { rate: 0.73, symbol: '£', name: 'British Pound' },
  CAD: { rate: 1.25, symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { rate: 1.35, symbol: 'A$', name: 'Australian Dollar' },
  JPY: { rate: 110, symbol: '¥', name: 'Japanese Yen' },
  CHF: { rate: 0.92, symbol: 'CHF', name: 'Swiss Franc' },
  CNY: { rate: 6.45, symbol: '¥', name: 'Chinese Yuan' },
  INR: { rate: 74.5, symbol: '₹', name: 'Indian Rupee' },
  BRL: { rate: 5.2, symbol: 'R$', name: 'Brazilian Real' },
  MXN: { rate: 20.5, symbol: '$', name: 'Mexican Peso' },
  KRW: { rate: 1180, symbol: '₩', name: 'Korean Won' }
};

const initialState = {
  currentCurrency: 'USD',
  rates: CURRENCY_RATES
};

function currencyReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENCY':
      return {
        ...state,
        currentCurrency: action.payload
      };
    default:
      return state;
  }
}

// Get initial state from localStorage
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency && CURRENCY_RATES[savedCurrency]) {
        return { ...initialState, currentCurrency: savedCurrency };
      }
    } catch (error) {
      console.error('Error loading currency from localStorage:', error);
    }
  }
  return initialState;
};

export function CurrencyProvider({ children }) {
  const [state, dispatch] = useReducer(currencyReducer, initialState, getInitialState);

  // Save currency to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('selectedCurrency', state.currentCurrency);
      } catch (error) {
        console.error('Error saving currency to localStorage:', error);
      }
    }
  }, [state.currentCurrency]);

  const setCurrency = (currency) => {
    if (CURRENCY_RATES[currency]) {
      dispatch({ type: 'SET_CURRENCY', payload: currency });
    }
  };

  const convertPrice = (usdPrice) => {
    const rate = state.rates[state.currentCurrency].rate;
    const convertedPrice = usdPrice * rate;
    
    // Format based on currency (some currencies like JPY don't use decimals)
    if (['JPY', 'KRW'].includes(state.currentCurrency)) {
      return Math.round(convertedPrice);
    }
    return Math.round(convertedPrice * 100) / 100;
  };

  const formatPrice = (usdPrice) => {
    const convertedPrice = convertPrice(usdPrice);
    const currency = state.rates[state.currentCurrency];
    
    // Special formatting for certain currencies
    if (state.currentCurrency === 'JPY' || state.currentCurrency === 'KRW') {
      return `${currency.symbol}${convertedPrice.toLocaleString()}`;
    }
    
    return `${currency.symbol}${convertedPrice.toFixed(2)}`;
  };

  const getCurrentCurrency = () => state.rates[state.currentCurrency];

  const value = {
    currentCurrency: state.currentCurrency,
    rates: state.rates,
    setCurrency,
    convertPrice,
    formatPrice,
    getCurrentCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};