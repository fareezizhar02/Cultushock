"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header/Header";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import AddToCartButton from "@/components/products/AddToCartButton";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToWishlist, isInWishlist } = useWishlist();

  // Fetch product data based on slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?slug=${productSlug}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          const fetchedProduct = data.data[0];
          setProduct(fetchedProduct);
          
          // Set default selections based on product data
          if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
            setSelectedSize(fetchedProduct.sizes[0]);
          }
          if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
            setSelectedColour(fetchedProduct.colors[0]);
          }
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchProduct();
    }
  }, [productSlug]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCartSuccess = () => {
    console.log("Successfully added to cart!");
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product.productId);
      alert("Added to wishlist!");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Header lightBackground={true} />
        <div
          style={{
            paddingTop: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Header lightBackground={true} />
        <div
          style={{
            paddingTop: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <div>Product not found</div>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.productId);
  
  // Determine if Size selector should be shown
  const showSizeSelector = product.sizes && 
    product.sizes.length > 0 && 
    product.sizes[0] !== 'One Size';
  
  // Determine if Colour selector should be shown
  const showColourSelector = product.colors && product.colors.length >= 2;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Header lightBackground={true} />

      <main style={{ paddingTop: "140px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "48px",
          }}
        >
          {/* Left Side - Product Image */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                width: "80%",
                aspectRatio: "1",
                backgroundColor: "#ffffff",
                overflow: "hidden",
              }}
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                style={{ objectFit: "contain" }}
                sizes="50vw"
                priority
              />
            </div>

            {/* Thumbnail navigation */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: "80px",
                      height: "80px",
                      border:
                        currentImageIndex === index
                          ? "2px solid #000000"
                          : "1px solid #e5e7eb",
                      cursor: "pointer",
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
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
              backgroundColor: "#f5f5f5",
              padding: "48px",
              height: "fit-content",
            }}
          >
            {/* Product Name */}
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                letterSpacing: "0.05em",
                color: "#000000",
                marginBottom: "24px",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#000000",
                marginBottom: "32px",
              }}
            >
              RM {product.price.toFixed(2)}
            </p>

            {/* Size Selector - Conditional */}
            {showSizeSelector && (
              <div style={{ marginBottom: "32px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "12px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Size
                </label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "12px 24px",
                        border:
                          selectedSize === size
                            ? "2px solid #000000"
                            : "1px solid #000000",
                        backgroundColor:
                          selectedSize === size ? "#000000" : "transparent",
                        color: selectedSize === size ? "#ffffff" : "#000000",
                        fontSize: "14px",
                        fontWeight: selectedSize === size ? "bold" : "normal",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        letterSpacing: "0.05em",
                        minWidth: "60px",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSize !== size) {
                          e.currentTarget.style.backgroundColor = "#e5e7eb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSize !== size) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colour Selector - Conditional */}
            {showColourSelector && product.colors && (
              <div style={{ marginBottom: "32px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "12px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Colour
                </label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColour(color)}
                      style={{
                        padding: "12px 24px",
                        border:
                          selectedColour === color
                            ? "2px solid #000000"
                            : "1px solid #000000",
                        backgroundColor:
                          selectedColour === color ? "#000000" : "transparent",
                        color: selectedColour === color ? "#ffffff" : "#000000",
                        fontSize: "14px",
                        fontWeight: selectedColour === color ? "bold" : "normal",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        letterSpacing: "0.05em",
                        minWidth: "60px",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedColour !== color) {
                          e.currentTarget.style.backgroundColor = "#e5e7eb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedColour !== color) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#000000",
                  marginBottom: "12px",
                  letterSpacing: "0.05em",
                }}
              >
                Quantity
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #000000",
                    backgroundColor: quantity <= 1 ? "#e5e7eb" : "transparent",
                    color: quantity <= 1 ? "#9ca3af" : "#000000",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (quantity > 1) {
                      e.currentTarget.style.backgroundColor = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity > 1) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Minus size={18} />
                </button>

                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#000000",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(1)}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #000000",
                    backgroundColor: "transparent",
                    color: "#000000",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton
              productId={product.productId}
              productName={product.name}
              price={product.price}
              selectedSize={selectedSize}
              quantity={quantity}
              image={product.images[0]}
              onSuccess={handleAddToCartSuccess}
            />

            {/* Add to Wishlist Button */}
            <button
              onClick={handleAddToWishlist}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "16px 32px",
                backgroundColor: inWishlist ? "#000000" : "transparent",
                color: inWishlist ? "#ffffff" : "#000000",
                fontSize: "16px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                border: "1px solid #000000",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!inWishlist) {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                }
              }}
              onMouseLeave={(e) => {
                if (!inWishlist) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {inWishlist ? "IN WISHLIST ♥" : "ADD TO WISHLIST ♡"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}