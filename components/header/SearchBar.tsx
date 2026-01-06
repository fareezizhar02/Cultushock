'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  isHovered: boolean;
}

export default function SearchBar({ isHovered }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isHovered ? '#E8E9EB' : 'white',
        borderRadius: '6px',
        height: '44px',
        padding: '0 16px',
        gap: '12px',
        transition: 'background-color 0.3s'
      }}>
        {/* Search Icon */}
        <Search 
          size={18} 
          color={isHovered ? '#6b7280' : '#6b7280'} 
          style={{ flexShrink: 0, transition: 'color 0.3s' }} 
        />
        
        {/* Input */}
        <input
          type="text"
          placeholder="Search What You Need Here..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: isHovered ? '#000000' : '#000000',
            transition: 'color 0.3s'
          }}
        />
        
        {/* Clear Button - Only show when there's text */}
        {searchValue && (
          <button 
            onClick={handleClear}
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-label="Clear search"
          >
            <X 
              size={18} 
              color={isHovered ? '#9ca3af' : '#6b7280'}
              style={{ transition: 'color 0.3s' }}
            />
          </button>
        )}
      </div>
    </div>
  );
}