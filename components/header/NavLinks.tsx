'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

interface NavLinksProps {
  isHovered: boolean;
}

export default function NavLinks({ isHovered }: NavLinksProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    if (link.subItems && link.subItems.length > 0) {
      e.preventDefault();
      setExpandedLink(expandedLink === link.href ? null : link.href);
    }
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
      {/* SHOP link */}
      <Link 
        href="/shop" 
        style={{
          fontSize: '14px',
          fontWeight: 'normal',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
          textDecoration: 'none',
          color: isHovered ? '#000000' : '#ffffff'
        }}
      >
        SHOP
      </Link>
      
      {/* Nav links with nested structure */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
        {/* Main nav links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NAV_LINKS.map((link) => (
            <div key={link.href} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link 
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                  textDecoration: 'none',
                  color: isHovered ? '#000000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: link.subItems ? 'pointer' : 'pointer'
                }}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {(hoveredLink === link.href || expandedLink === link.href) && (
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      transition: 'transform 0.2s, opacity 0.2s',
                      color: isHovered ? '#000000' : '#ffffff',
                      transform: expandedLink === link.href ? 'rotate(90deg)' : 'rotate(0deg)'
                    }} 
                  />
                )}
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Expanded sub-items */}
        {expandedLink && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {NAV_LINKS.find(link => link.href === expandedLink)?.subItems?.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                style={{
                  fontSize: '14px',
                  fontWeight: 'normal',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                  textDecoration: 'none',
                  color: isHovered ? '#000000' : '#ffffff',
                  paddingLeft: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={() => setHoveredSubItem(subItem.href)}
                onMouseLeave={() => setHoveredSubItem(null)}
              >
                {hoveredSubItem === subItem.href && (
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      transition: 'opacity 0.2s',
                      color: isHovered ? '#000000' : '#ffffff'
                    }} 
                  />
                )}
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}