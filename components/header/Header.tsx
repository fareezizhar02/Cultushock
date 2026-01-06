'use client';

import { useState } from 'react';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserActions from './UserActions';

interface HeaderProps {
  lightBackground?: boolean;
}

export default function Header({ lightBackground = false }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  // If lightBackground is true, always use the "hovered" style (black text, white bg)
  const shouldUseDarkStyle = lightBackground ? true : isHovered;

  return (
    <header 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '32px 48px',
        backgroundColor: shouldUseDarkStyle ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        transition: 'background-color 0.3s ease',
        backdropFilter: shouldUseDarkStyle ? 'blur(10px)' : 'none',
        borderBottom: lightBackground ? '1px solid #e5e7eb' : 'none'
      }}
      onMouseEnter={() => !lightBackground && setIsHovered(true)}
      onMouseLeave={() => !lightBackground && setIsHovered(false)}
    >
      <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '70px' }}>
          {/* Left section: Logo and Navigation */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '100px' }}>
            <Logo isHovered={shouldUseDarkStyle} />
            <NavLinks isHovered={shouldUseDarkStyle} />
          </div>

          {/* Right section: User actions */}
          <div style={{ minWidth: '320px' }}>
            <UserActions isHovered={shouldUseDarkStyle} />
          </div>
        </div>
      </div>
    </header>
  );
}