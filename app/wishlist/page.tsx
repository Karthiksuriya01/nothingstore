'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import Link from 'next/link';

export default function WishlistPage() {
  const router = useRouter();
  const wishlist = useStore((state) => state.wishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
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
        <h1 className="text-lg font-semibold flex-1 text-center">Wishlist</h1>
        <div className="w-10 text-right text-sm text-muted-foreground">
          {wishlist.length} items
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="p-4 space-y-3">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg overflow-hidden border border-border"
            >
              <div className="flex gap-3 p-3">
                {/* Product Image */}
                <Link href={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="text-yellow-400">★</span>
                      <span>{item.rating.toFixed(1)}</span>
                      <span>({item.reviews})</span>
                    </div>
                    <p className="text-sm text-green-500 mt-1">
                      {item.stock} in stock
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary">${item.price}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-red-500 flex-shrink-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-muted-foreground">Your wishlist is empty</p>
            <Link href="/" className="text-primary text-sm hover:underline">
              Continue shopping
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
