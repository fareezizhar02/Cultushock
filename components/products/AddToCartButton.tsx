'use client';

import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  price: number;
  selectedSize: string;
  quantity: number;
  onSuccess?: () => void;
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  selectedSize,
  quantity,
  onSuccess
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId,
      name: productName,
      price,
      size: selectedSize,
      quantity
    });

    // Optional success callback
    if (onSuccess) {
      onSuccess();
    }

    // Optional: Show toast notification
    console.log('Added to cart:', {
      product: productName,
      size: selectedSize,
      quantity
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      style={{
        width: '100%',
        padding: '16px 32px',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1f2937';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#000000';
      }}
    >
      ADD TO CART
    </button>
  );
}