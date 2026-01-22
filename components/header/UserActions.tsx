'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';
import Currency from './Currency';
import AccountButton from './AccountButton';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

interface UserActionsProps {
  isHovered: boolean;
}

export default function UserActions({ isHovered }: UserActionsProps) {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const color = isHovered ? '#000000' : '#ffffff';

  const linkStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'normal',
    letterSpacing: '0.1em',
    textDecoration: 'none',
    color,
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s, color 0.3s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '480px' }}>
      {/* Top row: Account and Cart */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}
      >
        {/* ACCOUNT */}
        <AccountButton isHovered={isHovered} />

        {/* CART */}
        <Link
          href="/cart"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          CART [{cartCount}]
        </Link>
      </div>

      {/* Second row: Currency and Wishlist */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}
      >
        <Currency isHovered={isHovered} />

        <Link
          href="/wishlist"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          WISHLIST [{wishlistCount}]
        </Link>
      </div>

      {/* Search bar */}
      <SearchBar isHovered={isHovered} />
    </div>
  );
}
