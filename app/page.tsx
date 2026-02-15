'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Grid3x3, Settings } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { BottomNav } from '@/components/bottom-nav';
import products from '@/data/products.json';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Set scrolled state when user scrolls down
      if (scrollY > 50) {
        setScrolled(true);

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Reset scroll state after scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          // Keep scrolled state when user stops scrolling
        }, 100);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.products.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Get category image from products
  const getCategoryImage = (categoryId: string) => {
    if (categoryId === 'all') return null;
    const categoryProduct = products.products.find(p => p.category === categoryId);
    return categoryProduct?.image || null;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-down { animation: slideDown 0.5s ease-out; }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      {/* Header with Logo/Title - Hidden on scroll */}
      <header
        className={`sticky top-0 z-40 w-full bg-gradient-to-b from-background via-background to-background/80 backdrop-blur-sm border-b border-border/20 transition-all duration-300 ease-in-out ${scrolled ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}
      >
        <div className="px-4 pt-4 pb-3">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4 animate-slide-down">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Grid3x3 size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Shop</h1>
                <p className="text-xs text-muted-foreground">Browse all products</p>
              </div>
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors active:scale-90">
              <Settings size={22} className="text-foreground" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative animate-slide-down stagger-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/60 border border-border/30 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-secondary/80 transition-all rounded-xl h-11"
            />
          </div>
        </div>

        {/* Categories - New horizontal scroll style with images */}
        <div className="px-4 pb-3 animate-slide-down stagger-2">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-1">
            {products.categories.map((category, idx) => {
              const categoryImage = getCategoryImage(category.id);
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{ animationDelay: `${0.05 * idx}s` }}
                  className={`flex-shrink-0 transition-all duration-300 active:scale-95 flex flex-col items-center gap-2 ${isActive ? 'scale-105' : 'opacity-80 hover:opacity-100'
                    }`}
                >
                  {/* Category Image - Round shape 70px */}
                  <div
                    className={`w-[70px] h-[70px] rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${isActive
                        ? 'bg-[#2ECC71] shadow-lg shadow-[#2ECC71]/30'
                        : 'bg-[#121212]'
                      }`}
                  >
                    {category.id === 'all' ? (
                      <Grid3x3 size={28} className={isActive ? 'text-white' : 'text-gray-400'} />
                    ) : categoryImage ? (
                      <Image
                        src={categoryImage}
                        alt={category.name}
                        width={50}
                        height={50}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <Grid3x3 size={28} className={isActive ? 'text-white' : 'text-gray-400'} />
                    )}
                  </div>

                  {/* Category Name */}
                  <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-[#2ECC71]' : 'text-muted-foreground'
                    }`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Scroll-triggered Search Bar - Appears on right side when scrolled */}
      <div
        className={`fixed top-3 right-3 z-50 transition-all duration-300 ease-in-out ${scrolled
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-secondary/90 transition-all rounded-full h-10 w-48 shadow-lg"
          />
        </div>
      </div>

      {/* Products Section */}
      <main className="px-4 pt-6">
        {/* Header with count */}
        <div className="mb-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {activeCategory === 'all'
                  ? 'All Products'
                  : products.categories.find(c => c.id === activeCategory)?.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                style={{
                  animation: `slideUp 0.5s ease-out ${0.05 * idx}s backwards`,
                }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  reviews={product.reviews}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground mb-1">No products found</p>
              <p className="text-sm text-muted-foreground">Try a different search or category</p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm active:scale-95 transition-transform"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
