'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  isHovered: boolean;
}

interface Product {
  productId: number;
  name: string;
  slug: string;
  collection: string;
  price: number;
  images: string[];
}

interface SearchResult {
  type: 'product' | 'collection';
  label: string;
  href: string;
  sublabel?: string;
}

const COLLECTIONS = [
  { label: 'Tops', href: '/collections/tops' },
  { label: 'Bottoms', href: '/collections/bottoms' },
  { label: 'Caps', href: '/collections/caps' },
  { label: 'Bags', href: '/collections/bags' },
  { label: 'Cases', href: '/collections/phone-cases' },
];

export default function SearchBar({ isHovered }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch all products once on mount
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAllProducts(data.products);
      })
      .catch(() => {});
  }, []);

  // Search logic
  const runSearch = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      const matchedCollections: SearchResult[] = COLLECTIONS.filter((c) =>
        c.label.toLowerCase().includes(q)
      ).map((c) => ({
        type: 'collection',
        label: c.label,
        href: c.href,
        sublabel: 'Collection',
      }));

      const matchedProducts: SearchResult[] = allProducts
        .filter((p) => p.name.toLowerCase().includes(q))
        .map((p) => ({
          type: 'product',
          label: p.name,
          href: `/collections/${p.collection}/${p.slug}`,
          sublabel: `RM${p.price} · ${p.collection.charAt(0).toUpperCase() + p.collection.slice(1)}`,
        }));

      const combined = [...matchedCollections, ...matchedProducts].slice(0, 8);
      setResults(combined);
      setIsOpen(combined.length > 0);
      setSelectedIndex(-1);
    },
    [allProducts]
  );

  useEffect(() => {
    runSearch(searchValue);
  }, [searchValue, runSearch]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setSearchValue('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isHovered ? '#E8E9EB' : 'white',
          borderRadius: isOpen ? '6px 6px 0 0' : '6px',
          height: '44px',
          padding: '0 16px',
          gap: '12px',
          transition: 'background-color 0.3s',
        }}
      >
        <Search size={18} color="#6b7280" style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search What You Need Here..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchValue && setIsOpen(results.length > 0)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#000000',
          }}
        />
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
            aria-label="Clear search"
          >
            <X size={18} color="#9ca3af" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 999,
            overflow: 'hidden',
          }}
        >
          {results.map((result, index) => (
            <button
              key={result.href}
              onMouseDown={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '12px 16px',
                background: selectedIndex === index ? '#f3f4f6' : 'transparent',
                border: 'none',
                borderTop: index === 0 ? '1px solid #e5e7eb' : '1px solid #f3f4f6',
                cursor: 'pointer',
                textAlign: 'left',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {/* Icon */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    backgroundColor: result.type === 'collection' ? '#000000' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Search
                    size={13}
                    color={result.type === 'collection' ? '#ffffff' : '#6b7280'}
                  />
                </div>

                {/* Text */}
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: result.type === 'collection' ? 600 : 400,
                      color: '#000000',
                      margin: 0,
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {result.label}
                  </p>
                  {result.sublabel && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0,
                        marginTop: '1px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {result.sublabel}
                    </p>
                  )}
                </div>
              </div>

              {/* Tag */}
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: result.type === 'collection' ? '#000000' : '#9ca3af',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {result.type === 'collection' ? 'Collection' : 'Product'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}