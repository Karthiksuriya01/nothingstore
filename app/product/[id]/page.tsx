'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, Minus, Plus, Loader, AlertCircle, ShoppingCart, Check } from 'lucide-react';
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
    <>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in { animation: slideUp 0.6s ease-out forwards; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .scale-in { animation: scaleIn 0.4s ease-out; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      <div className="w-full bg-background min-h-screen pb-40">
        {/* Header */}
        <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/30">
          <div className="flex items-center justify-between px-4 py-3 h-14">
            <button
              onClick={() => router.back()}
              className="p-1 active:scale-90 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-sm font-semibold">Product Details</h1>
            <button
              onClick={handleWishlist}
              className="p-1 active:scale-90 transition-transform"
            >
              <Heart
                size={28}
                className={cn(
                  'transition-colors',
                  inWishlist ? 'fill-red-500 text-red-500' : ''
                )}
              />
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="w-full bg-secondary relative overflow-hidden animate-in fade-in">
          <div className="relative w-full" style={{ aspectRatio: '1' }}>
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
          <div className="absolute top-4 left-4 scale-in">
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold capitalize">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full px-4 py-6 space-y-5">
          {/* Product Name */}
          <div className="animate-in fade-in delay-1">
            <h2 className="text-2xl font-bold text-foreground mb-3">{product.name}</h2>

            {/* Rating & Stock */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-secondary/60 px-3 py-2 rounded-lg">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">{product.stock} in stock</span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="animate-in fade-in delay-2 bg-secondary/40 rounded-xl p-4 border border-border/30">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-base text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            </div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </p>
          </div>

          {/* Description */}
          <div className="animate-in fade-in delay-3 space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Specs */}
          <div className="animate-in fade-in delay-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Features</h3>
            <div className="space-y-2">
              {product.specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  {spec}
                </div>
              ))}
            </div>
          </div>

          {/* Price Comparison Section */}
          {priceComparison && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Compare Prices</h3>
              <div className="grid gap-2">
                {[
                  { name: 'Amazon', data: priceComparison.amazon },
                  { name: 'Flipkart', data: priceComparison.flipkart },
                  { name: 'Blinkit', data: priceComparison.blinkit },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between bg-secondary/40 border border-border/30 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      {p.data.price > 0 && <p className="text-xs text-muted-foreground">{p.data.discount}% off</p>}
                    </div>
                    <p className="font-bold text-primary text-sm">
                      {p.data.price > 0 ? `$${p.data.price.toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingPrices && (
            <div className="flex justify-center py-4">
              <Loader size={20} className="animate-spin text-primary" />
            </div>
          )}

          {priceError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-500">{priceError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-4 px-4">
        {/* Total Price Display */}
        <div className="text-center mb-3">
          <p className="text-xs text-muted-foreground font-medium mb-1">TOTAL PRICE</p>
          <p className="text-3xl font-bold text-primary">${(product.price * quantity).toFixed(2)}</p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-4 bg-secondary/60 backdrop-blur-sm rounded-full py-2.5 px-4 w-fit mx-auto mb-3 shadow-md border border-border/20">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="p-1.5 disabled:opacity-40 active:scale-90 transition-transform"
          >
            <Minus size={20} />
          </button>
          <span className="text-lg font-bold w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-1.5 text-primary active:scale-90 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className={cn(
            'w-full h-14 font-bold text-base rounded-xl',
            'transition-all duration-300 active:scale-95',
            'shadow-lg hover:shadow-xl',
            'flex items-center justify-center gap-2',
            addedToCart
              ? 'bg-green-500 hover:bg-green-500 text-white'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          )}
        >
          {addedToCart ? (
            <>
              <Check size={20} className="scale-in" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
}
