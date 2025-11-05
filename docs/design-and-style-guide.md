# Christmas Donation App - Design & Style Guide

## Design Philosophy

Create a **festive yet professional** Christmas experience that feels warm, inviting, and trustworthy. The design should evoke holiday spirit without being childish, maintaining credibility for a corporate charity initiative.

---

## Color Palette

### Primary Christmas Colors (10% of interface)

#### Christmas Red
```
Primary Red: #DC2626 (Tailwind red-600)
├─ red-700: #B91C1C (hover states)
├─ red-500: #EF4444 (lighter accents)
└─ red-800: #991B1B (pressed states)
```

**Usage:**
- Primary CTA buttons
- Modal accents
- Success state highlights
- Active navigation elements

#### Christmas Green
```
Primary Green: #059669 (Tailwind emerald-600)
├─ emerald-700: #047857 (hover states)
├─ emerald-500: #10B981 (lighter accents)
└─ emerald-800: #065F46 (pressed states)
```

**Usage:**
- Secondary CTAs
- Confirmation messages
- Progress indicators
- Complementary accents

### Neutral Colors (60% of interface)

#### Gray Scale (Base for backgrounds and text)
```
Backgrounds:
├─ gray-50:  #F9FAFB (page background)
├─ gray-100: #F3F4F6 (modal background)
├─ gray-200: #E5E7EB (card backgrounds)
└─ gray-300: #D1D5DB (subtle borders)

Text:
├─ gray-900: #111827 (headings, primary text)
├─ gray-700: #374151 (body text)
├─ gray-600: #4B5563 (secondary text)
└─ gray-500: #6B7280 (captions, labels)

Borders & Dividers:
├─ gray-300: #D1D5DB (standard borders)
└─ gray-200: #E5E7EB (subtle dividers)
```

### Accent & Semantic Colors (30% of interface)

#### Gold/Warm Accents
```
Gold: #F59E0B (Tailwind amber-500)
├─ amber-400: #FBBF24 (lighter highlights)
└─ amber-600: #D97706 (deeper tones)
```

**Usage:**
- Star decorations
- Premium highlights
- Warm accents on illustrations

#### White/Snow
```
Snow White: #FFFFFF
Snow-Light: #FAFAFA (off-white for layering)
```

**Usage:**
- Snowflakes
- Modal overlays
- Card backgrounds
- Text on dark backgrounds

#### Semantic Colors

**Success (Donations Confirmed):**
- `emerald-600`: #059669

**Warning (Validation Messages):**
- `amber-600`: #D97706

**Error (Form Errors):**
- `red-600`: #DC2626

**Info (Helper Text):**
- `blue-600`: #2563EB

---

## Typography

### Font Family
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Headings: 'Inter', sans-serif (with font-weight variations)
```

### Type Scale

```typescript
// Tailwind classes
H1: text-4xl font-bold     // 36px - Page titles
H2: text-3xl font-bold     // 30px - Modal titles
H3: text-2xl font-semibold // 24px - Section headings
H4: text-xl font-semibold  // 20px - Card titles
H5: text-lg font-medium    // 18px - Subsections

Body Large: text-base      // 16px - Primary body text
Body: text-sm              // 14px - Secondary text
Caption: text-xs           // 12px - Labels, captions
```

### Text Colors (by hierarchy)

```typescript
Headings:    text-gray-900
Body:        text-gray-700
Secondary:   text-gray-600
Captions:    text-gray-500
Disabled:    text-gray-400
```

---

## Layout & Spacing

### Landing Page Layout

#### Desktop (≥1024px)
```
┌─────────────────────────────────────────┐
│                                         │
│              [Snow Effect]              │
│                                         │
│         ┌───────────────────┐          │
│         │   Hero Content    │          │
│         │   • Logo/Title    │          │
│         │   • Tagline       │          │  100vh
│         │   • CTA Button    │          │  (no scroll)
│         └───────────────────┘          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

