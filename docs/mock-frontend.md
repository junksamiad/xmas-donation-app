# Mock Frontend Documentation 🎄

## Overview
This document outlines the location and structure of the Christmas donation app mock UI that was created for testing and design validation before implementing the full functionality.

## Mock UI Code Location 📁

### **Main Page**
- `/src/app/tree/page.tsx` - **Main Christmas tree page** with full background image

### **Reusable Components**
- `/src/components/SnowEffect.tsx` - **Snow animation** component with falling snowflakes
- `/src/components/DepartmentLeaderboard.tsx` - **Floating department widget** showing competition stats
- `/src/components/StatsBar.tsx` - **Green header with metrics** (children, donations, completion)
- `/src/components/ui/moving-border.tsx` - **Moving border button component** with golden animated outline

### **Utilities**
- `/src/lib/utils.ts` - **Utility functions** for className merging (clsx + tailwind-merge)
- `/src/app/globals.css` - **Christmas color theme** and custom animations/keyframes

### **Static Assets**
- `/public/xmas_tree_image.jpeg` - **Christmas tree background image**

### **Dependencies Added**
- `react-hot-toast` for notifications (added to package.json)

## Route Structure

- **Mock UI**: `http://localhost:3003/tree` - **Main mock page**
- **Original mock**: `http://localhost:3003/mock` - Older version with different layout
- **Default page**: `http://localhost:3003/` - Next.js starter page

## Key Features Implemented

### 🎄 **Christmas Tree Page** (`/tree`)
- **Full-page tree background** - Christmas tree image fills entire viewport minus header
- **Enhanced stats header** - Green bar with prominent, readable metrics
- **Centered donate button** - Premium moving border animation, perfectly positioned
- **Floating leaderboard** - Department competition widget, vertically centered on right
- **Subtle snow animation** - Festive falling snowflakes across the page
- **Christmas color scheme** - Gold, green, red throughout

### 🎁 **Interactive Elements**
- **Moving border button** with clean golden outline animation
- **Toast notifications** with Christmas theme (green background, gold accents)
- **Hover effects** and responsive interactions
- **Department progress bars** with animated fills

### 🎨 **Design System**
- **Christmas Colors**:
  - `christmas-red: #C41E3A`
  - `christmas-green: #165B33`
  - `christmas-gold: #FFD700`
  - `snow-white: #FFFAFA`
- **Responsive design** that works on all devices
- **Professional, polished feel** with premium animations

## Component Details

### StatsBar Component
- **Location**: `/src/components/StatsBar.tsx`
- **Features**:
  - Green header with Christmas theme
  - Three metrics: Children Awaiting, Donations Made, Complete %
  - Enhanced typography (large, semibold text)
  - Responsive design

### DepartmentLeaderboard Component
- **Location**: `/src/components/DepartmentLeaderboard.tsx`
- **Features**:
  - Floating widget on right side, vertically centered
  - Shows Marketing, Sales, Accounts departments
  - Progress bars with percentages
  - Glassmorphism design with backdrop blur
  - Christmas tree emoji and festive styling

### MovingBorder Button Component
- **Location**: `/src/components/ui/moving-border.tsx`
- **Features**:
  - Animated golden border that rotates around perimeter
  - Centered on page with "🎁 Make A Donation Now ❤️" text
  - Christmas green gradient background
  - Hover effects and emoji animations
  - Responsive sizing

### SnowEffect Component
- **Location**: `/src/components/SnowEffect.tsx`
- **Features**:
  - 50 falling snowflakes with random positioning
  - Framer Motion animations with infinite loops
  - Subtle, non-overwhelming effect
  - Performance optimized

## File Structure
```
/src/app/tree/page.tsx          # Main Christmas tree page
/src/components/
├── SnowEffect.tsx              # Snow animation
├── DepartmentLeaderboard.tsx   # Floating department widget
├── StatsBar.tsx                # Green header with metrics
└── ui/
    └── moving-border.tsx       # Moving border button
/src/lib/utils.ts               # Utility functions
/src/app/globals.css            # Christmas theme colors
/public/xmas_tree_image.jpeg    # Background image
```

## Next Steps

This mock UI provides a solid foundation for implementing the real functionality. When ready to move forward:

1. **Wire up real data** and API endpoints
2. **Build the donation wizard** flow (Story 1.3)
3. **Connect the database** and migrate Airtable data
4. **Add more interactive features**

All components are reusable and ready to be integrated into the production app. The `/src/app/tree/page.tsx` file demonstrates how all components work together to create the complete Christmas donation experience.