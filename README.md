# E-Commerce Mobile App

A modern, mobile-first e-commerce platform built with Next.js 16, React 19, and Tailwind CSS. Features product browsing, wishlist management, shopping cart, order history, and AI-powered price comparison using Google Gemini.

## Features

- 📱 **Mobile-First Design** - Fully optimized for mobile devices with bottom navigation
- 🛍️ **Product Catalog** - Browse products by category with search functionality
- ❤️ **Wishlist** - Save favorite items for later
- 🛒 **Shopping Cart** - Full cart management with quantity controls
- 📦 **Order History** - Track your orders and their status
- 🤖 **AI Price Comparison** - View estimated prices on Amazon, Flipkart, and Blinkit using Google Gemini
- 📺 **Instagram Reels** - Display product videos/reels from Instagram
- 🎨 **Dark Theme** - Beautiful dark theme optimized for mobile viewing

## Project Structure

```
├── app/
│   ├── page.tsx              # Shop/Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles with design tokens
│   ├── api/
│   │   └── compare-prices/   # Gemini AI price comparison API
│   ├── product/
│   │   └── [id]/page.tsx     # Product detail page
│   ├── wishlist/page.tsx     # Wishlist page
│   ├── cart/page.tsx         # Shopping cart page
│   └── orders/page.tsx       # Order history page
├── components/
│   ├── bottom-nav.tsx        # Mobile navigation component
│   ├── product-card.tsx      # Product card component
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── store.ts             # Zustand store for state management
│   └── utils.ts             # Utility functions
├── data/
│   └── products.json        # Product data (editable)
└── public/                  # Static assets
```

## Data Structure

### Product Data (data/products.json)

The products are stored in a JSON file that you can easily edit. Here's the structure:

```json
{
  "categories": [
    {
      "id": "electronics",
      "name": "Electronics",
      "icon": "zap"
    }
  ],
  "products": [
    {
      "id": "1",
      "name": "Product Name",
      "category": "electronics",
      "price": 299.99,
      "originalPrice": 399.99,
      "rating": 4.5,
      "reviews": 128,
      "stock": 32,
      "image": "https://example.com/image.jpg",
      "description": "Product description here",
      "specs": [
        "Feature 1",
        "Feature 2",
        "Feature 3"
      ],
      "instagramReels": [
        "https://www.instagram.com/p/XXX/embed",
        "https://www.instagram.com/p/YYY/embed"
      ]
    }
  ]
}
```

### Product Fields

- **id**: Unique identifier for the product
- **name**: Product name
- **category**: Category ID (must match a category in the categories array)
- **price**: Current selling price
- **originalPrice**: Original/marked price for discount calculation
- **rating**: Star rating (0-5)
- **reviews**: Number of reviews
- **stock**: Quantity in stock
- **image**: Product image URL
- **description**: Full product description
- **specs**: Array of product specifications/features
- **instagramReels**: Array of Instagram embed URLs for product videos/reels

### Instagram Reels Format

To add Instagram reels, use the embed format:
```
https://www.instagram.com/p/[POST_ID]/embed
```

Get the POST_ID from the Instagram URL of your reel/post.

## Updating Products

To update or add products:

1. Open `data/products.json`
2. Edit or add product objects with the structure above
3. Changes will be reflected immediately in development mode
4. For production, rebuild the application

## Environment Variables

Create a `.env.local` file with:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## State Management

The app uses Zustand for state management. All state is stored in `lib/store.ts`:

- **Cart**: Products added to cart with quantities
- **Wishlist**: Saved favorite items
- **Orders**: Order history with status tracking

State is managed in-memory (not persisted between sessions). To add persistence, consider using Zustand middleware with localStorage or a database.

## Styling

The app uses Tailwind CSS with custom design tokens for:
- **Primary Color**: Green (#22C55E - emerald)
- **Background**: Dark theme (dark gray)
- **Text**: Light gray/white for contrast

All color tokens are defined in `app/globals.css` and can be customized.

## API Routes

### `/api/compare-prices` (POST)

Compares product prices across platforms using Google Gemini AI.

**Request:**
```json
{
  "productName": "Smart Watch Series 5",
  "basePrice": 299.99
}
```

**Response:**
```json
{
  "productName": "Smart Watch Series 5",
  "basePrice": 299.99,
  "marketPrices": {
    "amazon": { "price": 289.99, "discount": 15 },
    "flipkart": { "price": 279.99, "discount": 20 },
    "blinkit": { "price": 0, "discount": 0 }
  }
}
```

## Mobile Optimization

The app is optimized for mobile with:
- Bottom navigation for easy thumb access
- Touch-friendly buttons and inputs
- Responsive grid layout (2 columns)
- Proper viewport configuration
- No pinch-zoom disabled for accessibility

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:3000`

## Color Scheme

- **Primary (Green)**: Actions, highlights, active states
- **Background (Dark)**: Page background
- **Card**: Slightly lighter than background for cards/containers
- **Foreground**: Text and primary content
- **Muted**: Secondary text and icons

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Payment integration (Stripe)
- [ ] Persistent storage (database)
- [ ] Admin dashboard for product management
- [ ] Real-time inventory management
- [ ] Review and rating system
- [ ] Recommendation engine
- [ ] Multi-language support

## License

This project is open source and available for personal and commercial use.
