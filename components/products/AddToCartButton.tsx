'use client';

import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  priceMYR: number;
  priceIDR: number;
  priceSGD: number;
  selectedSize: string;
  quantity: number;
  image: string;
  onSuccess?: () => void;
}

export default function AddToCartButton({
  productId,
  productName,
  priceMYR,
  priceIDR,
  priceSGD,
  selectedSize,
  quantity,
  image,
  onSuccess,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId,
      name: productName,
      priceMYR,
      priceIDR,
      priceSGD,
      size: selectedSize,
      quantity,
      image,
    });
    if (onSuccess) onSuccess();
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
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
    >
      ADD TO CART
    </button>
  );
}