'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, Minus, Plus, Loader, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import products from '@/data/products.json';
import { cn } from '@/lib/utils';

interface PriceComparison {
  amazon: { price: number; discount: number };
  flipkart: { price: number; discount: number };
  blinkit: { price: number; discount: number };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [quantity, setQuantity] = useState(1);
  const [priceComparison, setPriceComparison] = useState<PriceComparison | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);

  const product = products.products.find((p) => p.id === productId);
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product) {
      fetchPriceComparison(product.name, product.price);
    }
  }, [product]);

  const fetchPriceComparison = async (name: string, basePrice: number) => {
    setLoadingPrices(true);
    setPriceError(null);
    try {
      const response = await fetch('/api/compare-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: name, basePrice }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch price comparison');
      }

      const data = await response.json();
      setPriceComparison(data.marketPrices);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPriceError('Unable to fetch price comparison at this time');
    } finally {
      setLoadingPrices(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        stock: product.stock,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">Product Details</h1>
        <button
          onClick={handleWishlist}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <Heart
            size={24}
            className={cn(
              inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'
            )}
          />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">
                ({product.reviews} reviews)
              </span>
            </div>
            <div className="text-sm font-medium text-primary">
              {product.stock} in stock
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-primary">${product.price}</span>
            <span className="text-lg text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
            <span className="text-sm font-semibold text-green-500">
              {Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) *
                  100
              )}
              % off
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>

        {/* Specs */}
        <div>
          <h3 className="font-semibold text-foreground mb-2">Specifications</h3>
          <ul className="space-y-2">
            {product.specs.map((spec, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                {spec}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Comparison */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Market Prices</h3>
            {loadingPrices && <Loader size={16} className="animate-spin text-primary" />}
          </div>

          {priceError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-500">{priceError}</p>
            </div>
          )}

          {priceComparison && (
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'Amazon', data: priceComparison.amazon },
                { name: 'Flipkart', data: priceComparison.flipkart },
                { name: 'Blinkit', data: priceComparison.blinkit },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className="bg-secondary rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{platform.name}</p>
                    {platform.data.price > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {platform.data.discount}% off
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {platform.data.price > 0 ? `$${platform.data.price}` : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instagram Reels */}
        {product.instagramReels && product.instagramReels.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Instagram Reels</h3>
            <div className="space-y-3">
              {product.instagramReels.map((reelUrl, index) => (
                <div key={index} className="bg-secondary rounded-lg overflow-hidden">
                  <iframe
                    src={reelUrl}
                    width="100%"
                    height="400"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen={true}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Quantity</h3>
          <div className="flex items-center gap-4 bg-secondary rounded-full w-fit p-3 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-full transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Decrease quantity"
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-full transition-all duration-150 active:scale-95 bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Increase quantity"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Fixed Bottom Bar for Total Price & Add to Cart */}
        <div className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-50 flex items-center justify-between px-4 py-3 shadow-lg animate-fade-in">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Total Price</span>
            <span className="text-2xl font-bold text-primary">${(product.price * quantity).toFixed(2)}</span>
          </div>
          <Button
            onClick={() => {
              handleAddToCart();
              // Animation: subtle cart bounce
              const btn = document.getElementById('add-to-cart-btn');
              if (btn) {
                btn.classList.add('animate-bounce-short');
                setTimeout(() => btn.classList.remove('animate-bounce-short'), 300);
              }
            }}
            id="add-to-cart-btn"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base rounded-full px-6 shadow-md transition-all duration-150 active:scale-98"
          >
            <span className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M6 6h15l-1.5 9h-13z"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></svg>
              Add to Cart
            </span>
          </Button>
        </div>
      </div>

      <BottomNav />

      {/* Animations CSS */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-short {
          animation: bounceShort 0.3s cubic-bezier(.68,-.55,.27,1.55);
        }
        @keyframes bounceShort {
          0% { transform: scale(1); }
          30% { transform: scale(1.08); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
