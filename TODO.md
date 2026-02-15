# TODO List - Product Page Enhancements

## Task: Add Instagram Reels, Review Section, and Recommended Products

### Steps:
1. [ ] Modify `app/product/[id]/page.tsx`:
   - [ ] Update Instagram Reels section to show dummy frames when no reels in data, show actual iframes when data has reels
   - [ ] Add Review section with tab switch (Reviews, Questions, Shipping)
   - [ ] Add Recommended Products section based on category

### Implementation Details:
- Instagram Reels: Check if `product.instagramReels` has items. If empty, show dummy video player placeholders. If has items, render iframes.
- Review Section: Use shadcn/ui tabs component with mock review data
- Recommended Products: Filter products by same category, exclude current product, show in horizontal scroll
