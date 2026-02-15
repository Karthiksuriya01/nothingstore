'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, Minus, Plus, Loader, AlertCircle, ShoppingCart } from 'lucide-react';
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
  const [addedToCart, setAddedToCart] = useState(false);

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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-4 py-3 transition-all duration-300">
        <button
          onClick={() => router.back()}
          className="p-2.5 hover:bg-secondary rounded-full transition-all duration-200 active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-semibold flex-1 text-center">Product Details</h1>
        <button
          onClick={handleWishlist}
          className="p-2.5 hover:bg-secondary rounded-full transition-all duration-200 active:scale-90"
        >
          <Heart
            size={24}
            className={cn(
              'transition-all duration-300',
              inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'
            )}
          />
        </button>
      </div>

      {/* Product Image - Full Width with Smooth Entrance */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/50 to-background animate-image-slide-up">
        <div className="relative aspect-square w-full bg-secondary flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Category Badge */}
        <div className="absolute top-6 left-6 z-10 animate-fade-down">
          <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold capitalize shadow-lg">
            {product.category}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-4 pt-6 pb-6 space-y-6">
        {/* Product Name and Rating Card */}
        <div className="animate-fade-up-delay-1 space-y-3">
          <h1 className="text-2xl font-bold text-foreground leading-tight">{product.name}</h1>

          {/* Rating and Stock Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="font-semibold text-sm">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-xs">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                {product.stock} in stock
              </span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="animate-fade-up-delay-2 space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
            <span className="text-lg text-muted-foreground line-through font-medium">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
            Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
          </div>
        </div>

        {/* Description */}
        <div className="animate-fade-up-delay-3 space-y-2">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Description</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
        </div>

        {/* Specs */}
        <div className="animate-fade-up-delay-4 space-y-3">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Specifications</h3>
          <div className="grid grid-cols-1 gap-2">
            {product.specs.map((spec, index) => (
              <div key={index} className="text-sm text-muted-foreground flex items-center gap-2.5 group hover:text-foreground transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-200"></span>
                {spec}
              </div>
            ))}
          </div>
        </div>

        {/* Price Comparison */}
        <div className="animate-fade-up-delay-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Market Prices</h3>
            {loadingPrices && <Loader size={16} className="animate-spin text-primary" />}
          </div>

          {priceError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-500">{priceError}</p>
            </div>
          )}

          {priceComparison && (
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { name: 'Amazon', data: priceComparison.amazon },
                { name: 'Flipkart', data: priceComparison.flipkart },
                { name: 'Blinkit', data: priceComparison.blinkit },
              ].map((platform, idx) => (
                <div
                  key={platform.name}
                  className="bg-secondary/50 hover:bg-secondary rounded-lg p-3.5 flex items-center justify-between transition-all duration-200 hover:shadow-md transform hover:scale-101"
                  style={{
                    animation: `slideInRight 0.4s ease ${0.05 * idx}s backwards`,
                  }}
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{platform.name}</p>
                    {platform.data.price > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {platform.data.discount}% off
                      </p>
                    )}
                  </div>
                  <p className="text-base font-bold text-primary">
                    {platform.data.price > 0 ? `$${platform.data.price.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instagram Reels */}
        {product.instagramReels && product.instagramReels.length > 0 && (
          <div className="animate-fade-up-delay-6 space-y-3">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">Instagram Reels</h3>
            <div className="space-y-3">
              {product.instagramReels.map((reelUrl, index) => (
                <div key={index} className="bg-secondary rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
      </div>

      {/* Fixed Bottom Bar - Total Price & Add to Cart */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="pointer-events-auto space-y-3 animate-price-slide-up">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-3 bg-secondary/60 backdrop-blur rounded-full w-fit mx-auto px-3 py-2 shadow-lg border border-border/20 hover:bg-secondary transition-colors duration-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2 rounded-full transition-all duration-200 hover:bg-secondary/80 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="text-base font-bold w-8 text-center tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-full transition-all duration-200 hover:bg-primary/20 active:scale-90 text-primary"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Total Price Display */}
          <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Total Price</p>
            <p className="text-3xl font-bold text-primary tabular-nums">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add to Cart Button - Floating */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-4 bg-gradient-to-t from-background from-80% to-transparent">
        <Button
          onClick={handleAddToCart}
          className={cn(
            'w-full h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-300',
            'hover:shadow-xl active:scale-95 transform',
            'flex items-center justify-center gap-2',
            'bg-primary hover:bg-primary/90',
            'group animate-bounce-gentle',
            addedToCart && 'bg-green-500 hover:bg-green-500'
          )}
        >
          <ShoppingCart
            size={20}
            className={cn(
              'transition-transform duration-300',
              addedToCart && 'scale-110 rotate-12'
            )}
          />
          <span>
            {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
          </span>
        </Button>
      </div>

      <BottomNav />

      {/* Apple-Inspired Animations */}
      <style jsx>{`
        @keyframes imageSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUpDelay {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes priceSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .animate-image-slide-up {
          animation: imageSlideUp 0.5s ease-out;
        }

        .animate-fade-down {
          animation: fadeDown 0.4s ease-out;
        }

        .animate-fade-up-delay-1 {
          animation: fadeUpDelay 0.4s ease-out 0.1s backwards;
        }

        .animate-fade-up-delay-2 {
          animation: fadeUpDelay 0.4s ease-out 0.15s backwards;
        }

        .animate-fade-up-delay-3 {
          animation: fadeUpDelay 0.4s ease-out 0.2s backwards;
        }

        .animate-fade-up-delay-4 {
          animation: fadeUpDelay 0.4s ease-out 0.25s backwards;
        }

        .animate-fade-up-delay-5 {
          animation: fadeUpDelay 0.4s ease-out 0.3s backwards;
        }

        .animate-fade-up-delay-6 {
          animation: fadeUpDelay 0.4s ease-out 0.35s backwards;
        }

        .animate-price-slide-up {
          animation: priceSlideUp 0.4s ease-out 0.2s backwards;
        }

        .animate-bounce-gentle {
          animation: bounceGentle 2s infinite;
        }

        /* Smooth scaling on hover */
        .hover\:scale-101:hover {
          transform: scale(1.01);
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
