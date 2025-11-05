# Implementation Checklist: Wire Up Donation Flow

**Status:** Ready to implement
**Last Updated:** 2025-11-05
**Database Status:** ✅ Seeded (160 children, 15 departments, 32 gift ideas)
**UI Status:** ✅ Complete (all 5 modal screens built)
**Service Layer:** ✅ Complete (all Server Actions ready)

---

## Prerequisites

- [ ] Install/verify react-hot-toast for error messages
- [ ] Add `<Toaster />` to layout or root component
- [ ] Import all Server Actions at top of DonationModal.tsx

---

## SCREEN 1: Selection → Wire "Any Child" Button

**File:** `src/components/DonationModal.tsx:127`

### Task 1.1: Add Loading State
- [ ] Add state: `const [isLoadingChild, setIsLoadingChild] = useState(false)`
- [ ] Show loading indicator during fetch

### Task 1.2: Wire getRandomChild()
- [ ] Replace placeholder with actual Server Action call
- [ ] Handle success: set child data and navigate to child-details
- [ ] Handle error: show toast and stay on screen
- [ ] Add loading state to button (disable + show spinner)

**Expected behavior:**
- Click "Any Child" → Loading → Child Details screen OR error toast

---

## SCREEN 2: Search → Wire Search Button

**File:** `src/components/DonationModal.tsx:265`

### Task 2.1: Handle "Any" Selections
- [ ] Check if `selectedGender === 'any'` OR `selectedAge === 'any'`
- [ ] If ANY selected → call `getRandomChild()`
- [ ] If BOTH specific → call `searchChild({ gender, age })`

### Task 2.2: Add Validation
- [ ] Check at least one field selected before search
- [ ] Show toast if no selections made

### Task 2.3: Wire Search Logic
- [ ] Add loading state during fetch
- [ ] Call appropriate Server Action based on selections
- [ ] Handle success: set child data and navigate
- [ ] Handle error: show toast and stay on screen
- [ ] Handle "no matches found" case

**Expected behavior:**
- Any selection → call `getRandomChild()`
- Specific gender + age → call `searchChild()`
- Error → toast message, stay on screen

---

## SCREEN 3: Child Details

**File:** `src/components/DonationModal.tsx:309-417`

### Task 3.1: Navigation Polish (Optional)
- [ ] Verify back button logic (should remember previous screen)
- [ ] Optional: Add `previousScreen` state to track selection vs search path

**Note:** No Server Action wiring needed for this screen.

---

## SCREEN 4: Donation Form → Critical Section

**File:** `src/components/DonationModal.tsx:420-531`

### Task 4.1: Load Active Departments
- [ ] Add state: `const [departments, setDepartments] = useState<Department[]>([])`
- [ ] Add `useEffect` to load on screen mount
- [ ] Call `getActiveDepartments()` Server Action
- [ ] Replace hardcoded options with loaded departments
- [ ] Use `department.id` as value (not slugs)
- [ ] Handle loading state for dropdown

### Task 4.2: Validate Donor Name Input

**Requirements:**
- Minimum 2 characters
- Maximum 50 characters
- Allow: letters, spaces, hyphens, apostrophes
- Block: numbers, special characters (%, +, @, etc.)
- Auto-capitalize first letter of each word
- Handle double-barrel names (e.g., "Smith-Jones")

**Implementation:**
- [ ] Add name validation regex: `/^[a-zA-Z\s'-]+$/`
- [ ] Add onChange handler to sanitize as they type
- [ ] Capitalize words: split on space/hyphen, capitalize each
- [ ] Trim whitespace
- [ ] Show error if invalid characters detected

### Task 4.3: Validate Donation Amount (Cash Only)

**Requirements:**
- Minimum: £20.00
- Maximum: £9,999.99
- Max 4 digits before decimal
- Max 2 digits after decimal
- Block negative numbers
- Block non-numeric input

**Implementation:**
- [ ] Add input validation on onChange
- [ ] Check min £20 on submit
- [ ] Check max £9999.99 on submit
- [ ] Format to 2 decimal places on blur
- [ ] Show validation errors clearly

### Task 4.4: Form Submission Validation
- [ ] Check donorName not empty and valid format
- [ ] Check department selected
- [ ] Check amount valid if cash donation
- [ ] Show specific error messages for each failure
- [ ] Disable submit button during validation errors

