'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, CURRENCIES } from '@/contexts/CurrencyContext';

interface CurrencyProps {
  isHovered: boolean;
}

export default function Currency({ isHovered }: CurrencyProps) {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          gap: '6px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {currency.country.toUpperCase()} ({currency.code})
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

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
            zIndex: 1000,
          }}
        >
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 'normal',
                letterSpacing: '0.05em',
                background:
                  currency.code === c.code
                    ? isHovered
                      ? '#f3f4f6'
                      : 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                border: 'none',
                color: isHovered ? '#000000' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                if (currency.code !== c.code)
                  e.currentTarget.style.backgroundColor = isHovered
                    ? '#f9fafb'
                    : 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (currency.code !== c.code)
                  e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {c.country.toUpperCase()} ({c.code})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}