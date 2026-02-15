'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  stock,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const addToCart = useStore((state) => state.addToCart);
  const inWishlist = isInWishlist(id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        image,
        rating,
        reviews,
        stock,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-card rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300 border border-border/30 hover:border-primary/20">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-secondary aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 rounded-full p-2 backdrop-blur-sm transition-all duration-300',
              inWishlist
                ? 'bg-red-500/90 text-white'
                : 'bg-background/60 hover:bg-background/80 text-foreground'
            )}
          >
            <Heart
              size={18}
              className={cn(
                'transition-all duration-300',
                inWishlist && 'fill-current'
              )}
            />
          </button>

          {/* Stock Badge */}
          <div className="absolute bottom-3 left-3">
            <span className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full',
              stock > 20
                ? 'bg-green-500/90 text-white'
                : stock > 0
                  ? 'bg-yellow-500/90 text-white'
                  : 'bg-red-500/90 text-white'
            )}>
              {stock > 20 ? '✓ In stock' : stock > 0 ? `${stock} left` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-grow space-y-2">
          {/* Name */}
          <h3 className="font-bold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">{name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={cn(
              'mt-auto w-full font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 transition-all duration-300 active:scale-95',
              added
                ? 'bg-green-500/90 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground',
              stock === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            {added ? (
              <>
                <Check size={18} />
                <span className="text-xs">Added!</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span className="text-xs">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
