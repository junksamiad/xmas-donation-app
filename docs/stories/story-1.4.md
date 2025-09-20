# Story 1.4: API Routes & Database Integration

## Overview
Connect the beautiful frontend to the database with Next.js API routes. Implement all endpoints needed for the donation flow and department statistics.

## Acceptance Criteria
- [ ] GET `/api/children/random` - Returns available random child
- [ ] GET `/api/children/search` - Search by gender/age
- [ ] POST `/api/donations` - Record new donation
- [ ] GET `/api/stats/departments` - Department leaderboard data
- [ ] GET `/api/stats/summary` - Overall donation statistics
- [ ] Proper error handling and status codes
- [ ] Type-safe API with Zod validation
- [ ] Prisma queries optimized for performance

## Technical Approach
1. **API Structure**
   - Route handlers in `app/api`
   - Shared Prisma client singleton
   - Zod schemas for request/response validation
   - Consistent error response format

2. **Core Endpoints**
   - Children endpoints with availability checking
   - Donation creation with transaction safety
   - Real-time stats aggregation
   - Proper CORS headers

3. **Database Queries**
   - Efficient Prisma queries with proper indexes
   - Avoid N+1 problems
   - Use transactions for donations
   - Aggregate queries for statistics

4. **Type Safety**
   - Shared types between frontend/backend
   - Zod validation for all inputs
   - Prisma generated types

## Dependencies
- Story 1.1 completion (database ready)
- Story 1.3 completion (wizard needs endpoints)

## Testing Strategy
- **When to Test**: After each endpoint
- **Test Types**: API testing with Thunder Client/Postman
- **Quality Gates**: All endpoints return correct data
- **Notes**: Test error cases and edge conditions