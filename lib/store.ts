// Store management utilities for cart and wishlist
import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
}

interface StoreState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  addOrder: (order: Order) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],
  wishlist: [],
  orders: [],

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateCartQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  addToWishlist: (item) =>
    set((state) => {
      const exists = state.wishlist.find((i) => i.id === item.id);
      if (exists) return state;
      return { wishlist: [...state.wishlist, item] };
    }),

  removeFromWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== id),
    })),

  isInWishlist: (id) => {
    const state = get();
    return state.wishlist.some((item) => item.id === id);
  },

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
}));
