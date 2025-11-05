# Christmas Donation App - Flow Overview v2

**Updated:** 2025-11-05
**Architecture:** Next.js 15 + Prisma + PostgreSQL (Neon)

---

## High-Level Summary

The Christmas Donation App allows company staff to donate gifts (physical items or cash) to children in need. Users interact with a festive Christmas tree landing page with clickable baubles, then navigate through a modal-based flow to select recipients and complete their donation. All donations are tracked by department and linked to individual children records.

---

## Architecture Overview

### Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TailwindCSS 4, Framer Motion
- **Backend:** Next.js Server Actions (no API routes for own frontend)
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **State:** React hooks + SWR for data fetching

### Data Flow Pattern
```
Client Component → Server Action → Business Service → Database Adapter → Prisma
```

### Server Actions (src/app/actions.ts)
All actions return `{ success: true/false, data/error }` objects:
- `getRandomChild()` - Returns random unassigned child
- `searchChild({ gender, age })` - Returns random child matching criteria
- `createDonation(data)` - Creates donation record + marks child assigned
- `getActiveDepartments()` - Returns list of active departments

---

## Database Schema

### Department Table
```typescript
{
  id: string          // cuid
  name: string        // unique (e.g., "Marketing", "Sales", "IT")
  active: boolean     // false to hide from dropdown
  createdAt: DateTime
}
```

