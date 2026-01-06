'use client';

import Header from '@/components/header/Header';
import Image from 'next/image';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleQuantityChange = (productId: number, size: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(productId, size, newQuantity);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header lightBackground={true} />

      <main style={{ paddingTop: '200px', padding: '140px 48px 48px 48px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            color: '#000000',
            marginBottom: '32px'
          }}
        >
          YOUR CART
        </h1>

        {/* Cart Items Container */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '32px',
              padding: '24px 0',
              borderBottom: '1px solid #e5e7eb'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                textTransform: 'uppercase'
              }}
            >
              PRODUCT
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}
            >
              QUANTITY
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                textTransform: 'uppercase',
                textAlign: 'right'
              }}
            >
              TOTAL
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div
              style={{
                padding: '64px 0',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '16px'
              }}
            >
              Your cart is empty
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '32px',
                  padding: '32px 0',
                  borderBottom: '1px solid #e5e7eb',
                  alignItems: 'center'
                }}
              >
                {/* Product Info */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  {/* Product Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#f5f5f5',
                      flexShrink: 0
                    }}
                  >
                    <Image
                      src="/images/products/tops-01.jpg"
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="120px"
                    />
                  </div>

                  {/* Product Details */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#000000',
                        marginBottom: '8px',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '8px'
                      }}
                    >
                      Size: {item.size}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.size, item.quantity, -1)}
                    disabled={item.quantity <= 1}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '50%',
                      backgroundColor: item.quantity <= 1 ? '#f5f5f5' : 'transparent',
                      color: item.quantity <= 1 ? '#9ca3af' : '#000000',
                      cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (item.quantity > 1) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.quantity > 1) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Minus size={14} />
                  </button>

                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 'normal',
                      color: '#000000',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(item.productId, item.size, item.quantity, 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Total Price */}
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#000000',
                    textAlign: 'right'
                  }}
                >
                  RM {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '48px'
            }}
          >
            <div style={{ width: '400px' }}>
              {/* Subtotal */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#000000',
                    letterSpacing: '0.05em'
                  }}
                >
                  SUBTOTAL
                </span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#000000'
                  }}
                >
                  RM {cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
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
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                }}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}