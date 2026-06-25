'use client';

import { useState } from 'react';
import Header from '@/components/header/Header';
import Image from 'next/image';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import CheckoutModal from '@/components/cart/CheckoutModal';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { currency, formatPrice } = useCurrency();

  const [showModal, setShowModal] = useState(false);

  const cartTotal = getCartTotal(currency.code);

  const handleQuantityChange = (productId: number, size: string, current: number, change: number) => {
    updateQuantity(productId, size, Math.max(1, current + change));
  };

  const formatItemTotal = (item: { priceMYR: number; priceIDR: number; priceSGD: number; quantity: number }) => {
    const price = currency.code === 'IDR' ? item.priceIDR : currency.code === 'SGD' ? item.priceSGD : item.priceMYR;
    const total = price * item.quantity;
    if (currency.code === 'IDR') return `${currency.symbol} ${total.toLocaleString('id-ID')}`;
    return `${currency.symbol} ${total.toFixed(2)}`;
  };

  const formatTotal = () => {
    if (currency.code === 'IDR') return `${currency.symbol} ${cartTotal.toLocaleString('id-ID')}`;
    return `${currency.symbol} ${cartTotal.toFixed(2)}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header lightBackground={true} />

      <main style={{ padding: '140px 48px 48px 48px', maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#000000', marginBottom: '32px', marginTop: '60px' }}>
          YOUR CART
        </h1>

        <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '32px', padding: '24px 0', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>PRODUCT</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', textAlign: 'center' }}>QUANTITY</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', textAlign: 'right' }}>TOTAL</div>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af', fontSize: '16px' }}>Your cart is empty</div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '32px', padding: '32px 0', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}
              >
                {/* Product */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                    <Image src={item.image || '/images/products/tops-01.jpg'} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="120px" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000', marginBottom: '8px', letterSpacing: '0.05em' }}>{item.name}</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Size: {item.size}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      {formatPrice(item.priceMYR, item.priceIDR, item.priceSGD)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.05em' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                    >
                      <X size={12} color="#9ca3af" /> REMOVE
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.size, item.quantity, -1)}
                    style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Minus size={14} color="#000000" />
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.size, item.quantity, 1)}
                    style={{ width: '32px', height: '32px', border: '1px solid #e5e7eb', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={14} color="#000000" />
                  </button>
                </div>

                {/* Item Total */}
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', textAlign: 'right' }}>
                  {formatItemTotal(item)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {cartItems.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px' }}>
            <div style={{ width: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000', letterSpacing: '0.05em' }}>SUBTOTAL</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>{formatTotal()}</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{ width: '100%', padding: '16px 32px', backgroundColor: '#000000', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '4px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </main>

      <CheckoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}