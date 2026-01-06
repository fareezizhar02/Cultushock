'use client';

import Header from '@/components/header/Header';
import Image from 'next/image';
import Link from 'next/link';
import WishlistIcon from '@/components/products/WishlistIcon';

// Placeholder product data
const TOPS_PRODUCTS = [
  { id: 1, name: 'Long Sleeve Graphic Tee', price: 'RM 150', image: '/images/products/tops-01.jpg' },
  { id: 2, name: 'Green Snake Tee', price: 'RM 120', image: '/images/products/tops-02.jpg' },
  { id: 3, name: 'Back Print Tee', price: 'RM 130', image: '/images/products/tops-03.jpg' },
  { id: 4, name: 'White Graphic Tee', price: 'RM 110', image: '/images/products/tops-04.jpg' },
];

export default function TopsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header lightBackground={true} />

      <main style={{ paddingTop: '140px' }}>
        <div 
          style={{ 
            borderTop: '1px solid #000000',
            borderBottom: '1px solid #000000',
            padding: '32px 48px'
          }}
        >
          <h1 
            style={{ 
              fontSize: '48px',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              color: '#000000',
              margin: 0
            }}
          >
            TOPS
          </h1>
        </div>

        <div style={{ padding: '48px' }}>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px',
              maxWidth: '1920px',
              margin: '0 auto'
            }}
          >
            {TOPS_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href="/collections/tops/item1"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  display: 'block'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Product Image with Wishlist Icon */}
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
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Wishlist Icon */}
                  <WishlistIcon productId={product.id} />
                </div>

                {/* Product Info */}
                <div style={{ marginTop: '16px' }}>
                  <h3 
                    style={{ 
                      fontSize: '16px',
                      fontWeight: 'normal',
                      color: '#000000',
                      marginBottom: '8px'
                    }}
                  >
                    {product.name}
                  </h3>
                  <p 
                    style={{ 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#000000'
                    }}
                  >
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}