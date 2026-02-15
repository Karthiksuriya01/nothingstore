# Quick Reference Guide

## 🚀 Start Development
```bash
pnpm install    # Install dependencies
pnpm dev        # Run development server
# Visit: http://localhost:3000
```

## 📝 Edit Products
**File**: `data/products.json`

Add product to `products` array:
```json
{
  "id": "7",
  "name": "Product Name",
  "category": "electronics",
  "price": 99.99,
  "originalPrice": 149.99,
  "rating": 4.5,
  "reviews": 50,
  "stock": 25,
  "image": "https://images.unsplash.com/...",
  "description": "Description",
  "specs": ["Feature 1", "Feature 2"],
  "instagramReels": []
}
```

## 🔑 Setup API Key
**File**: `.env.local`
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

Get from: https://aistudio.google.com/app/apikey

## 🎨 Change Colors
**File**: `app/globals.css`

Change in `:root` section:
```css
--primary: 141 76% 36%;      /* Green */
--background: 12 7% 8%;      /* Dark */
--foreground: 0 0% 95%;      /* Light text */
```

## 📱 App Pages

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `app/page.tsx` | Shop/Home |
| `/product/[id]` | `app/product/[id]/page.tsx` | Product details |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/wishlist` | `app/wishlist/page.tsx` | Saved items |
| `/orders` | `app/orders/page.tsx` | Order history |

## 🛠️ Key Components

```tsx
// Import and use
import { ProductCard } from '@/components/product-card';
import { BottomNav } from '@/components/bottom-nav';
import { useStore } from '@/lib/store';

// Store usage
const cart = useStore((state) => state.cart);
const addToCart = useStore((state) => state.addToCart);
```

## 📊 Store Actions

```typescript
// Cart
useStore((state) => state.addToCart(item))
useStore((state) => state.removeFromCart(id))
useStore((state) => state.updateCartQuantity(id, qty))
useStore((state) => state.clearCart())

// Wishlist
useStore((state) => state.addToWishlist(item))
useStore((state) => state.removeFromWishlist(id))
useStore((state) => state.isInWishlist(id))

// Orders
useStore((state) => state.addOrder(order))
```

## 🌐 API Routes

```
POST /api/compare-prices
  Request: { productName, basePrice }
  Response: { marketPrices: { amazon, flipkart, blinkit } }
```

## 🎯 Common Tasks

### Add New Category
Edit `data/products.json`:
```json
{
  "categories": [
    {
      "id": "new-category",
      "name": "Display Name",
      "icon": "icon-name"
    }
  ]
}
```

### Add Instagram Reel
1. Get reel URL: `instagram.com/p/POST_ID/`
2. Add to product:
```json
"instagramReels": [
  "https://www.instagram.com/p/POST_ID/embed"
]
```

### Change App Title
**File**: `app/layout.tsx`
```typescript
export const metadata: Metadata = {
  title: 'Your Store Name',
  description: 'Your description',
};
```

### Customize Typography
**File**: `app/layout.tsx`
```typescript
import { YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })

// Update tailwind.config.ts fontFamily
```

## 🔧 Development Tips

### Hot Reload
- Edit files, save, and page auto-refreshes
- No need to restart dev server

### Debug State
```javascript
// In browser console
useStore.getState() // View all store state
```

### Mobile Testing
- Open DevTools (F12)
- Click device icon
- Select phone/tablet

### Check Errors
- DevTools Console → Errors/Warnings
- Network tab → API responses
- Application tab → Storage

## 📦 Build & Deploy

### Build for Production
```bash
pnpm build
pnpm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repo on Vercel
3. Set `GOOGLE_GENERATIVE_AI_API_KEY` env var
4. Deploy

## 📁 File Locations

```
Configuration
  └─ tailwind.config.ts, tsconfig.json, next.config.mjs

Styles
  └─ app/globals.css

Data
  └─ data/products.json

Components
  ├─ components/bottom-nav.tsx
  ├─ components/product-card.tsx
  └─ components/ui/

State
  └─ lib/store.ts

Pages
  ├─ app/page.tsx
  ├─ app/product/[id]/page.tsx
  ├─ app/cart/page.tsx
  ├─ app/wishlist/page.tsx
  └─ app/orders/page.tsx

API
  └─ app/api/compare-prices/route.ts
```

## 🐛 Common Issues

### "API key not configured"
- Create `.env.local`
- Add: `GOOGLE_GENERATIVE_AI_API_KEY=...`
- Restart dev server

### Products not showing
- Check `data/products.json` JSON validity
- Ensure product `category` exists in categories array
- Check image URLs are accessible

### Images not loading
- Verify image URL starts with `https://`
- Check image domain is accessible
- Try different image service

### Price comparison failing
- Check API key is valid
- Verify `.env.local` is loaded
- Check browser console for errors

### Wishlist/Cart not persisting
- This is normal (in-memory state)
- Add localStorage for persistence
- Use database for production

## 📚 Useful Links

| Resource | URL |
|----------|-----|
| Next.js Docs | https://nextjs.org/docs |
| React Docs | https://react.dev |
| Tailwind CSS | https://tailwindcss.com |
| Zustand | https://github.com/pmndrs/zustand |
| Google Gemini | https://ai.google.dev |
| Lucide Icons | https://lucide.dev |
| Shadcn UI | https://ui.shadcn.com |

## ⚡ Performance Checklist

- [ ] Images are optimized (using Next.js Image)
- [ ] Product data loads quickly
- [ ] No console errors
- [ ] Lighthouse score 90+
- [ ] Mobile load time < 2s
- [ ] All pages responsive

## 🚀 Deployment Checklist

- [ ] API key configured
- [ ] All products added
- [ ] Colors customized
- [ ] App title updated
- [ ] Images verified
- [ ] Mobile tested
- [ ] Built successfully
- [ ] Deployed to Vercel

## 📞 Quick Help

**Page doesn't load?**
- Check console for errors
- Try hard refresh (Ctrl+Shift+R)
- Restart dev server

**Product not found?**
- Check product ID is correct
- Verify JSON file syntax
- Check product exists in data

**State not updating?**
- Ensure using Zustand hook correctly
- Check store is exported properly
- Verify component is client-side ('use client')

**Styling not working?**
- Check class names are valid Tailwind
- Clear browser cache
- Restart dev server

---

**Need more help?** Check the full documentation files:
- `README.md` - Full feature overview
- `SETUP_GUIDE.md` - Detailed setup
- `GEMINI_SETUP.md` - AI integration
- `MOBILE_DESIGN.md` - Mobile optimization
- `PROJECT_SUMMARY.md` - Complete overview
