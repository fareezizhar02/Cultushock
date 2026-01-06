'use client';

import { useState } from 'react';
import Header from '@/components/header/Header';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import AddToCartButton from '@/components/products/AddToCartButton';

const PRODUCT = {
  id: 1,
  name: 'LONG SLEEVE GRAPHIC TEE',
  price: 150.00,
  currency: 'RM',
  images: [
    '/images/products/tops-01.jpg',
  ],
  sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
};

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCartSuccess = () => {
    // Optional: Reset quantity or show success message
    console.log('Successfully added to cart!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header lightBackground={true} />

      <main style={{ paddingTop: '140px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '48px'
          }}
        >
          {/* Left Side - Product Image */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#f5f5f5',
                overflow: 'hidden'
              }}
            >
              <Image
                src={PRODUCT.images[currentImageIndex]}
                alt={PRODUCT.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="50vw"
                priority
              />
            </div>

            {/* Thumbnail navigation if multiple images */}
            {PRODUCT.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                {PRODUCT.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      border: currentImageIndex === index ? '2px solid #000000' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${PRODUCT.name} view ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '48px',
              height: 'fit-content'
            }}
          >
            {/* Product Name */}
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                color: '#000000',
                marginBottom: '24px'
              }}
            >
              {PRODUCT.name}
            </h1>

            {/* Price */}
            <p
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: '32px'
              }}
            >
              {PRODUCT.currency} {PRODUCT.price.toFixed(2)}
            </p>

            {/* Size Selector */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '12px',
                  letterSpacing: '0.05em'
                }}
              >
                Size
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {PRODUCT.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '12px 24px',
                      border: selectedSize === size ? '2px solid #000000' : '1px solid #000000',
                      backgroundColor: selectedSize === size ? '#000000' : 'transparent',
                      color: selectedSize === size ? '#ffffff' : '#000000',
                      fontSize: '14px',
                      fontWeight: selectedSize === size ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      letterSpacing: '0.05em',
                      minWidth: '60px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSize !== size) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '12px',
                  letterSpacing: '0.05em'
                }}
              >
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #000000',
                    backgroundColor: quantity <= 1 ? '#e5e7eb' : 'transparent',
                    color: quantity <= 1 ? '#9ca3af' : '#000000',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (quantity > 1) {
                      e.currentTarget.style.backgroundColor = '#e5e7eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity > 1) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Minus size={18} />
                </button>

                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#000000',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}
                >
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #000000',
                    backgroundColor: 'transparent',
                    color: '#000000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton
              productId={PRODUCT.id}
              productName={PRODUCT.name}
              price={PRODUCT.price}
              selectedSize={selectedSize}
              quantity={quantity}
              onSuccess={handleAddToCartSuccess}
            />
          </div>
        </div>
      </main>
    </div>
  );
}