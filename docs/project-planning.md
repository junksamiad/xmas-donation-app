# 🎄 Christmas Donation App - Project Planning Document

## Project Overview
Rebuilding last year's vanilla JS Christmas donation app as a modern Next.js application. The app facilitates holiday gift giving by connecting office workers with children in need through an interactive Christmas tree interface.

## Current Status
- **Last Year**: Working vanilla JS app with HTML/CSS/Tailwind
- **This Year**: Complete rebuild using Next.js for better performance, maintainability, and features
- **Backend**: Existing Replit API with Airtable database (may keep or rebuild)

---

## Key Decision Points

### 1. Core Experience Enhancement
**Question**: How should we enhance the core donation experience?

**Last Year's Flow**:
- Click on tree → Select child → Donate

**Options for This Year**:
- [ ] **Progressive Disclosure**: Start with a landing page explaining the cause, then tree interaction
- [x] **Gamification**: Track department totals, show progress bars, leaderboards
- [ ] **Social Features**: Allow donors to leave messages, see colleagues' participation
- [ ] **Multi-tree**: Different trees for different age groups or categories

**Decision**: **Hybrid Approach - Interactive Gifts with Gamification**
- Keep the festive Christmas tree/gifts image as the main interface
- Make gift boxes clickable to trigger a smooth wizard-style flow
- Add department leaderboard/metrics (anonymous individual data)
- Include animations (snow, sparkles, smooth transitions)

**Notes**:
- User likes the gift/tree image concept but wants better execution
- Last year's modal flow was clunky - needs smooth wizard UI
- Gamification by department is key (keeps individuals anonymous)
- Animations are important for the festive feel
- Keep it simple but polished - "10X the app" with polish and gamification

---

### 2. Technical Architecture
**Question**: What's the preferred technical stack?

**Options**:
- [x] **Full-stack Next.js** (API routes + Prisma/Neon for DB)
- [ ] **Next.js frontend + Keep existing backend** (integrate with Replit API)
- [ ] **Next.js + New backend service** (rebuild backend in Next.js)

**Decision**: **Full-stack Next.js with Prisma + Neon**
- Unified codebase for easier maintenance
- Prisma for type safety and better DX
- Neon PostgreSQL database (Vercel integration)
- Next.js API routes for all backend logic
- Deploy everything on Vercel

**Considerations**:
- Will need to migrate data from Airtable to Neon
- Prisma provides excellent TypeScript integration
- Unified deployment simplifies DevOps

**Notes**:
- Fresh start with modern stack
- Type safety throughout with Prisma
- Better performance with Vercel/Neon integration

---

### 3. Data & State Management
**Question**: How should we handle user data and application state?

**Authentication**:
- [ ] Anonymous donations (like last year)
- [ ] User accounts with email
- [ ] SSO integration (company login)

**Real-time Features**:
- [x] **Show when gifts are claimed live**
- [x] **Update available children count dynamically**
- [x] **Show donation progress in real-time**

**Implementation Strategy for Real-time**:
- Use SWR or React Query for polling (every 5-10 seconds)
- Optimistic updates for immediate feedback
- Consider Server-Sent Events (SSE) if needed later
- Note: WebSockets require separate server, so polling is pragmatic

**Persistence**:
- [x] **Remember who donated what (for database records)**
- [ ] Save draft donations
- [ ] Donation history per user

**Decision**: **Anonymous Frontend with Backend Tracking**
- No user accounts required
- Track all donations in database with names/departments
- Use polling for near real-time updates (good enough for this use case)

**Notes**:
- Polling every 5-10 seconds gives "live enough" feel
- Can upgrade to SSE later if needed
- Keeping it simple but effective

---

### 4. Visual/UX Priorities
**Question**: What should be the design and UX focus?

**Device Priority**:
- [ ] Mobile-first (for on-the-go donations)
- [ ] Desktop-focused (for office use)
- [ ] Fully responsive (equal priority)

**Accessibility**:
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader support
- [ ] Keyboard navigation

**Visual Polish**:
- [ ] Minimal/clean (focus on functionality)
- [x] **Festive animations (snow, twinkling lights)**
- [x] **Interactive effects (gift hover states, smooth transitions)**

**Decision**: **Festive and Polished**
- Snow animation on the page
- Smooth transitions for wizard flow
- Gift boxes with hover effects (glow, slight scale)
- Animated progress bars for department competition
- Confetti or celebration animation on successful donation

**Notes**:
- Animations are key to making it feel special
- Keep interactions smooth and responsive
- Visual feedback for all actions

---

### 5. Admin Features
**Question**: What administrative capabilities are needed?

**Options**:
- [x] **Dashboard to see donation statistics**
- [ ] Bulk upload children data
- [x] **Export reports for organizers**
- [ ] Manage departments/teams
- [ ] Send bulk thank you emails
- [ ] Edit/remove donations
- [ ] Set donation goals/targets

**Decision**: **Simple Admin Dashboard**
- Basic stats page (password protected)
- View donations by department
- Search/filter/sort donations
- Export to CSV for reports
- No editing capabilities (keep it simple)

**Notes**:
- Children data pre-populated (369 records from Airtable)
- Departments hardcoded: Marketing, Sales, Accounts
- Focus on viewing/reporting, not management

---

## Additional Features to Consider

### Email/Communication
- [ ] Email confirmations for donations
- [ ] Reminder emails for uncommitted selections
- [ ] Thank you emails with tax receipt info
- [ ] Weekly progress updates to departments

### Reporting
- [ ] Department participation rates
- [ ] Popular gift categories
- [ ] Donation timeline/patterns
- [ ] Unfulfilled children alerts

### Security/Compliance
- [ ] GDPR compliance for data handling
- [ ] Secure payment processing (if adding payment gateway)
- [ ] Data encryption for children's information
- [ ] Audit trail for donations

---

## Sprint Planning

### Sprint 1 Goals
_[To be defined after key decisions]_

### Future Sprints
_[To be outlined based on priorities]_

---

## Technical Specifications

### Frontend Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- SWR or React Query (data fetching/polling)
- React Hook Form + Zod (form validation)

### Backend Stack
- Next.js API Routes
- Prisma ORM
- Neon PostgreSQL
- Zod (API validation)

### Deployment
- Vercel
- Custom domain
- SSL/HTTPS

---

## Success Metrics
- Number of donations completed
- Time to complete donation
- Department participation rate
- User satisfaction/feedback
- Zero critical bugs during campaign

---

## Timeline Considerations
- **Campaign Start Date**: _[When do donations need to open?]_
- **Development Time**: _[Sprints planned]_
- **Testing Period**: _[Buffer before launch]_
- **Campaign Duration**: _[How long will it run?]_

---

## Risks and Mitigation
- **Risk**: Backend API downtime
  - **Mitigation**: Implement caching, fallback options

- **Risk**: High traffic spikes
  - **Mitigation**: Proper scaling, CDN usage

- **Risk**: Data privacy concerns
  - **Mitigation**: Clear privacy policy, secure data handling

---

## Notes and Decisions Log

### Date: [Today]
- Initial planning document created
- Reviewing last year's implementation
- Starting interactive planning process

_[Continue adding dated entries as decisions are made]_