'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Grid3x3, Heart, ShoppingCart, User } from 'lucide-react';
import { useStore } from '@/lib/store';

export function BottomNav() {
  const pathname = usePathname();
  const cart = useStore((state) => state.cart);
  const cartTotal = cart.length;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-16 z-50 md:hidden">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
          isActive('/') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Grid3x3 size={24} />
        <span className="text-xs">Shop</span>
      </Link>

      <Link
        href="/wishlist"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 relative ${
          isActive('/wishlist') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Heart size={24} />
        <span className="text-xs">Wishlist</span>
      </Link>

      <Link
        href="/cart"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 relative ${
          isActive('/cart') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {cartTotal > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartTotal}
            </span>
          )}
        </div>
        <span className="text-xs">Cart</span>
      </Link>

      <Link
        href="/orders"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
          isActive('/orders') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <User size={24} />
        <span className="text-xs">Orders</span>
      </Link>
    </nav>
  );
}
