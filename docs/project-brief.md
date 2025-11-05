# Christmas Donation App - Project Brief

## Project Overview

A festive web application enabling company staff to donate gifts or cash to children in need during the Christmas season. The app provides an engaging, modal-based submission flow with a beautiful Christmas-themed interface featuring falling snow animation.

---

## Business Objectives

1. **Enable Charitable Giving**: Streamline the process for staff to donate gifts or cash to children in need
2. **Drive Engagement**: Create an interactive, festive experience that encourages participation
3. **Track Donations**: Maintain records of all donations by department and donor
4. **Transparent Selection**: Allow donors to either select a specific child (by criteria) or be randomly matched

---

## Technical Stack

### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Deployment**: Vercel
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS

### Architecture Approach
- **Server Actions** for form submissions and mutations
- **Server Components** for data fetching in pages
- **Client Components** for interactive UI elements
- **Three-layer architecture**: App / Business / Shared (see architectural-principles.md)

---

## Phase 1: Initial Build (MVP)

### Scope
Create a clean, functional landing page with basic modal submission flow.

### Deliverables

#### 1. New Landing Page
- **Layout**: Single, non-scrollable full-screen page
- **Background**: Festive Christmas theme with falling snow animation (from village page)
- **Hero Element**: Prominent call-to-action to start donation process
- **Color Scheme**: Red and green Christmas theme with professional execution

#### 2. Modal Submission Flow
- **Trigger**: Single prominent CTA button on landing page
- **Flow**: Multi-step modal wizard implementing the branching logic from app-flow-overview.md
- **Design**: Red/green themed modal following the shadow, responsive, and color design guides
- **States**: Loading, form validation, success confirmation

#### 3. Database Integration
- **Existing Schema**: Already defined (Child and Donation models)
- **Server Actions**: Create actions for:
  - Fetching random child
  - Searching children by criteria
  - Submitting donation

---

## User Flow Summary

```
Landing Page (Snow Background)
    ↓ Click CTA
Modal Opens: Choose Gift Recipient
    ↓
    ├─→ Any Child (Random)
    │       ↓
    │   Show Child Details
    │
    └─→ Specify Child (Search)
            ↓ Gender + Age
        Show Child Details

From Child Details:
    ├─→ Donate Gift
    │       ↓
    │   Gift Form (Name, Department)
    │       ↓
    │   Thank You Screen
    │
    └─→ Donate Cash
            ↓
        Cash Form (Name, Department, Amount)
            ↓
        Thank You Screen
```

---

## Database Schema (Already Implemented)

### Child Model
```prisma
model Child {
  id         String     @id @default(cuid())
  recipient  String
  age        Int
  gender     String
  giftIdeas  String     @db.Text
  priority   Boolean    @default(false)
  assigned   Boolean    @default(false)
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  donations  Donation[]
}
```

### Donation Model
```prisma
model Donation {
  id           String   @id @default(cuid())
  childId      String
  donorName    String
  department   String
  donationType String   // 'gift' or 'cash'
  amount       Decimal? @db.Decimal(10, 2)
  createdAt    DateTime @default(now())
}
```

---

## File Structure for Phase 1

```
src/
├── app/
│   ├── page.tsx                          # New landing page (Server Component)
│   ├── layout.tsx                        # Root layout
│   └── actions.ts                        # Server Actions for donation flow
│
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx              # Main landing hero with CTA
│   │   └── DonationModal.tsx            # Main modal component (Client)
│   ├── donation/
│   │   ├── RecipientSelection.tsx       # Any/Specify choice screen
│   │   ├── SearchForm.tsx               # Gender/Age search form
│   │   ├── ChildDetails.tsx             # Display child info + donation choice
│   │   ├── GiftDonationForm.tsx         # Gift donation form
│   │   ├── CashDonationForm.tsx         # Cash donation form
│   │   └── ThankYouScreen.tsx           # Confirmation screen
│   └── ui/
│       ├── SnowEffect.tsx               # Existing snow animation
│       └── [shadcn components]          # Modal, Button, Form, etc.
│
├── lib/
│   ├── types/
│   │   └── donation.ts                  # Shared types for donation flow
│   ├── services/business/
│   │   └── donation.service.ts          # Business logic for donations
│   └── database.ts                       # Prisma client singleton
```

