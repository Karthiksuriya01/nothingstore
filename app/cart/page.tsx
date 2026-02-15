'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import Link from 'next/link';

const SHIPPING_COST = 10;
const TAX_RATE = 0.1;

export default function CartPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const addOrder = useStore((state) => state.addOrder);
  const clearCart = useStore((state) => state.clearCart);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const orderId = `ORDER_${Date.now().toString(36).toUpperCase()}`;
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    addOrder({
      id: orderId,
      items: cart,
      total,
      status: 'pending',
      date,
    });

    clearCart();
    router.push('/orders');
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
        <h1 className="text-lg font-semibold flex-1 text-center">Cart</h1>
        <div className="w-10 text-right text-sm text-muted-foreground">
          {cart.length} items
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg overflow-hidden border border-border p-3"
              >
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.price} each
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-secondary rounded px-2 py-1">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-0.5 hover:bg-background rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                          className="p-0.5 hover:bg-background rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-red-500 flex-shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-card rounded-lg border border-border p-4 mt-6 space-y-3">
              <h3 className="font-semibold text-foreground mb-3">Summary</h3>

              <div className="space-y-2 border-b border-border pb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">
                    ${SHIPPING_COST.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground font-medium">
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            >
              Checkout →
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-muted-foreground">Your cart is empty</p>
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
