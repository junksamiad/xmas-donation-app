# Brownfield Context - Sprint 1 Foundation

> **Purpose**: Handover document providing both strategic context (WHY) and implementation details (WHAT/HOW) for developers taking over or continuing development.
> **Last Updated**: 2025-09-20
> **Sprint/Phase**: Sprint 1 - Foundation & Core Experience

---

## Sprint/Phase Conceptual Overview

### Business Context
**Problem Statement**: Last year's vanilla JS Christmas donation app was clunky with poor UX - modal flows were jarring, no gamification to drive engagement, and no real-time feedback. The office donation campaign needs a modern, engaging platform to maximize participation.

**Solution Approach**: Complete rebuild using modern Next.js stack with focus on polished UI, smooth wizard flows, department gamification, and real-time updates to create an engaging donation experience.

**Success Metrics**:
- Deployment pipeline working end-to-end
- Foundation supports animated, responsive UI
- Database schema ready for 369 children records
- Platform ready for rapid feature development

### Strategic Decisions

#### Why This Sprint?
We prioritized foundation and infrastructure first to enable rapid development in subsequent sprints. Last year's app proved the concept but lacked the technical foundation for a polished experience. This sprint unblocks all future UI and feature work.

#### Key Design Decisions
| Decision | Choice Made | Alternatives Considered | Rationale |
|----------|-------------|------------------------|-----------|
| Frontend Framework | Next.js 15 with App Router | Remix, Vanilla React, Keep vanilla JS | Next.js provides best DX, built-in optimization, easy Vercel deployment |
| Database | Prisma + Neon PostgreSQL | Keep Airtable, Supabase, MongoDB | Type safety with Prisma, Vercel integration with Neon, relational data fits well |
| Styling | Tailwind CSS + shadcn/ui | Material UI, Chakra, Custom CSS | Tailwind for speed, shadcn for quality components, matches modern standards |
| Real-time Updates | SWR polling (5-10 sec) | WebSockets, Server-Sent Events | Simple to implement, good enough for use case, no separate server needed |
| Authentication | None (anonymous) | User accounts, SSO | Reduces friction for donations, keeps it simple for office campaign |
| Deployment | Vercel | AWS, Netlify, Self-hosted | Zero-config with Next.js, automatic deploys from GitHub |

#### Intentional Trade-offs
- **Deferred**: Admin authentication - focusing on donor experience first, admin can query database directly
- **Simplified**: Polling instead of true real-time - 5-10 second updates are sufficient for leaderboard
- **Technical Debt Accepted**: No tests yet - will add after core features work, manual testing sufficient for now

---

## Current System Overview

### What Was Actually Built
- **Foundation**: Full Next.js project with TypeScript, all dependencies installed and configured
- **Deployment Pipeline**: GitHub repository connected to Vercel with automatic deployments on push
- **Database Schema**: Prisma models for Child and Donation entities with proper relations and indexes
- **Health Endpoint**: Basic API endpoint to verify deployment works
- **Production URL**: Live at https://xmas-donation-o754892bi-junksamiad.vercel.app

### Tech Stack (As Implemented)
- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript 5.x with strict mode
- **Database**: PostgreSQL on Neon (schema ready, not connected)
- **ORM**: Prisma 6.16.2
- **Deployment**: Vercel serverless functions
- **UI Components**: React 19.1.0, ready for shadcn/ui
- **Authentication**: None

## Key Implementation Patterns

### API Route Pattern (App Router)
```typescript
// src/app/api/[endpoint]/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data });
}
```

### Prisma Model Pattern
```prisma
model Child {
  id         String     @id @default(cuid())
  recipient  String
  age        Int
  gender     String
  donations  Donation[] // Relations

  @@index([assigned])  // Indexes for performance
}
```

## Authentication Systems

### Current State
- **No Authentication**: Application is fully anonymous
- **Future Admin**: May add password-protected admin dashboard
- **Security**: Environment variables for sensitive data (database URLs)

## Database Models

### Donation System Models
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

model Donation {
  id           String   @id @default(cuid())
  childId      String
  child        Child    @relation(fields: [childId], references: [id])
  donorName    String
  department   String
  donationType String   // 'gift' or 'cash'
  amount       Decimal? @db.Decimal(10, 2)
  createdAt    DateTime @default(now())
}
```

## Current System Structure

### Project Structure
```
/src/app/              # App Router
├── api/
│   └── health/       # Health check endpoint
│       └── route.ts
├── layout.tsx        # Root layout
├── page.tsx          # Home page
└── globals.css       # Global styles

/prisma/
├── schema.prisma     # Database schema

/docs/
├── prd.md           # Sprint PRD
├── project-planning.md
├── stories/         # User stories
└── docs/
    ├── spec_templates/
    └── further-spec-docs/