### Child Table
```typescript
{
  id: string          // cuid
  recipient: string   // child's name
  age: number         // 1-16
  gender: string      // 'male' | 'female'
  giftIdeas: string   // comma-separated list (e.g., "LEGO, books, games")
  category: string?   // optional (e.g., "special_needs")
  priority: boolean   // flag for urgent cases
  assigned: boolean   // true once donation received
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Donation Table
```typescript
{
  id: string           // cuid
  childId: string      // FK to Child
  donorName: string    // staff member's full name
  departmentId: string // FK to Department
  donationType: string // 'gift' | 'cash'
  amount: Decimal?     // required if donationType === 'cash'
  createdAt: DateTime
}
```

### GiftIdea Table (Reference Data)
```typescript
{
  id: string           // cuid
  age: number          // 1-16
  gender: string       // 'male' | 'female'
  giftIdeas: string[]  // array of suggestions
  category: string?    // optional matching category
  createdAt: DateTime
}
```
**Note:** 32 records total (16 ages × 2 genders). Used to generate child records, not directly in flow.

---

## User Journey Flow

### Entry Point: Landing Page (`/`)

**View:** Full-screen Christmas tree with animated Santa sleighs and falling snow
- **Baubles:** Clickable gift areas on the tree (to be implemented)
- **CTA:** Hero section with "Make a Difference" button (to be implemented)

**Action:** User clicks bauble/CTA → Opens `<DonationModal />`

---

## Modal Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      LANDING PAGE                            │
│                   (Christmas Tree View)                      │
│                                                              │
│    Click bauble or CTA → Opens Modal                        │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         MODAL SCREEN 1: Selection                            │
│         (currentScreen = 'selection')                        │
│                                                              │
│  Choose how to select a child:                              │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │  Any Child   │   OR   │ Choose Child │                  │
│  │  (Random)    │        │  (Search)    │                  │
│  └──────┬───────┘        └──────┬───────┘                  │
│         │                       │                            │
└─────────┼───────────────────────┼────────────────────────────┘
          │                       │
    ┌─────▼────┐           ┌──────▼──────┐
    │  PATH A  │           │   PATH B    │
    │ (Random) │           │  (Search)   │
    └─────┬────┘           └──────┬──────┘
          │                       │
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌─────────────────────────┐
│ Server Action:   │    │  MODAL SCREEN 2: Search │
│ getRandomChild() │    │  (currentScreen = 'search')
│                  │    │                         │
│ Returns:         │    │  Form fields:           │
│ { success, data }│    │  - Gender dropdown      │
│                  │    │    ['any','male','female']
│ Loader shown     │    │  - Age dropdown         │
│ during fetch     │    │    ['any', 1-16]        │
│                  │    │  - Search button        │
│                  │    │  - Back button          │
└────────┬─────────┘    └─────────┬───────────────┘
         │                        │
         │                        │ Submit Search
         │                        │
         │                        ▼
         │              ┌─────────────────────┐
         │              │  Server Action:     │
         │              │  searchChild({      │
         │              │    gender: string,  │
         │              │    age: number      │
         │              │  })                 │
         │              │                     │
         │              │  Returns:           │
         │              │  { success, data }  │
         │              └─────────┬───────────┘
         │                        │
         └────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         MODAL SCREEN 3: Child Details                        │
│         (currentScreen = 'child-details')                    │
│                                                              │
│  Display Information:                                        │
│  - Avatar image (boy.png / girl.png)                        │
│  - Recipient name (e.g., "Oliver")                          │
│  - Age (e.g., "10 years old")                               │
│  - Gender (implicit from avatar)                            │
│  - Gift ideas in styled box:                                │
│    "Has written to Santa and asked for..."                  │
│    [giftIdeas text]                                         │
│                                                              │
│  Choose donation type:                                       │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │ Donate Gift  │   OR   │ Donate Cash  │                  │
│  └──────┬───────┘        └──────┬───────┘                  │
│         │                       │                            │
│  - Back button (to search/selection)                        │
└─────────┼───────────────────────┼────────────────────────────┘
          │                       │
    ┌─────▼────┐           ┌──────▼──────┐
    │  PATH C  │           │   PATH D    │
    │  (Gift)  │           │   (Cash)    │
    └─────┬────┘           └──────┬──────┘
          │                       │
          ▼                       ▼
┌──────────────────┐    ┌─────────────────────────┐
│ MODAL SCREEN 4:  │    │  MODAL SCREEN 4:        │
│ Donation Form    │    │  Donation Form          │
│ (Gift)           │    │  (Cash)                 │
│                  │    │                         │
│ currentScreen:   │    │  currentScreen:         │
│ 'donation-form'  │    │  'donation-form'        │
│                  │    │                         │
│ donationType:    │    │  donationType:          │
│ 'gift'           │    │  'cash'                 │
│                  │    │                         │
│ Form fields:     │    │  Form fields:           │
│ - Full Name      │    │  - Full Name            │
│   (text input)   │    │    (text input)         │
│ - Department     │    │  - Department           │
│   (dropdown)     │    │    (dropdown)           │
│   Loaded via:    │    │    Loaded via:          │
│   getActive-     │    │    getActive-           │
│   Departments()  │    │    Departments()        │
│                  │    │  - Donation Amount      │
│                  │    │    (number input, £)    │
│                  │    │    Required, min 0.01   │
│ - Submit button  │    │  - Submit button        │
│ - Back button    │    │  - Back button          │
└────────┬─────────┘    └─────────┬───────────────┘
         │                        │
         │ Submit                 │ Submit
         │                        │
         ▼                        ▼
┌──────────────────────────────────────────────────┐
│      Server Action: createDonation({             │
│        childId: string                           │
│        donorName: string                         │
│        departmentId: string                      │
│        donationType: 'gift' | 'cash'            │
│        amount?: number  (required if cash)       │
│      })                                          │
│                                                  │
│      Business Logic (DonationService):           │
│      1. Validate data (cash must have amount)    │
│      2. Create Donation record                   │
│      3. Mark Child.assigned = true               │
│      4. Both in transaction for atomicity        │
│                                                  │
│      Returns: { success: true, data: donation }  │
│            OR { success: false, error: string }  │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         MODAL SCREEN 5: Thank You                            │
│         (currentScreen = 'thank-you')                        │
│                                                              │
│  Success message:                                            │
│  "Thank You [donorName]!"                                   │
│                                                              │
│  If gift:                                                    │
│  "Your gift donation for [recipient] has been               │
│   registered successfully."                                  │
│                                                              │
│  If cash:                                                    │
│  "Your cash donation of £[amount] for [recipient]           │
│   has been registered successfully."                         │
│                                                              │
│  - Close button (resets modal & returns to landing)         │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Screen Specifications

### Screen 1: Selection
**File:** `src/components/DonationModal.tsx` (lines 94-208)
**Status:** ✅ Complete

**State:**
- `currentScreen: 'selection'`

**UI Elements:**
- Header: "Choose a Gift Recipient"
- Subheading: "Select how you'd like to choose a child..."
- Button 1: "Any Child" (red gradient, boy-girl icon)
- Button 2: "Choose a Child" (green gradient, girl icon)

**Actions:**
- "Any Child" → Call `getRandomChild()` → Navigate to Screen 3
- "Choose a Child" → Navigate to Screen 2

**Notes:**
- Animated gradient text on header
- Glow effects on hover for buttons
- Icons from `/public/boy-girl-together.png` and `/public/girl.png`

---

### Screen 2: Search Form
**File:** `src/components/DonationModal.tsx` (lines 210-306)
**Status:** ✅ Complete (needs wiring)

**State:**
- `currentScreen: 'search'`
- `selectedGender: string` - User's gender selection
- `selectedAge: string` - User's age selection

**UI Elements:**
- Header: "Choose a Child"
- Gender dropdown (CustomDropdown component):
  - Options: "Any", "Male", "Female"
  - Values: `'any'`, `'male'`, `'female'`
- Age dropdown (CustomDropdown component):
  - Options: "Any age", "1 years old", "2 years old", ..., "16 years old"
  - Values: `'any'`, `'1'`, `'2'`, ..., `'16'`
- Search button (green gradient)
- Back button (→ Screen 1)

**Actions:**
- Submit search → Call `searchChild()` or `getRandomChild()` → Navigate to Screen 3
- Back → Navigate to Screen 1

**Wiring Needed:**
```typescript
// Handle "any" selections:
if (selectedGender === 'any' || selectedAge === 'any') {
  // Call getRandomChild() for fully random selection
  const result = await getRandomChild();
} else {
  // Call searchChild with specific criteria
  const result = await searchChild({
    gender: selectedGender,
    age: parseInt(selectedAge)
  });
}

