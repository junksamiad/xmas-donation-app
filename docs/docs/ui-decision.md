# UI Decision - Sprint 1

## Selected UI: Village Theme (/village)

**Date**: 2025-09-20
**Decision**: We are using the **Village theme** UI for the Christmas Donation App.

## Route
- **Production URL**: `/village`
- **File**: `/src/app/village/page.tsx`

## Key Components Used
- `VillageHero.tsx` - Main hero section with interactive icons
- `StatsDashboard.tsx` - Metrics display with animated counters
- `EnhancedDepartmentLeaderboard.tsx` - Department competition display
- `SnowEffect.tsx` - Falling snow animation

## Customizations Made Today
1. **Title**: Changed to "ANS Christmas Donation Campaign"
2. **Subtitle**: "Bringing Christmas Magic to More Than 100 Children" with 👦👧 emojis
3. **Icons Updated**:
   - Children in Need: 🧸 (teddy bear)
   - Gifts: 🎁
   - ANS Collaboration: 👥 (people)
   - Donations: 💝
4. **Currency**: Changed from $ to £
5. **Hero Section**: Extended to full viewport height (100vh)
6. **Fixed Hydration Issues**: Removed Math.random() for deterministic rendering
7. **Spacing**: Increased gap between icons and CTA button

## Other Available UIs (Not Using)
- `/tree` - Original tree background design
- `/mock` - Older mock version
- `/village-v2` - Alternative village version

## Next Steps
When returning to the project:
1. Add donation wizard flow when "Light Up a Child's Christmas" button is clicked
2. Connect UI to dynamic data structure
3. Hook up to real database (Neon PostgreSQL)