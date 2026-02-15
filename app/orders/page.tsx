'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Truck, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BottomNav } from '@/components/bottom-nav';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const orders = useStore((state) => state.orders);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check size={20} className="text-green-500" />;
      case 'shipped':
        return <Truck size={20} className="text-blue-500" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500';
      case 'shipped':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-foreground';
    }
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
        <h1 className="text-lg font-semibold flex-1 text-center">My Orders</h1>
        <div className="w-10"></div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-semibold text-foreground">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    <p className="font-semibold text-lg text-primary">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary py-3 font-medium transition-colors">
                Leave Rating
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-muted-foreground">No orders yet</p>
            <Link href="/" className="text-primary text-sm hover:underline">
              Start shopping
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