// Handle result
if (result.success) {
  setSelectedChild(result.data);
  setCurrentScreen('child-details');
} else {
  // Show error toast
  toast.error(result.error);
}
```

**⚠️ Database Constraint:**
- Age range in database: 1-16 (not 0-16)
- Modal currently correct: Shows ages 1-16

---

### Screen 3: Child Details
**File:** `src/components/DonationModal.tsx` (lines 308-417)
**Status:** ✅ Complete

**State:**
- `currentScreen: 'child-details'`
- `selectedChild: ChildData` - Child record to display

**UI Elements:**
- Avatar image (boy.png or girl.png based on gender)
- Child name as gradient header
- Age display: "X year(s) old"
- Gift ideas section:
  - Box with yellow header: "Has written to Santa and asked for..."
  - Gift ideas text
- Button 1: "Donate Gift" (red gradient)
- Button 2: "Donate Cash" (green gradient)
- Back button (→ Screen 2 or Screen 1)

**Actions:**
- "Donate Gift" → Set `donationType: 'gift'` → Navigate to Screen 4
- "Donate Cash" → Set `donationType: 'cash'` → Navigate to Screen 4
- Back → Navigate to previous screen (search or selection)

**Notes:**
- Child data loaded from previous screen (random or search result)
- Gender determines avatar image
- Gift ideas displayed as plain text (comma-separated)

---

### Screen 4: Donation Form
**File:** `src/components/DonationModal.tsx`
**Status:** ❌ Not yet implemented

**State:**
- `currentScreen: 'donation-form'`
- `donationType: 'gift' | 'cash'`
- `donorName: string` - Form field
- `department: string` - Form field (department ID)
- `donationAmount: string` - Form field (cash only)

**UI Elements:**

#### Common fields (both gift and cash):
- Header: "Complete Your Donation" (or similar)
- Full Name input:
  - Label: "Your Full Name"
  - Type: text
  - Required
  - Placeholder: "e.g., John Smith"
- Department dropdown:
  - Label: "Your Department"
  - Options: Loaded via `getActiveDepartments()` Server Action
  - Required
  - Displays `department.name`, submits `department.id`

#### Cash-only field:
- Donation Amount input:
  - Label: "Donation Amount (£)"
  - Type: number
  - Step: 0.01
  - Min: 0.01
  - Required if donationType === 'cash'
  - Placeholder: "e.g., 25.00"

#### Buttons:
- Submit button: "Complete Donation" (green gradient)
- Back button: "← Back" (→ Screen 3)

**Actions:**

Submit button onClick:
```typescript
// Validate
if (!donorName.trim()) {
  toast.error('Please enter your full name');
  return;
}