---

## Design Constraints

1. **Single Page**: Landing page must not require scrolling
2. **Modal-Based**: All interactions after initial CTA happen in modal
3. **Responsive**: Must work on desktop, tablet, and mobile
4. **Accessible**: Proper focus management, keyboard navigation, ARIA labels
5. **Festive but Professional**: Christmas theme without being childish

---

## Non-Goals for Phase 1

The following are **not** in scope for initial build:
- Admin dashboard
- Donation editing/cancellation
- Email notifications
- Social sharing
- Multiple language support
- Analytics integration
- Authentication/login
- Department leaderboards (planned for Phase 2)

---

## Success Criteria

### Functional Requirements
- ✅ User can donate a gift to a random child
- ✅ User can search for a child by gender and age
- ✅ User can donate cash with custom amount
- ✅ All donations are recorded in database
- ✅ User receives confirmation after donation

### Non-Functional Requirements
- ✅ Page loads in under 2 seconds
- ✅ Modal animations are smooth (60fps)
- ✅ Forms validate input before submission
- ✅ Error states provide helpful feedback
- ✅ Design matches approved style guide

---

## Future Phases (Not Included in Initial Build)

### Phase 2: Enhanced Features
- Department leaderboards
- Real-time donation stats
- Village visualization (like existing /village page)

### Phase 3: Admin Features
- Admin dashboard for managing children
- Donation management
- Reporting and analytics

### Phase 4: Advanced Features
- Email notifications
- Social sharing
- Gift recommendations
- Donation matching

---

## Key Dependencies

### External Services
- **Neon Database**: PostgreSQL hosting
- **Vercel**: Application hosting and deployment

### NPM Packages (Core)
- `next` (14+)
- `react` (18+)
- `typescript`
- `prisma` + `@prisma/client`
- `framer-motion` (for animations)
- `tailwindcss`
- `zod` (for form validation)
- `react-hook-form` (for form management)

---

## Development Approach

### Iterative Development
1. **Sprint 1**: Landing page + basic modal structure
2. **Sprint 2**: Full donation flow implementation
3. **Sprint 3**: Testing, refinement, deployment

### Quality Gates
- TypeScript strict mode (no `any` types)
- Form validation on all user inputs
- Error boundaries for graceful failure
- Loading states for all async operations

### Testing Strategy
- Manual testing of all user flows
- Browser testing (Chrome, Safari, Firefox)
- Mobile responsive testing
- Accessibility testing

---

## Risk Management

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database connection issues | High | Use connection pooling, error boundaries |
| Poor mobile experience | Medium | Mobile-first design approach |
| Slow modal animations | Low | Use framer-motion best practices |
| Form validation gaps | Medium | Use Zod schemas, comprehensive testing |

---

## Timeline Estimate

### Phase 1 (MVP)
- **Week 1**: Landing page + modal structure
- **Week 2**: Donation flow implementation + testing
- **Week 3**: Polish, deployment, documentation

**Total**: 3 weeks for complete Phase 1 delivery

---

## Stakeholder Communication

### Progress Updates
- Weekly status reports
- Demo sessions after each sprint
- Slack/email for urgent issues

### Feedback Channels
- GitHub issues for bugs
- Design reviews via Figma/screenshots
- User testing sessions

---

## Documentation Requirements

### Developer Documentation
- ✅ This project brief
- ✅ Design and style guide (separate document)
- ✅ Architecture principles (already exists)
- ⏳ API documentation (Server Actions)
- ⏳ Component documentation

### User Documentation
- ⏳ Quick start guide for donors
- ⏳ FAQ section

---

## Launch Checklist

Before going live:
- [ ] All user flows tested and working
- [ ] Database seeded with child records
- [ ] Environment variables configured in Vercel
- [ ] Error monitoring set up (Sentry or similar)
- [ ] Performance testing completed
- [ ] Mobile responsive verified
- [ ] Accessibility audit passed
- [ ] Security review completed
- [ ] Deployment pipeline tested

---

## Version History

- **v1.0** (2025-11-05): Initial project brief created
