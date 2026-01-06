'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistIconProps {
  productId: number;
}

export default function WishlistIcon({ productId }: WishlistIconProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isActive = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActive) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        zIndex: 10
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      }}
      aria-label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={20}
        fill={isActive ? '#ef4444' : 'none'}
        color={isActive ? '#ef4444' : '#000000'}
        strokeWidth={2}
      />
    </button>
  );
}