if (!department) {
  toast.error('Please select your department');
  return;
}

if (donationType === 'cash' && (!donationAmount || parseFloat(donationAmount) <= 0)) {
  toast.error('Please enter a valid donation amount');
  return;
}

// Call Server Action
const result = await createDonation({
  childId: selectedChild.id,
  donorName: donorName.trim(),
  departmentId: department,
  donationType: donationType,
  amount: donationType === 'cash' ? parseFloat(donationAmount) : undefined
});

if (result.success) {
  setCurrentScreen('thank-you');
} else {
  toast.error(result.error);
}
```

**Data Loading:**
```typescript
// Load departments on mount or when screen opens
useEffect(() => {
  if (currentScreen === 'donation-form') {
    loadDepartments();
  }
}, [currentScreen]);

async function loadDepartments() {
  const result = await getActiveDepartments();
  if (result.success) {
    setDepartments(result.data);
  }
}
```

**Notes:**
- Use `CustomDropdown` component for department (consistent styling)
- Consider adding loading state while submitting
- Form should be disabled during submission
- Amount field only shown/validated when `donationType === 'cash'`

---

### Screen 5: Thank You
**File:** `src/components/DonationModal.tsx`
**Status:** ❌ Not yet implemented

**State:**
- `currentScreen: 'thank-you'`
- Access to: `donorName`, `donationType`, `donationAmount`, `selectedChild`

**UI Elements:**
- Success icon/animation (optional - could use Sparkles icon or checkmark)
- Header: "Thank You [donorName]!"
- Message body (conditional):
  - If gift: "Your gift donation for [recipient] has been registered successfully."
  - If cash: "Your cash donation of £[amount] for [recipient] has been registered successfully."
- Optional: Display child's name and avatar again
- Close button (large, centered): "Close" or "Done"

**Actions:**
- Close button → Call `handleClose()` to reset modal and return to landing

**Implementation Example:**
```typescript
{currentScreen === 'thank-you' && (
  <div className="text-center space-y-6">
    {/* Success Icon */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="flex justify-center"
    >
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-green-400" />
      </div>
    </motion.div>

    {/* Thank You Header */}
    <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
      Thank You {donorName}!
    </h2>

    {/* Success Message */}
    <p className="text-lg text-gray-300">
      {donationType === 'gift' ? (
        <>Your gift donation for <span className="text-yellow-300 font-semibold">{selectedChild?.recipient}</span> has been registered successfully.</>
      ) : (
        <>Your cash donation of <span className="text-green-400 font-semibold">£{parseFloat(donationAmount).toFixed(2)}</span> for <span className="text-yellow-300 font-semibold">{selectedChild?.recipient}</span> has been registered successfully.</>
      )}
    </p>

    {/* Close Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClose}
      className="w-full py-4 rounded-xl text-white font-bold"
      style={{
        background: 'linear-gradient(to bottom, #10B981, #059669)',
        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
      }}
    >
      Done
    </motion.button>
  </div>
)}
```

---

## Exit Points & Navigation

### Modal Close (X button)
- Available on all screens via top-right X button
- Calls `handleClose()` which:
  1. Resets all state variables
  2. Sets `currentScreen: 'selection'`
  3. Calls `onClose()` prop to hide modal

### Back Button Behavior
- **Screen 2 (Search):** ← Back to Screen 1 (Selection)
- **Screen 3 (Child Details):** ← Back to Screen 2 (Search) OR Screen 1 (Selection) depending on path taken
- **Screen 4 (Donation Form):** ← Back to Screen 3 (Child Details)
- **Screen 5 (Thank You):** No back button - only Close to exit

**Improvement Needed:**
Currently, back button from Child Details always goes to 'search' screen (line 411). Should track which path was taken:

```typescript
// Add state
const [previousScreen, setPreviousScreen] = useState<ModalScreen>('selection');

// Update navigation
// In "Any Child" button:
onClick={() => {
  setPreviousScreen('selection');
  // ... fetch child
}}

// In "Choose Child" button:
onClick={() => {
  setPreviousScreen('selection');
  setCurrentScreen('search');
}}

// In Search submit:
onClick={() => {
  setPreviousScreen('search');
  // ... fetch child
}}

// In Child Details back button:
onClick={() => setCurrentScreen(previousScreen)}
```

---

## Data Flow & State Management

### Server Actions Return Format
All Server Actions return a consistent format:
```typescript
type ServerActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
```

### Error Handling Pattern
```typescript
const result = await serverAction();

if (result.success) {
  // Happy path - use result.data
  setData(result.data);
  setCurrentScreen('next-screen');
} else {
  // Error path - show user-friendly message
  toast.error(result.error);
  // Keep user on current screen
}
```

### Loading States
Consider adding loading indicators during:
- `getRandomChild()` call (Screen 1 → Screen 3)
- `searchChild()` call (Screen 2 → Screen 3)
- `getActiveDepartments()` call (Screen 4 load)
- `createDonation()` call (Screen 4 → Screen 5)

Example:
```typescript
const [isLoading, setIsLoading] = useState(false);

// In async handler:
setIsLoading(true);
const result = await serverAction();
setIsLoading(false);

// In UI:
<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

---

## Database Constraints & Validation

### Child Selection Rules
- ✅ Only return children where `assigned: false`
- ✅ Implemented in `ChildService.getRandomChild()` and `ChildService.searchChild()`

### Age Range
- ✅ Database contains ages 1-16
- ✅ Modal dropdown shows ages 1-16
- ✅ 10 children per age group (5 boys + 5 girls)

### Gender Values
- ✅ Database uses lowercase: `'male'` | `'female'`
- ✅ Modal uses lowercase values
- ⚠️ Modal includes `'any'` option - must be handled in code

### Department Selection
- ✅ 15 departments seeded
- ✅ `active: boolean` field to hide/show in dropdown
- ✅ `getActiveDepartments()` filters by `active: true`

### Donation Validation
- ✅ Cash donations require `amount > 0`
- ✅ Enforced in `DonationService.create()`
- ✅ Child marked `assigned: true` after donation
- ✅ Both operations in database transaction

---

## Technical Implementation Notes

### Service Layer Pattern
```typescript
// Service Layer (Business Logic)
src/lib/services/business/
  ├── child.service.ts
  ├── donation.service.ts
  ├── department.service.ts
  └── giftIdea.service.ts

// Database Adapter
src/lib/db.ts
  └── getDatabaseInstance() → PrismaClient

// Server Actions (App Layer)
src/app/actions.ts
  └── Wraps service methods with error handling
```

### Type Safety
- DTOs defined in `src/lib/types/`
- Shared across all layers
- Avoids circular dependencies
- Decimal conversion handled for Client Components

### State Reset Pattern
The `handleClose()` function resets ALL state:
```typescript
const handleClose = () => {
  setCurrentScreen('selection');
  setSelectedGender('');
  setSelectedAge('');
  setSelectedChild(null);
  setDonationType(null);
  setDonorName('');
  setDepartment('');
  setDonationAmount('');
  onClose();
};
```

Ensures clean state for next user interaction.

---

## Missing Implementation Checklist

### High Priority (Blocking Flow Completion)
- [ ] **Screen 4: Donation Form** - Complete UI implementation
  - [ ] Department dropdown with `getActiveDepartments()`
  - [ ] Conditional amount field for cash donations
  - [ ] Form validation
  - [ ] Submit handler with `createDonation()`
  - [ ] Loading state during submission

- [ ] **Screen 5: Thank You** - Complete UI implementation
  - [ ] Success message with donor name
  - [ ] Conditional message based on donation type
  - [ ] Close/Done button

- [ ] **Landing Page CTA** - Add hero section or clickable baubles
  - [ ] Hero with "Make a Difference" button
  - [ ] OR implement clickable bauble areas on tree
  - [ ] Both should trigger `setIsModalOpen(true)`

### Medium Priority (UX Improvements)
- [ ] **Back Button Logic** - Track previous screen properly
  - [ ] Add `previousScreen` state
  - [ ] Update navigation to set it correctly
  - [ ] Use it in Child Details back button

- [ ] **"Any" Selection Handling** - Implement logic in search
  - [ ] If gender='any' OR age='any' → call `getRandomChild()`
  - [ ] Otherwise → call `searchChild()` with criteria

- [ ] **Loading States** - Add visual feedback
  - [ ] Spinner during API calls
  - [ ] Disable buttons during loading
  - [ ] "Finding a child for you..." message

### Low Priority (Polish)
- [ ] **Error Handling** - Toast notifications
  - [ ] Install `react-hot-toast` (already in package.json ✅)
  - [ ] Add `<Toaster />` to layout
  - [ ] Use `toast.error()` for failures

- [ ] **Form Validation** - Enhanced UX
  - [ ] Real-time validation feedback
  - [ ] Disable submit if invalid
  - [ ] Clear error messages

- [ ] **Success Animation** - Screen 5
  - [ ] Confetti or sparkle effect
  - [ ] Smooth transitions

---

## Testing Checklist

### Path A: Any Child → Gift Donation
1. Click landing page CTA
2. Click "Any Child"
3. Verify child details display correctly
4. Click "Donate Gift"
5. Fill in name and department
6. Submit form
7. Verify thank you message
8. Close modal

### Path B: Choose Child → Cash Donation
1. Click landing page CTA
2. Click "Choose a Child"
3. Select gender and age
4. Click "Search"
5. Verify child details display correctly
6. Click "Donate Cash"
7. Fill in name, department, and amount
8. Submit form
9. Verify thank you message with amount
10. Close modal

### Path C: "Any" Selections
1. Click "Choose a Child"
2. Select "Any" for gender and/or age
3. Verify random child is returned
4. Complete donation flow

### Edge Cases
- [ ] No unassigned children available
- [ ] Network error during API call
- [ ] Invalid form submission
- [ ] Decimal amounts (e.g., £25.50)
- [ ] Very long child names or gift ideas
- [ ] Back button navigation correctness
- [ ] Modal close/reset at each stage

---

## Deployment Considerations

### Environment Variables (.env)
```bash
DATABASE_URL="postgresql://..."      # Pooled connection (Prisma)
DIRECT_URL="postgresql://..."        # Direct connection (migrations)
```

### Database Seeding
```bash
npm run db:seed           # Seed departments, gift ideas, children
npm run db:seed-children  # Re-seed only children (if needed)
```

### Build & Deploy
```bash
npm run build   # Next.js build with Turbopack
npm run start   # Production server
```

### Prisma Considerations
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate deploy` in production
- Neon databases auto-suspend when inactive (use connection pooling)

---

## Future Enhancements (Out of Scope)

- **Admin Dashboard:** View all donations, manage children/departments
- **Analytics:** Department donation tracking, popular gift types
- **Email Notifications:** Send confirmation to donors
- **Gift Tracking:** Mark gifts as purchased/delivered
- **Priority Children:** Flag system for urgent cases
- **Categories:** Special needs, sports-focused, tech-interested
- **Donation History:** Show past donations per department
- **Leaderboard:** Gamify department participation

---

## Document Change Log

| Version | Date       | Changes                                    |
|---------|------------|--------------------------------------------|
| v2.0    | 2025-11-05 | Complete rewrite for Next.js + Prisma     |
| v1.0    | 2025-11-03 | Original (vanilla JS + Airtable)          |

---

## Related Documentation

- `docs/project-brief.md` - Project overview and goals
- `docs/architectural-principles.md` - Service layer pattern details
- `docs/design-and-style-guide.md` - UI/UX design system
- `prisma/schema.prisma` - Complete database schema
- `src/app/actions.ts` - Server Actions API reference
- `src/lib/services/business/` - Business logic services
- `src/components/DonationModal.tsx` - Modal implementation

---

**Questions or Clarifications Needed:**
1. Landing page entry point - hero CTA or clickable baubles? (Or both?)
2. Should "Any" gender/age call random or search with optional params?
3. Success screen - simple message or include child avatar/details again?
4. Form validation - real-time or on submit only?
