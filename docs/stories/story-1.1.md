# Story 1.1: Project Foundation & Deployment Setup

## Overview
Set up Next.js project with TypeScript, Prisma, Neon database, GitHub repo, and Vercel deployment pipeline. Get a working deployment URL early for continuous testing.

## Acceptance Criteria
- [ ] Next.js 14+ project created with TypeScript and App Router
- [ ] GitHub repository created under `junksamiad` account
- [ ] Vercel deployment configured with `junksamiad` profile
- [ ] Production URL obtained from Vercel
- [ ] Prisma configured with Neon PostgreSQL
- [ ] Database schema created for children and donations
- [ ] Airtable data migrated to Neon (369 records)
- [ ] Basic health check endpoint working on production

## Technical Approach
1. **Project Setup**
   - `npx create-next-app@latest` with TypeScript, Tailwind, App Router
   - Install Prisma, shadcn/ui, Framer Motion, SWR
   - Configure environment variables

2. **Git & Deployment**
   - Initialize git repo
   - Push to GitHub under junksamiad account
   - Deploy to Vercel using CLI with junksamiad profile
   - Get production URL (customize domain later)

3. **Database Setup**
   - Create Neon database
   - Define Prisma schema:
     - Child model (from Airtable structure)
     - Donation model
     - Department stats view
   - Run migrations
   - Create data migration script from Airtable

4. **Verification**
   - `/api/health` endpoint returns 200
   - Database connection verified
   - Children data accessible via Prisma

## Dependencies
- None (first story)

## Testing Strategy
- **When to Test**: After story completion
- **Test Types**: Manual smoke test on Vercel deployment
- **Quality Gates**: TypeScript builds without errors
- **Notes**: Verify deployment pipeline works end-to-end