### Task 4.5: Wire createDonation() Server Action
- [ ] Add loading state: `const [isSubmitting, setIsSubmitting] = useState(false)`
- [ ] Disable form during submission
- [ ] Call `createDonation()` with all data
- [ ] Handle success: navigate to thank-you screen
- [ ] Handle error: show toast, keep user on form
- [ ] Handle specific errors (child not found, validation failed, etc.)

**Expected behavior:**
- Valid form → Loading → Success (thank you screen)
- Invalid form → Validation errors shown inline
- Server error → Toast message, stay on form
- Form disabled during submission

---

## SCREEN 5: Thank You

**File:** `src/components/DonationModal.tsx:534-572`

### Task 5.1: Verification Only
- [ ] Verify data displays correctly (name, amount, child)
- [ ] Verify close button resets everything

**Note:** No Server Action wiring needed for this screen.

---

## Cross-Cutting Concerns

### Error Handling Strategy
- [ ] Server Action errors → `toast.error(result.error)`
- [ ] Network errors → "Network error. Please try again."
- [ ] No children available → "No children available at this time."
- [ ] Invalid form → Inline validation messages + prevent submit

### Loading States
- [ ] "Any Child" button → Show spinner during fetch
- [ ] Search button → Show spinner during fetch
- [ ] Department dropdown → Show "Loading..." while fetching
- [ ] Submit button → Show "Submitting..." during creation
- [ ] Disable all buttons during loading

### Input Sanitization Functions

Create helper functions (consider putting in `src/lib/utils/validation.ts`):

- [ ] `sanitizeName(input: string): string` - Remove invalid chars, capitalize
- [ ] `validateName(name: string): { valid: boolean; error?: string }`
- [ ] `validateAmount(amount: string): { valid: boolean; error?: string }`
- [ ] `formatAmount(amount: string): string` - Format to 2 decimals

---

## Validation Rules Reference

### Donor Name

```typescript
// Regex pattern
const namePattern = /^[a-zA-Z\s'-]+$/;

// Rules
- Min length: 2
- Max length: 50
- Allowed: letters, spaces, hyphens, apostrophes
- Blocked: numbers, @, %, +, #, etc.
- Auto-format: capitalize each word

// Examples
✅ "John Smith"
✅ "Mary-Jane O'Connor"
✅ "João García"
❌ "John123"
❌ "John@Smith"
❌ "%FirstName"
```

### Donation Amount

```typescript
// Rules
- Min: 20.00
- Max: 9999.99
- Pattern: /^\d{1,4}(\.\d{0,2})?$/
- Format: Always display 2 decimals

// Examples
✅ "20"
✅ "50.00"
✅ "9999.99"
❌ "19.99" (below min)
❌ "10000" (above max)
❌ "50.999" (too many decimals)
❌ "-50" (negative)
```

### Department

```typescript
// Rules
- Must be selected (not empty)
- Must be valid ID from loaded departments
- Should be disabled until departments load
```

---

## Implementation Order

### Session 1: Screen 1 & 2 (Child Selection)
**Goal:** Wire up both child selection paths (random and search)

1. Add loading states
2. Wire "Any Child" button
3. Wire "Search" button with "any" handling
4. Add error handling for both
5. Test both paths work end-to-end

**Testing:**
- Click "Any Child" → Should load real child from database
- Search with "any" → Should load random child
- Search with specific criteria → Should load matching child
- No matches → Should show error toast

---

### Session 2: Screen 4 Setup (Form Loading)
**Goal:** Load departments dynamically from database

6. Load departments from Server Action
7. Update dropdown to use loaded data
8. Add loading state for departments
9. Test department dropdown works

**Testing:**
- Department dropdown shows all 15 active departments
- Values are department IDs (cuid format)
- Dropdown disabled during loading

---

### Session 3: Screen 4 Validation (Input Security)
**Goal:** Secure all form inputs against abuse

10. Create name validation helper functions
11. Wire up name input with sanitization
12. Create amount validation helper functions
13. Wire up amount input with constraints
14. Add inline validation feedback
15. Test all validation cases