#### Mobile (≤768px)
```
┌─────────────┐
│   [Snow]    │
│             │
│  ┌───────┐  │
│  │ Hero  │  │  100vh
│  │Content│  │  (no scroll)
│  │       │  │
│  │ CTA   │  │
│  └───────┘  │
└─────────────┘
```

### Spacing System (Tailwind Scale)
```typescript
xs:  4px   (gap-1, p-1)
sm:  8px   (gap-2, p-2)
md:  16px  (gap-4, p-4)
lg:  24px  (gap-6, p-6)
xl:  32px  (gap-8, p-8)
2xl: 48px  (gap-12, p-12)
```

**Usage Rules:**
- **Internal Card Padding**: `p-6` (24px)
- **Modal Padding**: `p-8` (32px)
- **Section Gaps**: `gap-6` (24px)
- **Form Field Gaps**: `gap-4` (16px)
- **Button Padding**: `px-6 py-3` (24px × 12px)

---

## Components

### Modal Design

#### Structure
```
┌────────────────────────────────────────┐
│  ┌──────────────────────────────────┐ │
│  │ Modal Backdrop (semi-transparent)│ │
│  │   ┌──────────────────────────┐   │ │
│  │   │  [X] Close Button        │   │ │
│  │   │  ────────────────────    │   │ │
│  │   │                          │   │ │
│  │   │  Modal Content           │   │ │
│  │   │                          │   │ │
│  │   │  [Buttons/Forms]         │   │ │
│  │   │                          │   │ │
│  │   └──────────────────────────┘   │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

#### Specifications
```typescript
Backdrop:
  - bg-gray-900/50 (50% opacity black)
  - backdrop-blur-sm (subtle blur)
  - z-50

Modal Container:
  - bg-white
  - rounded-2xl (16px border radius)
  - max-w-2xl (desktop)
  - max-w-[90vw] (mobile)
  - p-8 (32px padding)
  - Shadow: see shadow guide below
```

#### Color Treatment
```
Base Background: gray-50
Modal Background: white
Section Backgrounds: gray-50 (to create depth)
Interactive Elements: gray-100 (hover: gray-200)
```

### Shadow System (from shadow.md)

#### Small Shadow (Subtle Elements)
```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.1),  /* Top highlight */
  0 1px 2px rgba(0,0,0,0.1);             /* Bottom shadow */
```

**Usage:** Tabs, nav items, small cards

#### Medium Shadow (Standard Depth)
```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.15),
  0 3px 6px rgba(0,0,0,0.15);
```

**Usage:** Modals, cards, dropdowns

#### Large Shadow (Prominent Elements)
```css
box-shadow:
  inset 0 2px 0 rgba(255,255,255,0.2),
  0 6px 12px rgba(0,0,0,0.2);
```

**Usage:** Hover states, focused modals, important actions

### Buttons

#### Primary Button (Red CTA)
```typescript
Base State:
  - bg-red-600
  - text-white
  - px-6 py-3
  - rounded-lg
  - font-semibold
  - shadow-md

Hover:
  - bg-red-700
  - shadow-lg (increase shadow)

Active/Pressed:
  - bg-red-800
  - shadow-sm (reduce shadow)

Disabled:
  - bg-gray-300
  - text-gray-500
  - cursor-not-allowed
```

#### Secondary Button (Green)
```typescript
Base State:
  - bg-emerald-600
  - text-white
  - px-6 py-3
  - rounded-lg
  - font-semibold

Hover:
  - bg-emerald-700

Active:
  - bg-emerald-800
```

#### Outline Button
```typescript
Base State:
  - border border-gray-300
  - text-gray-700
  - bg-white
  - px-6 py-3
  - rounded-lg

Hover:
  - bg-gray-50
  - border-gray-400

Active:
  - bg-gray-100
```

### Form Elements

#### Input Fields
```typescript
Base State:
  - border border-gray-300
  - rounded-lg
  - px-4 py-2
  - text-gray-900
  - placeholder:text-gray-400

