'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CurrencyProps {
  isHovered: boolean;
}

const CURRENCIES = [
  { country: 'Malaysia', code: 'MYR' },
  { country: 'Indonesia', code: 'IDR' },
  { country: 'Singapore', code: 'SGD' }
];

export default function Currency({ isHovered }: CurrencyProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Currency Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontSize: '14px',
          fontWeight: 'normal',
          letterSpacing: '0.1em',
          background: 'none',
          border: 'none',
          color: isHovered ? '#000000' : '#ffffff',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.2s, color 0.3s',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        {selectedCurrency.country.toUpperCase()} ({selectedCurrency.code})
        <ChevronDown 
          size={14} 
          style={{ 
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '8px',
            backgroundColor: isHovered ? '#ffffff' : 'rgba(0, 0, 0, 0.9)',
            border: isHovered ? '1px solid #e5e7eb' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden',
            minWidth: '200px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000
          }}
        >
          {CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                setSelectedCurrency(currency);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 'normal',
                letterSpacing: '0.05em',
                background: selectedCurrency.code === currency.code 
                  ? (isHovered ? '#f3f4f6' : 'rgba(255, 255, 255, 0.1)')
                  : 'transparent',
                border: 'none',
                color: isHovered ? '#000000' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
                display: 'block'
              }}
              onMouseEnter={(e) => {
                if (selectedCurrency.code !== currency.code) {
                  e.currentTarget.style.backgroundColor = isHovered 
                    ? '#f9fafb' 
                    : 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCurrency.code !== currency.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {currency.country.toUpperCase()} ({currency.code})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}