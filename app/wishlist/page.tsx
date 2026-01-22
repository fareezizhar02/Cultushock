'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/header/Header';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

// If you already have Product type, you can import it.
// import { Product } from '@/lib/types';

// Minimal “safe” shape for UI. (Works even if your DB has extra fields)
type ProductForUI = {
  productId?: number;
  id?: number;
  _id?: any;
  name?: string;
  title?: string;
  price?: number;
  images?: string[];
  image?: string;
  sizes?: string[];
  slug?: string;
};

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<ProductForUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from DB via your API
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/products', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch products (HTTP ${res.status})`);
        }

        const json = await res.json();
        const list = (json?.data || json?.products || []) as ProductForUI[];

        if (isMounted) setProducts(list);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to fetch products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Create a lookup map from productId -> product
  const productMap = useMemo(() => {
    const map = new Map<number, ProductForUI>();
    for (const p of products) {
      const pid =
        typeof p.productId === 'number'
          ? p.productId
          : typeof p.id === 'number'
            ? p.id
            : undefined;

      if (typeof pid === 'number') map.set(pid, p);
    }
    return map;
  }, [products]);

  // Resolve wishlist product objects in the same order as wishlistItems
  const wishlistProducts = useMemo(() => {
    return wishlistItems
      .map((id) => ({
        id,
        product: productMap.get(id),
      }))
      .filter(Boolean);
  }, [wishlistItems, productMap]);

  const getProductName = (p?: ProductForUI, fallbackId?: number) =>
    p?.name || p?.title || (fallbackId != null ? `Product #${fallbackId}` : 'Product');

  const getProductPrice = (p?: ProductForUI) => (typeof p?.price === 'number' ? p.price : 0);

  const getProductImage = (p?: ProductForUI) =>
    p?.image ||
    (Array.isArray(p?.images) && p!.images!.length > 0 ? p!.images![0] : null) ||
    '/images/products/tops-01.jpg';

  const getDefaultSize = (p?: ProductForUI) =>
    (Array.isArray(p?.sizes) && p!.sizes!.length > 0 ? p!.sizes![0] : null) || 'M';

  const handleAddToCart = (productId: number, p?: ProductForUI) => {
    const name = getProductName(p, productId);
    const price = getProductPrice(p);
    const image = getProductImage(p);
    const size = getDefaultSize(p);

    addToCart({
      productId,
      name,
      price,
      size,
      quantity: 1,
      image,
    });

    // Optional: remove from wishlist after adding
    // removeFromWishlist(productId);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header lightBackground={true} />

      <main style={{ paddingTop: '200px', padding: '140px 48px 48px 48px', maxWidth: '1600px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            color: '#000000',
            marginBottom: '32px',
            marginTop: '60px',
          }}
        >
          YOUR WISHLIST
        </h1>

        <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
          {/* Header Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '32px',
              padding: '24px 0',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
              PRODUCT
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                textTransform: 'uppercase',
                textAlign: 'right',
              }}
            >
              ACTION
            </div>
          </div>

          {/* States */}
          {loading ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af', fontSize: '16px' }}>Loading wishlist…</div>
          ) : error ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: '#ef4444', fontSize: '16px' }}>{error}</div>
          ) : wishlistItems.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: '#9ca3af', fontSize: '16px' }}>Your wishlist is empty</div>
          ) : (
            wishlistProducts.map(({ id, product }) => {
              const name = getProductName(product, id);
              const price = getProductPrice(product);
              const image = getProductImage(product);

              return (
                <div
                  key={id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '32px',
                    padding: '32px 0',
                    borderBottom: '1px solid #e5e7eb',
                    alignItems: 'center',
                  }}
                >
                  {/* Product Info */}
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#f5f5f5',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} sizes="120px" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#000000',
                          marginBottom: '8px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {name}
                      </h3>

                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>RM {price.toFixed(2)}</p>

                      {/* Inline actions (same style language as Remove) */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                          onClick={() => removeFromWishlist(id)}
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
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                          <X size={14} />
                          Remove
                        </button>
                      </div>

                      {/* If product not found in DB, show a subtle hint */}
                      {!product && (
                        <p style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
                          Product not found in DB (ID: {id})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right-side Action (optional) */}
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleAddToCart(id, product)}
                      style={{
                        padding: '12px 18px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1f2937')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000000')}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