```

## Critical Files to Review

### For Understanding Project Structure
- `src/app/layout.tsx` - Root layout showing App Router pattern
- `src/app/api/health/route.ts` - API route pattern example
- `next.config.ts` - Next.js configuration

### Database & ORM
- `prisma/schema.prisma` - Complete database schema
- `.env.local` - Environment variable template (not committed)

### Documentation
- `docs/project-planning.md` - All architectural decisions and plans
- `docs/prd.md` - Sprint 1 requirements and goals
- `docs/stories/story-1.*.md` - Individual story details

## Common Gotchas

### Environment Variables
- **Missing Database URLs**: Neon database not created yet, need to add DATABASE_URL and DIRECT_URL to Vercel
- **Local Development**: Use `.env.local` file (git ignored)

### Build Issues
- **Node Modules**: Large binary files, always excluded from git
- **Turbopack**: Using for both dev and build (experimental but working)

### Environment Variables
```bash
# Database (REQUIRED - not yet configured)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require
```

## Testing Approach

### Current Testing Strategy
- **Manual Testing**: Via deployed Vercel URL
- **Type Safety**: TypeScript compilation catches type errors
- **Quality Baselines**: Build must pass, no TypeScript errors

### Testing Commands
```bash
npm run dev          # Local development
npm run build        # Production build (must pass)
npm run start        # Start production server
npx tsc --noEmit     # Type check without building
```

## Development Workflow

### Quality Gates (Must Pass)
1. **TypeScript Compilation** - No type errors
2. **Next.js Build** - Successful production build
3. **Deployment** - Vercel deployment succeeds
4. **Health Check** - /api/health returns 200

### Common Commands
```bash
# Development
npm run dev

# Database (when connected)
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
npx prisma studio       # Visual database editor

# Deployment
git add -A && git commit -m "message" && git push  # Auto-deploys to Vercel
```

## Next Steps for Development

1. **Create Neon Database**: Sign up at neon.tech, create database, get connection strings
2. **Connect Database**: Add environment variables to Vercel, run migrations
3. **Migrate Airtable Data**: Import 369 children records into Neon
4. **Start Story 1.2**: Install shadcn/ui, build Christmas UI with animations

## System Health Checklist

### Functional Health
- [x] Deployment Pipeline: GitHub → Vercel working
- [x] Health Endpoint: Returns 200 at /api/health
- [ ] Database Connection: Not yet connected (expected)
- [ ] Data Migration: Waiting on database setup

### Technical Health
- [x] No critical bugs blocking usage
- [x] Build passes without errors
- [x] TypeScript compilation clean
- [x] Production URL accessible

### Process Health
- [x] Documentation up to date
- [ ] Test coverage adequate (no tests yet - intentional)
- [x] Code in version control
- [x] Deployment automated

---

## Handover Notes

### For Developers Taking Over

#### Quick Start
1. Clone repo: `git clone https://github.com/junksamiad/xmas-donation-app`
2. Install deps: `npm install`
3. Run locally: `npm run dev`
4. Verify at: http://localhost:3000

#### Understanding the Codebase
- **Start Here**: `docs/project-planning.md` for all decisions
- **Core Flow**: User clicks gift → Wizard opens → Select child → Enter info → Donate
- **Key Patterns**: App Router for routing, Prisma for database, API routes in app/api

#### Known Issues & Workarounds
| Issue | Impact | Workaround | Planned Fix |
|-------|--------|------------|-------------|
| Database not connected | Can't store data | Use local state for testing | Connect Neon in next session |
| No Airtable migration | No child data | Use mock data | Migrate after DB connected |

### Questions This Sprint Answered
1. **Q**: Should we keep the existing backend? **A**: No, unified Next.js codebase is better
2. **Q**: WebSockets for real-time? **A**: No, SWR polling is simpler and sufficient
3. **Q**: Which UI library? **A**: shadcn/ui for quality components with customization
4. **Q**: Authentication needed? **A**: Not for donors, keeps friction low

### Open Questions for Next Sprint
1. Should we add email notifications for donations?
2. Do we need a print view for organizers?
3. Should departments have donation targets/goals?
4. How to handle if a child gets multiple donations?

---

## Appendix: Key Learning & Insights

### What Worked Well
- **Vercel Deployment**: Zero-config deployment was seamless
- **Prisma Schema**: Clean schema design with good relationships
- **Project Structure**: App Router structure is clean and scalable
- **Documentation**: Creating docs upfront helps maintain clarity

### What We'd Do Differently
- **Database First**: Could have connected Neon earlier for immediate testing
- **Git History**: Should have been more careful with secrets in initial commits

### Recommendations for Next Phase
1. **Priority**: Get database connected and data migrated - blocks everything else
2. **Consider**: Adding error boundaries and loading states early
3. **Avoid**: Over-engineering the admin dashboard - keep it simple

---

*This document serves as a handover snapshot. For living documentation, see system-capabilities.md. For requirements, see PRD. For technical specifications, see architecture docs.*