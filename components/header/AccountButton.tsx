'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ChevronUp, LogOutIcon, UserCircleIcon } from 'lucide-react';

interface AccountButtonProps {
  isHovered: boolean;
}

type StoredUser = {
  username: string;
  email?: string;
};

export default function AccountButton({ isHovered }: AccountButtonProps) {
  const [user, setUser] = useState<StoredUser | null>(null);

  // dropdown state
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cultushock_user');
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  // Close dropdown if user logs out
  useEffect(() => {
    if (!user) setIsOpen(false);
  }, [user]);

  // Close dropdown on outside click (follow Currency.tsx behavior)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const color = useMemo(() => (isHovered ? '#000000' : '#ffffff'), [isHovered]);

  const linkStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'normal',
    letterSpacing: '0.1em',
    textDecoration: 'none',
    color,
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s, color 0.3s',
  };

  const menuLinkStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'normal',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'color 0.3s, opacity 0.2s',
    textDecoration: 'none',
    color,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0,
  };

  const handleLogout = () => {
    localStorage.removeItem('cultushock_user');
    setUser(null);
    window.location.href = '/';
  };

  if (!user) {
    return (
      <Link
        href="/account/login"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        ACCOUNT
      </Link>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Username button (toggle dropdown) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          ...linkStyle,
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        title={user.email ? user.email : user.username}
      >
        <UserCircleIcon size={18} />
        {user.username}
        <ChevronDown
          size={16}
          style={{
            transition: 'transform 0.2s, opacity 0.2s',
            color,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.95,
          }}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '10px',
            backgroundColor: isHovered ? '#ffffff' : 'rgba(0, 0, 0, 0.9)',
            border: isHovered ? '1px solid #e5e7eb' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden',
            minWidth: '220px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* If you want Profile later, just uncomment this */}
            {/* <Link
              href="/account"
              style={menuLinkStyle}
              onMouseEnter={() => setHoveredItem('profile')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => setIsOpen(false)}
            >
              {hoveredItem === 'profile' && (
                <ChevronRight size={16} style={{ transition: 'transform 0.2s, opacity 0.2s', color }} />
              )}
              Profile
            </Link> */}

            <button
              type="button"
              onClick={handleLogout}
              style={menuLinkStyle}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <LogOutIcon size={16} style={{ transition: 'transform 0.2s, opacity 0.2s', color }} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