**Testing:**
- Try entering "John123" → Should block/remove numbers
- Try entering "%Name" → Should block special chars
- Try entering "john smith" → Should capitalize to "John Smith"
- Try entering "£19.99" → Should show min £20 error
- Try entering "£10000" → Should show max £9999.99 error
- Try entering "£50.999" → Should format to "£50.99"

---

### Session 4: Screen 4 Submission (Final Wire-Up)
**Goal:** Complete the donation flow end-to-end

16. Wire createDonation() Server Action
17. Add submission loading state
18. Handle all success/error cases
19. Test full donation flow (gift and cash)
20. Test error scenarios

**Testing:**
- Submit gift donation → Should create donation record
- Submit cash donation → Should create donation with amount
- Child should be marked assigned in database
- Thank you screen shows correct information
- Donation appears in Prisma Studio

---

### Session 5: Polish & Testing
**Goal:** Final testing and edge cases

21. Add toast notifications everywhere
22. Test all error paths
23. Test back button navigation
24. Test modal reset on close
25. Test with real database data

**Testing:**
- Try donating same child twice → Second attempt should fail (no unassigned children)
- Close modal mid-flow → Should reset to selection screen
- Back button navigation → Should work correctly
- All 160 children can be donated to successfully
- Department tracking works correctly

---

## Current Status Checklist

### Database
- ✅ PostgreSQL (Neon) connected
- ✅ Prisma schema migrated
- ✅ 160 children seeded (10 per age 1-16)
- ✅ 15 departments seeded
- ✅ 32 gift ideas seeded
- ✅ All indexes created

### Service Layer
- ✅ ChildService with getRandomChild() and searchChild()
- ✅ DonationService with create() and transaction logic
- ✅ DepartmentService with getActive()
- ✅ GiftIdeaService (not used in flow but ready)
- ✅ Server Actions in src/app/actions.ts

### UI Components
- ✅ Landing page with "Donate Now" CTA
- ✅ DonationModal with all 5 screens
- ✅ CustomDropdown component
- ✅ SnowEffect component
- ✅ All animations and styling complete

### Ready to Implement
- ❌ Server Action wiring (3 TODOs)
- ❌ Department loading
- ❌ Input validation
- ❌ Error handling
- ❌ Loading states

---

## Testing Checklist (Post-Implementation)

### Happy Path Testing
- [ ] Path A: Any Child → Gift Donation
- [ ] Path A: Any Child → Cash Donation
- [ ] Path B: Search (specific) → Gift Donation
- [ ] Path B: Search (specific) → Cash Donation
- [ ] Path B: Search (any) → Gift Donation

### Edge Case Testing
- [ ] No unassigned children available
- [ ] Search returns no matches
- [ ] Invalid form submission
- [ ] Network error during fetch
- [ ] Database error during creation
- [ ] Modal close/reset at each stage
- [ ] Back button navigation

### Security Testing
- [ ] Name input blocks special characters
- [ ] Name input blocks numbers
- [ ] Amount input enforces min £20
- [ ] Amount input enforces max £9999.99
- [ ] Amount input blocks negative numbers
- [ ] Department must be selected

### Data Integrity Testing
- [ ] Child marked assigned after donation
- [ ] Donation record created correctly
- [ ] Department FK constraint works
- [ ] Child FK constraint works
- [ ] Amount stored as Decimal correctly

---

## Related Documentation

- `docs/app-flow-overview-v2.md` - Complete flow documentation
- `docs/architectural-principles.md` - Service layer pattern
- `src/app/actions.ts` - Server Actions reference
- `prisma/schema.prisma` - Database schema

---

## Notes

- **Minimum donation:** £20 (client requested)
- **Maximum donation:** £9,999.99 (prevent abuse)
- **Name validation:** Required due to last year's incident with special characters
- **Department loading:** Must be dynamic (departments may grow/change)
- **Child assignment:** Once donated, child removed from available pool
- **Error messages:** User-friendly, not technical

---

## Questions / Decisions Needed

- [ ] Should we add a "reason for amount" field for cash donations?
- [ ] Should we allow multiple donations per person?
- [ ] Should we track donor email for receipts?
- [ ] Should we add a "donate to multiple children" feature?
- [ ] Should we show total donations/stats on landing page?

---

**Ready to start Session 1!** 🎄
