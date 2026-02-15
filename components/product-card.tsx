'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

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
  };

  return (
    <Link href={`/product/${id}`}>
      <div className="bg-card rounded-lg overflow-hidden group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden bg-secondary aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-background/80 backdrop-blur rounded-full p-2 hover:bg-background transition-colors"
          >
            <Heart
              size={20}
              className={cn(
                inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </button>
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{name}</h3>

          <div className="flex items-center gap-2 mb-2 text-xs">
            <span className="flex items-center">
              <span className="text-yellow-400">★</span> {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">({reviews})</span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-primary">${price}</span>
          </div>

          <div className="mt-auto flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md py-2 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
