# E-Commerce App Setup Guide

## Quick Start

Your e-commerce platform is ready to use! Here's what you have:

### ✅ Completed Features

1. **Home/Shop Page** (`/`)
   - Browse products by category
   - Search functionality
   - 2-column grid layout optimized for mobile
   - Bottom navigation for easy access

2. **Product Detail Page** (`/product/[id]`)
   - Full product information
   - Specifications list
   - Rating and reviews
   - Quantity selector
   - **Gemini AI Price Comparison** - Shows estimated prices on:
     - Amazon
     - Flipkart
     - Blinkit
   - Instagram reels/videos display
   - Add to cart and wishlist

3. **Shopping Cart** (`/cart`)
   - View all items
   - Adjust quantities
   - Remove items
   - Calculate subtotal, shipping, and tax
   - Checkout button

4. **Wishlist** (`/wishlist`)
   - Save favorite products
   - Quick add to cart
   - Remove from wishlist

5. **Order History** (`/orders`)
   - View all placed orders
   - Order status tracking
   - Item details and totals
   - Leave rating option

6. **Bottom Navigation**
   - Shop, Wishlist, Cart, Orders
   - Cart badge shows item count
   - Mobile-optimized layout

## How to Edit Products

### Adding New Products

1. Open `data/products.json`
2. Add a new product object to the `products` array:

```json
{
  "id": "7",
  "name": "Your Product Name",
  "category": "electronics",
  "price": 199.99,
  "originalPrice": 299.99,
  "rating": 4.5,
  "reviews": 42,
  "stock": 25,
  "image": "https://your-image-url.com/image.jpg",
  "description": "Product description",
  "specs": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "instagramReels": [
    "https://www.instagram.com/p/INSTAGRAM_POST_ID/embed"
  ]
}
```

### Adding Categories

Categories are also in `data/products.json`:

```json
{
  "categories": [
    {
      "id": "your-category",
      "name": "Display Name",
      "icon": "icon-name"
    }
  ]
}
```

Use category IDs in your products to filter them.

### Finding Instagram Post IDs

1. Go to an Instagram post/reel
2. Click "..." → "Copy link"
3. The link format: `https://www.instagram.com/p/POST_ID/`
4. Use: `https://www.instagram.com/p/POST_ID/embed`

## Google Gemini API Setup

### Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the API key

### Add to Your Project

Create `.env.local` file in the root directory:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

The price comparison will automatically work on the product detail page.

## File Structure for Easy Editing

```
data/products.json          ← Edit this to add/update products
├── categories[]            ← Product categories
└── products[]              ← Product list
    ├── id                  ← Unique identifier
    ├── name                ← Product name
    ├── category            ← Category ID
    ├── price               ← Current price
    ├── originalPrice       ← Marked price (for discount %)
    ├── rating              ← 0-5 stars
    ├── reviews             ← Number of reviews
    ├── stock               ← Quantity available
    ├── image               ← Image URL
    ├── description         ← Full description
    ├── specs[]             ← Features/specifications
    └── instagramReels[]    ← Instagram embed URLs
```

## Running Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3000
```

## State Management

All shopping data (cart, wishlist, orders) is stored in memory using Zustand:
- **Cart**: Products added for checkout
- **Wishlist**: Saved favorite items
- **Orders**: Order history after checkout

**Note:** Data is lost on page refresh. To persist data, configure Zustand middleware with localStorage or a database.

## Customizing the App

### Colors & Styling

Edit `app/globals.css` to change:
- Primary color (green accent)
- Background colors
- Border colors
- Text colors

All colors use CSS variables that can be changed in the `:root` section.

### App Metadata

Edit `app/layout.tsx` to change:
- App title
- App description
- Viewport settings

## Troubleshooting

### Product images not loading
- Check image URLs are accessible from the internet
- Use CORS-friendly image services (Unsplash, Pexels, etc.)
- Ensure URLs start with `https://`

### Price comparison not working
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set
- Check browser console for errors
- Ensure API key has proper permissions

### Instagram reels not displaying
- Use the embed URL format: `https://www.instagram.com/p/[POST_ID]/embed`
- Ensure the Instagram account is public
- Clear browser cache if embeds appear broken

## Next Steps

Ready to deploy? You can:

1. **Deploy to Vercel** - Click "Publish" button
2. **Deploy to Other Platforms** - Use `pnpm build && pnpm start`
3. **Add Database** - Connect Supabase, Neon, or another DB
4. **Add Payments** - Integrate Stripe for checkout
5. **Add Authentication** - Implement user accounts

## Support

For questions or issues:
- Check the main README.md for detailed documentation
- Review the code comments in component files
- Check browser console for error messages

Enjoy your e-commerce platform! 🎉
