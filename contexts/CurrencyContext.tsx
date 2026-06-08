'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type CurrencyCode = 'MYR' | 'IDR' | 'SGD';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  country: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'MYR', symbol: 'RM', country: 'Malaysia' },
  { code: 'IDR', symbol: 'Rp', country: 'Indonesia' },
  { code: 'SGD', symbol: 'S$', country: 'Singapore' },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (currency: CurrencyInfo) => void;
  formatPrice: (priceMYR: number, priceIDR: number, priceSGD: number) => string;
  getPrice: (priceMYR: number, priceIDR: number, priceSGD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES[0]);

  const getPrice = (priceMYR: number, priceIDR: number, priceSGD: number): number => {
    switch (currency.code) {
      case 'IDR': return priceIDR ?? priceMYR ?? 0;
      case 'SGD': return priceSGD ?? priceMYR ?? 0;
      default: return priceMYR ?? 0;
    }
  };

  const formatPrice = (priceMYR: number, priceIDR: number, priceSGD: number): string => {
    const price = getPrice(priceMYR, priceIDR, priceSGD);
    if (typeof price !== 'number' || isNaN(price)) return `${currency.symbol} 0.00`;
    if (currency.code === 'IDR') {
      return `${currency.symbol} ${price.toLocaleString('id-ID')}`;
    }
    return `${currency.symbol} ${price.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
}