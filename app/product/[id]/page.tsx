'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, Minus, Plus, Loader, AlertCircle, ShoppingCart, Check, Star, MessageCircle, Truck, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import products from '@/data/products.json';
import { ProductCard } from '@/components/product-card';
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

  // Get recommended products from the same category (excluding current product)
  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return products.products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }, [product]);

  // Mock reviews data
  const mockReviews = [
    { id: 1, user: "John D.", rating: 5, date: "2 days ago", comment: "Excellent product! Really helped improve my engine performance. Highly recommended.", helpful: 24 },
    { id: 2, user: "Sarah M.", rating: 4, date: "1 week ago", comment: "Good quality product. Fast shipping and packaging was secure.", helpful: 18 },
    { id: 3, user: "Mike R.", rating: 5, date: "2 weeks ago", comment: "Been using this for months now. Definitely worth the price.", helpful: 12 },
    { id: 4, user: "Emily K.", rating: 4, date: "3 weeks ago", comment: "Great value for money. Works as described.", helpful: 8 }
  ];

  // Rating breakdown for reviews
  const ratingBreakdown = [
    { stars: 5, count: 65, percentage: 65 },
    { stars: 4, count: 25, percentage: 25 },
    { stars: 3, count: 7, percentage: 7 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 }
  ];

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
      if (!response.ok) throw new Error('Failed to fetch price comparison');
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
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, rating: product.rating, reviews: product.reviews, stock: product.stock });
    }
  };

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, quantity, image: product.image });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-in { animation: slideUp 0.6s ease-out forwards; }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .scale-in { animation: scaleIn 0.4s ease-out; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      <div className="w-full bg-background min-h-screen pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/30">
          <div className="flex items-center justify-between px-4 py-3 h-14">
            <button onClick={() => router.back()} className="p-1 active:scale-90 transition-transform">
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-sm font-semibold">Product Details</h1>
            <button onClick={handleWishlist} className="p-1 active:scale-90 transition-transform">
              <Heart size={28} className={cn('transition-colors', inWishlist ? 'fill-red-500 text-red-500' : '')} />
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="w-full bg-secondary relative overflow-hidden animate-in fade-in">
          <div className="relative w-full" style={{ aspectRatio: '1' }}>
            <Image src={product.image} alt={product.name} fill className="object-cover" priority unoptimized />
          </div>
          <div className="absolute top-4 left-4 scale-in">
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold capitalize">{product.category}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full px-4 py-6 space-y-5">
          {/* Product Name */}
          <div className="animate-in fade-in delay-1">
            <h2 className="text-2xl font-bold text-foreground mb-3">{product.name}</h2>
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
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-2">Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</p>
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
                    <p className="font-bold text-primary text-sm">{p.data.price > 0 ? `$${p.data.price.toFixed(2)}` : 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingPrices && <div className="flex justify-center py-4"><Loader size={20} className="animate-spin text-primary" /></div>}

          {priceError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-500">{priceError}</p>
            </div>
          )}

          {/* Instagram Reels / Video Section - Updated with dummy frames */}
          <div className="animate-in fade-in space-y-3 pb-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Check It Out</h3>
            {product.instagramReels && product.instagramReels.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.instagramReels.map((reelUrl, index) => (
                  <div key={index} className="flex-shrink-0 w-48 h-80 bg-secondary rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <iframe src={reelUrl} width="100%" height="100%" frameBorder="0" scrolling="no" allowFullScreen={true} className="w-full h-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex-shrink-0 w-48 h-80 bg-gradient-to-br from-secondary to-secondary/60 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center mb-3 shadow-lg">
                        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.5 12.134C23.8333 12.9038 23.8333 14.8282 22.5 15.5981L3.75 26.4234C2.41667 27.1932 0.75 26.231 0.75 24.6923L0.75 3.03973C0.75 1.50106 2.41667 0.538808 3.75 1.30861L22.5 12.134Z" fill="white"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">Reel Preview</span>
                      <span className="text-[10px] text-muted-foreground/60 mt-1">Product Video {index}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section with Tabs */}
          <div className="animate-in fade-in space-y-4">
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-secondary/50 h-11">
                <TabsTrigger value="reviews" className="text-xs font-medium flex items-center gap-1.5"><MessageCircle size={14} />Reviews</TabsTrigger>
                <TabsTrigger value="questions" className="text-xs font-medium flex items-center gap-1.5"><MessageCircle size={14} />Questions</TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs font-medium flex items-center gap-1.5"><Truck size={14} />Shipping</TabsTrigger>
              </TabsList>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4 mt-4">
                <div className="bg-secondary/40 rounded-xl p-4 border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">{product.rating.toFixed(1)}</div>
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={star <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {ratingBreakdown.map((item) => (
                        <div key={item.stars} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-3">{item.stars}</span>
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground w-6">{item.count}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-secondary/30 rounded-xl p-4 border border-border/20">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{review.user}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={12} className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'} />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      <button className="text-xs text-muted-foreground mt-2 hover:text-primary transition-colors">Helpful ({review.helpful})</button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Questions Tab */}
              <TabsContent value="questions" className="mt-4">
                <div className="bg-secondary/40 rounded-xl p-6 border border-border/30 text-center">
                  <MessageCircle size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">No questions yet</p>
                  <p className="text-xs text-muted-foreground">Be the first to ask a question about this product</p>
                </div>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="mt-4 space-y-3">
                <div className="bg-secondary/40 rounded-xl p-4 border border-border/30 space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-medium text-foreground">Free Shipping</p><p className="text-xs text-muted-foreground">On orders above $500</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-medium text-foreground">Secure Payment</p><p className="text-xs text-muted-foreground">100% secure payment options</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Loader size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-medium text-foreground">Fast Delivery</p><p className="text-xs text-muted-foreground">Delivery within 2-4 business days</p></div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Recommended Products Section */}
          {recommendedProducts.length > 0 && (
            <div className="animate-in fade-in space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Recommended Products</h3>
                <button className="text-xs text-primary font-medium flex items-center gap-1">See All <ChevronRight size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {recommendedProducts.map((recProduct) => (
                  <ProductCard key={recProduct.id} id={recProduct.id} name={recProduct.name} price={recProduct.price} image={recProduct.image} rating={recProduct.rating} reviews={recProduct.reviews} stock={recProduct.stock} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full bg-gradient-to-t from-background via-background/98 to-transparent px-4 py-3 border-t border-border/30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-secondary/40 border border-border/30 rounded-full px-2.5 py-1.5">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="p-1 disabled:opacity-40 active:scale-90 transition-transform rounded-full hover:bg-secondary/40"><Minus size={18} /></button>
            <span className="text-sm font-bold w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-1 text-primary active:scale-90 transition-transform rounded-full hover:bg-primary/10"><Plus size={18} /></button>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-0.5">TOTAL</p>
            <p className="text-xl font-bold text-primary">${(product.price * quantity).toFixed(2)}</p>
          </div>
          <Button onClick={handleAddToCart} className={cn('px-6 h-12 font-bold text-sm rounded-lg', 'transition-all duration-300 active:scale-95', 'shadow-md hover:shadow-lg', 'flex items-center justify-center gap-1.5 flex-shrink-0', addedToCart ? 'bg-green-500 hover:bg-green-500 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground')}>
            {addedToCart ? <><Check size={18} /><span>Done</span></> : <><ShoppingCart size={18} /><span>Buy</span></>}
          </Button>
        </div>
      </div>
    </>
  );
}
