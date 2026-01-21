'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Image from 'next/image';
import Link from 'next/link';
import WishlistIcon from '@/components/products/WishlistIcon';
import { Product } from '@/lib/types';

export default function ListingPage() {
  const params = useParams();
  const type = params.type as string; // "collections" or "categories"
  const slug = params.slug as string; // "tops", "bottoms", "streetwear", etc.
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Determine which field to query based on type
        const queryParam = type === 'collections' ? 'collection' : 'category';
        const response = await fetch(`/api/products?${queryParam}=${slug}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (type && slug) {
      fetchProducts();
    }
  }, [type, slug]);

  // Capitalize first letter for display
  const pageTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <Header lightBackground={true} />
        <main style={{ paddingTop: '140px' }}>
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#000000' }}>Loading products...</p>
          </div>
        </main>
      </div>
    );
  }

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
              margin: 0,
              textTransform: 'uppercase'
            }}
          >
            {pageTitle}
          </h1>
        </div>

        <div style={{ padding: '48px' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ fontSize: '18px', color: '#666666' }}>No products found.</p>
            </div>
          ) : (
            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '32px',
                maxWidth: '1920px',
                margin: '0 auto'
              }}
            >
              {products.map((product) => (
                <Link
                  key={product.productId}
                  href={`/${type}/${slug}/${product.slug}`}
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
                  <div 
                    style={{ 
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1',
                      backgroundColor: '#ffffff',
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    <WishlistIcon productId={product.productId} />
                  </div>

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
                      RM {product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}