Focus:
  - border-red-500 (primary color)
  - ring-2 ring-red-200
  - outline-none

Error:
  - border-red-500
  - ring-2 ring-red-200
  - text-red-900
```

#### Dropdowns/Select
```typescript
Base State:
  - Same as input fields
  - Chevron icon on right
  - bg-white

With Gradient Enhancement (from shadow.md):
  - background: linear-gradient(to bottom, #ffffff, #f9fafb)
  - box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)
```

#### Labels
```typescript
Standard Label:
  - text-sm font-medium
  - text-gray-700
  - mb-2

Required Indicator:
  - text-red-600
  - ml-1
  - "*"
```

### Cards

#### Base Card
```typescript
Container:
  - bg-white
  - border border-gray-200
  - rounded-xl
  - p-6
  - shadow-sm

With Depth (Multi-layer approach):
  - Page background: gray-50
  - Card background: white
  - Inner sections: gray-50
```

---

## Animation & Motion

### Snow Effect
```typescript
Component: <SnowEffect />
- Fixed position covering entire viewport
- 50 snowflakes with randomized:
  - Horizontal position (0-100%)
  - Fall duration (10-20s)
  - Size (2-6px)
  - Delay (0-10s)
- Continuous loop
- Pointer-events: none (doesn't block clicks)
- Z-index: 10 (above background, below modal)
```

### Modal Animations
```typescript
Entry:
  - Fade in: opacity 0 → 1
  - Scale up: scale 0.95 → 1
  - Duration: 200ms
  - Easing: ease-out

Exit:
  - Fade out: opacity 1 → 0
  - Scale down: scale 1 → 0.95
  - Duration: 150ms
  - Easing: ease-in
```

### Button Interactions
```typescript
Hover:
  - Transition: all 150ms ease-in-out
  - Transform: translateY(-1px)
  - Shadow increase

Active:
  - Transform: translateY(0)
  - Shadow decrease
```

### Form Focus
```typescript
Focus State:
  - Transition: border-color 150ms, box-shadow 150ms
  - Ring appears with smooth fade
```

---

## Responsive Behavior (from responsive.md)

### Breakpoint Strategy

```typescript
Mobile:     < 640px   (sm)
Tablet:     640-1024px (sm-lg)
Desktop:    ≥ 1024px  (lg+)
```

### Modal Responsive Behavior

**Desktop (≥1024px):**
- Fixed width: `max-w-2xl` (672px)
- Centered on screen
- Padding: `p-8` (32px)

**Tablet (640-1024px):**
- Width: `max-w-xl` (576px)
- Padding: `p-6` (24px)

**Mobile (<640px):**
- Width: `max-w-[90vw]` (90% of viewport)
- Padding: `p-4` (16px)
- Font sizes reduce by 1 step

### Form Layout Responsive

**Desktop:**
```
┌────────────────────────┐
│ Label                  │
│ [Input Field ────────] │
│                        │
│ Label        Label     │
│ [Input ──]   [Input ─] │
└────────────────────────┘
```

**Mobile:**
```
┌──────────┐
│ Label    │
│ [Input─] │
│          │
│ Label    │
│ [Input─] │
│          │
│ Label    │
│ [Input─] │
└──────────┘
```

**Implementation:**
- Use `grid-cols-1 md:grid-cols-2` for side-by-side fields
- All fields stack vertically on mobile

---

## Christmas-Specific Design Elements

### Visual Motifs

#### Snowflakes
- White circles with opacity: 0.8
- Sizes: 2-6px diameter
- Falling animation (see SnowEffect component)

#### Color Accents
- Red & green used sparingly for emphasis
- Gold/amber for premium touches
- White for purity/snow theme

### Iconography
```typescript
Recommended Icons (from lucide-react):
- Gift: Gift box icon
- Heart: HeartHandshake icon
- Users: Users icon
- CheckCircle: Success states
- XCircle: Error states
- ChevronRight: Navigation
- X: Close modal
```

### Festive But Professional Guidelines

**Do:**
- Use red and green intentionally (CTAs, accents)
- Incorporate snow animation subtly
- Use warm, inviting copy
- Maintain clean, organized layouts
- Professional typography

**Don't:**
- Overload with decorations
- Use cartoon-style graphics
- Add blinking/flashing animations
- Use Comic Sans or similar fonts
- Make it feel like a children's app

---

## Accessibility Guidelines

### Color Contrast

All text must meet WCAG AA standards:
```
Normal Text:    4.5:1 contrast ratio
Large Text:     3:1 contrast ratio
UI Components:  3:1 contrast ratio
```

**Pre-approved Combinations:**
- White text on `red-600` ✅ (4.7:1)
- White text on `emerald-600` ✅ (4.5:1)
- `gray-900` text on white ✅ (20:1)
- `gray-700` text on white ✅ (10.5:1)

### Focus States

All interactive elements must have visible focus indicators:
```typescript
Focus Ring:
  - ring-2
  - ring-red-500 (primary elements)
  - ring-offset-2
  - outline-none
```

### Keyboard Navigation

- Modal opens: Focus moves to first interactive element
- Tab order follows visual flow
- Escape key closes modal
- Enter submits forms

### Screen Readers

- All images have `alt` text
- Forms have associated `<label>` elements
- ARIA labels on icon-only buttons
- Live regions for loading states

---

## Loading & Empty States

### Loading Spinner
```typescript
Component:
  - Circular spinner
  - Color: red-600
  - Size: medium (40px)
  - Centered in container
  - Text below: "Loading..." (text-gray-600)
```

### Empty State (No Children Found)
```typescript
Display:
  - Icon: SearchX (lucide-react)
  - Heading: "No children match your search"
  - Body: "Try adjusting your search criteria"
  - Action: "Search Again" button
```

### Success State
```typescript
Display:
  - Icon: CheckCircle (green)
  - Heading: "Thank You!"
  - Body: Custom message based on donation type
  - Action: "Close" button
```

---

## Error Handling

### Form Validation Errors
```typescript
Display:
  - Inline below field
  - text-sm text-red-600
  - Icon: AlertCircle (lucide-react)
  - Border on field changes to red-500
```

### System Errors
```typescript
Display:
  - Toast notification (top-center)
  - bg-red-50 border-red-200
  - Icon: XCircle
  - Auto-dismiss after 5s
```

---

## Implementation Checklist

### Landing Page
- [ ] Full-screen layout (no scroll)
- [ ] Snow animation overlay
- [ ] Centered hero content
- [ ] Red primary CTA button
- [ ] Responsive on all devices

### Modal
- [ ] Backdrop with blur
- [ ] Medium shadow on modal
- [ ] Close button (top-right)
- [ ] Smooth enter/exit animations
- [ ] Trap focus inside modal
- [ ] Close on backdrop click
- [ ] Close on Escape key

### Forms
- [ ] All fields have labels
- [ ] Validation on submit
- [ ] Error messages inline
- [ ] Loading states during submission
- [ ] Success confirmation
- [ ] Focus management

### Responsive
- [ ] Desktop layout tested
- [ ] Tablet layout tested
- [ ] Mobile layout tested
- [ ] Touch targets ≥44px
- [ ] Text remains readable at all sizes

### Accessibility
- [ ] Color contrast verified
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] ARIA labels added

---

## Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        'christmas-red': {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          dark: '#991B1B',
        },
        'christmas-green': {
          DEFAULT: '#059669',
          light: '#10B981',
          dark: '#065F46',
        },
        'christmas-gold': {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
      },
      boxShadow: {
        'modal': '0 3px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
        'button': '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
}
```

---

## Component Library Priority

**Phase 1 (MVP):**
1. Modal (dialog)
2. Button (variants)
3. Input (text)
4. Select (dropdown)
5. Form
6. Label

**Phase 2:**
7. Card
8. Toast/Alert
9. Badge
10. Avatar

---

## Version History

- **v1.0** (2025-11-05): Initial design and style guide created
