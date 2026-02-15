# Getting Started - Complete Checklist

Welcome! Your e-commerce platform is ready. Follow these steps to get running:

## ✅ Step 1: Installation (5 minutes)

### 1.1 Install Dependencies
```bash
pnpm install
```

Wait for installation to complete (shows "✓ Done" message).

### 1.2 Verify Installation
```bash
pnpm --version
# Should show: 9.x.x or higher
```

## ✅ Step 2: Configure Environment (2 minutes)

### 2.1 Create Environment File
In your project root, create a new file: `.env.local`

### 2.2 Add API Key
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

### 2.3 Get Your API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the generated key
4. Paste into `.env.local`

**Without this, price comparison won't work but the app will still run!**

## ✅ Step 3: Run Development Server (2 minutes)

### 3.1 Start Server
```bash
pnpm dev
```

You should see:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Environments: .env.local
```

### 3.2 Open in Browser
Visit: **http://localhost:3000**

You should see the Shop page with products!

## ✅ Step 4: Test the App (5 minutes)

### 4.1 Browse Products
- [ ] See 6 products displayed in 2 columns
- [ ] Click categories (Electronics, Fashion, Books)
- [ ] Search for "watch" - should filter products
- [ ] Click any product to view details

### 4.2 Test Shopping
- [ ] On product page, click **"+"** to increase quantity
- [ ] Click **"Add to Cart"**
- [ ] Bottom nav shows cart count "1"
- [ ] Click cart icon → see item in cart
- [ ] Click **"Checkout"** → creates an order

### 4.3 Test Wishlist
- [ ] Click heart icon on any product
- [ ] Heart turns red
- [ ] Click wishlist in bottom nav
- [ ] See item in wishlist
- [ ] Click **"Add to Cart"** to move to cart

### 4.4 Test Orders
- [ ] Click "Orders" in bottom nav (after checkout)
- [ ] See your order with total amount
- [ ] Status shows "Pending"

### 4.5 Test Price Comparison
- [ ] On product detail page, scroll down
- [ ] See "Market Prices" section loading
- [ ] After ~3 seconds, see Amazon/Flipkart/Blinkit prices
- [ ] If API key missing, you'll see error message

### 4.6 Mobile View
- [ ] Press F12 → Device Toggle
- [ ] Select iPhone from list
- [ ] App should be full width
- [ ] Bottom nav should be accessible
- [ ] Click Shop, Wishlist, Cart, Orders

## ✅ Step 5: Customize Your Store (10 minutes)

### 5.1 Add Products
**File**: `data/products.json`

Add new product to `products` array:
```json
{
  "id": "7",
  "name": "Your Product Name",
  "category": "electronics",
  "price": 99.99,
  "originalPrice": 149.99,
  "rating": 4.8,
  "reviews": 234,
  "stock": 50,
  "image": "https://images.unsplash.com/photo-...",
  "description": "Great product description here",
  "specs": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "instagramReels": []
}
```

Use images from:
- **Unsplash**: unsplash.com (free, no credit needed)
- **Pexels**: pexels.com (free)
- **Your server**: upload your own

### 5.2 Change Store Name
**File**: `app/layout.tsx`

Find and change:
```typescript
export const metadata: Metadata = {
  title: 'Your Store Name',
  description: 'Your store description',
};
```

### 5.3 Change Colors
**File**: `app/globals.css`

Find the `:root` section and change:
```css
--primary: 141 76% 36%;      /* Change to your brand color */
--background: 12 7% 8%;      /* Background color */
```

Color format: HSL (Hue Saturation Lightness)

### 5.4 Add Instagram Reels
For product showcase videos:

1. Get Instagram reel/post URL
2. Extract POST_ID: `instagram.com/p/[POST_ID]/`
3. Add to product:
```json
"instagramReels": [
  "https://www.instagram.com/p/POST_ID/embed",
  "https://www.instagram.com/p/ANOTHER_ID/embed"
]
```

## ✅ Step 6: Test Your Changes (3 minutes)

### 6.1 Verify Products Update
- [ ] Edit `data/products.json`
- [ ] Save file
- [ ] Browser page auto-refreshes
- [ ] New product appears

### 6.2 Verify Colors Change
- [ ] Edit `app/globals.css`
- [ ] Change primary color value
- [ ] Save file
- [ ] Colors update automatically (might take a moment)

### 6.3 Verify Title Changes
- [ ] Edit `app/layout.tsx`
- [ ] Change title value
- [ ] Save file
- [ ] Browser tab title updates

## ✅ Step 7: Build for Production (2 minutes)

### 7.1 Build App
```bash
pnpm build
```

Should complete with: "✓ Compiled successfully"

### 7.2 Test Production Build
```bash
pnpm start
```

Visit: http://localhost:3000

Should work identically to development.

## ✅ Step 8: Deploy (5-10 minutes)

### Option A: Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit: vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variable**
   - In Vercel project → Settings → Environment Variables
   - Name: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Value: Your API key
   - Click "Save"

4. **Redeploy**
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Wait for completion
   - Visit deployed URL

### Option B: Deploy to Other Platforms

Other options available (Netlify, Railway, Fly.io, etc.)

## ✅ Troubleshooting

### Problem: "Cannot find module '@/lib/store'"
**Solution**: 
- Check file is at: `lib/store.ts`
- Try restarting dev server
- Clear `.next` folder and rebuild

### Problem: Port 3000 already in use
**Solution**:
```bash
pnpm dev -p 3001
# Or kill process using port 3000
```

### Problem: JSON syntax error in products.json
**Solution**:
- Check for missing commas
- Verify quotes are matched
- Use JSON validator: jsonlint.com

### Problem: Images not showing
**Solution**:
- Verify URL starts with `https://`
- Check image URL is accessible
- Try a different image source

