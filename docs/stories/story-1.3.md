# Story 1.3: Interactive Donation Wizard

## Overview
Create a smooth, multi-step wizard flow for the donation process. Replace last year's clunky modals with an elegant step-by-step experience using shadcn/ui components.

## Acceptance Criteria
- [ ] Multi-step form wizard with progress indicator
- [ ] Step 1: Choose selection method (Any Child / Specify by age/gender)
- [ ] Step 2: Display child details in beautiful card
- [ ] Step 3: Choose donation type (Gift / Cash)
- [ ] Step 4: Donor information form with validation
- [ ] Smooth transitions between steps
- [ ] Back/Next navigation with proper state management
- [ ] Form validation with helpful error messages
- [ ] Success animation (confetti) on completion

## Technical Approach
1. **Wizard Architecture**
   - React Hook Form for form state
   - Zod for validation schemas
   - Context or Zustand for wizard state
   - Framer Motion for step transitions

2. **UI Components**
   - shadcn/ui Dialog for wizard container
   - Stepper component for progress
   - Card components for child details
   - Form components with proper accessibility
   - Loading states during API calls

3. **User Flow**
   - Click gift → Wizard opens with animation
   - Smooth slide transitions between steps
   - Maintain state when going back
   - Optimistic UI updates
   - Clear success feedback

4. **Validation & UX**
   - Real-time field validation
   - Disable next until step valid
   - Auto-focus first field each step
   - Proper error handling

## Dependencies
- Story 1.2 completion (UI components ready)

## Testing Strategy
- **When to Test**: After implementation
- **Test Types**: Manual flow testing, form validation testing
- **Quality Gates**: All form validations working
- **Notes**: Test on mobile and desktop for usability