### Problem: API key not working
**Solution**:
- Generate new key from aistudio.google.com
- Restart dev server after updating `.env.local`
- Check key has no extra spaces

### Problem: Cart/Wishlist not saving
**Solution**:
- This is normal - data is in-memory
- Data resets on page refresh
- This is by design for demo
- Add localStorage/database for persistence

## ✅ Next Steps

### Immediate
- [ ] Add your own products
- [ ] Customize colors
- [ ] Change store name
- [ ] Test on mobile device

### Soon
- [ ] Deploy to Vercel
- [ ] Share with friends/family
- [ ] Gather feedback
- [ ] Adjust based on feedback

### Eventually
- [ ] Add more categories
- [ ] Expand product catalog
- [ ] Add user accounts
- [ ] Set up payments
- [ ] Connect to database

## 📚 Documentation

For more detailed information:

| Document | Purpose |
|----------|---------|
| `README.md` | Full feature overview |
| `SETUP_GUIDE.md` | Detailed setup guide |
| `QUICK_REFERENCE.md` | Quick lookup guide |
| `GEMINI_SETUP.md` | AI integration details |
| `MOBILE_DESIGN.md` | Design documentation |
| `PROJECT_SUMMARY.md` | Complete project overview |

## 🎯 Success Checklist

You're ready when you can:
- [ ] Run `pnpm dev` without errors
- [ ] See products on home page
- [ ] Add items to cart
- [ ] Checkout and see orders
- [ ] Search for products
- [ ] Filter by category
- [ ] View product details
- [ ] See price comparison (if API key set)
- [ ] Build successfully with `pnpm build`

## 🚀 You're All Set!

Your e-commerce platform is ready to go! 

**Start with:**
```bash
pnpm dev
```

Then visit: **http://localhost:3000**

---

**Questions?** Check the relevant documentation file or review the code comments in the source files.

**Ready to share?** Deploy to Vercel and send the link to your customers!

Happy selling! 🎉
