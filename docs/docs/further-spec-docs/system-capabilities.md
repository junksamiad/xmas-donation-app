# System Capabilities & Technical Reference

> **Purpose**: Living snapshot of what ACTUALLY exists in the codebase - validated, working features only.
> **Last Updated**: 2025-09-20
> **Usage**: Reference this document when planning new sprints or implementing features.
>
> **IMPORTANT**: This document contains ONLY:
> - ✅ Validated, working features that exist in code
> - ✅ Reusable patterns currently implemented
> - ✅ Infrastructure actually deployed
> - ❌ NO planned or partial features
> - ❌ NO future roadmap items
> - ❌ NO broken functionality

## Table of Contents

### Application Layer
1. [Technology Stack](#1-technology-stack)
2. [Database & Data Models](#2-database--data-models)
3. [API Architecture](#3-api-architecture)
4. [UI Components & Patterns](#4-ui-components--patterns)
5. [Reusable Components](#5-reusable-components)
6. [Development Patterns](#6-development-patterns)

### Security Layer
7. [Authentication & Security](#7-authentication--security)

### Infrastructure Layer
8. [Infrastructure & Hosting](#8-infrastructure--hosting)
9. [DevOps & CI/CD](#9-devops--cicd)

### Integration Layer
10. [Integration Patterns](#10-integration-patterns)
11. [File Processing Pipeline](#11-file-processing-pipeline)
12. [AI Document Processing](#12-ai-document-processing)

### Quality Layer
13. [Testing & Quality Standards](#13-testing--quality-standards)

### Sprint History
14. [Sprint 1 Additions](#14-sprint-1-additions)

---

## 1. Technology Stack

### Core Framework
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 20.x

### Database Layer
- **Database**: PostgreSQL (Neon - serverless)
- **ORM**: Prisma 6.16.2
- **Schema Strategy**: Relational with indexed lookups

### Authentication
- **Method**: None currently (anonymous donations)
- **Session Management**: N/A
- **Security Features**: N/A

### UI Framework
- **Component Library**: React 19.1.0
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form 7.63.0 + Zod 4.1.9
- **Animations**: Framer Motion 12.23.16
- **Icons**: Lucide React 0.544.0

### Infrastructure
- **Hosting**: Vercel (serverless)
- **Caching**: N/A (will use SWR for client-side)
- **CDN**: Vercel Edge Network

### Critical Version Requirements
```json
{
  "next": "15.5.3",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "prisma": "^6.16.2",
  "@prisma/client": "^6.16.2",
  "typescript": "^5",
  "tailwindcss": "^4",
  "framer-motion": "^12.23.16",
  "swr": "^2.3.6",
  "react-hook-form": "^7.63.0",
  "zod": "^4.1.9"
}
```

---

## 2. Database & Data Models

### Core Models

#### Child
- **Purpose**: Stores information about children needing donations
- **Key Fields**:
  - `id` (cuid)
  - `recipient` (string) - Child's name
  - `age` (int)
  - `gender` (string)
  - `giftIdeas` (text)
  - `priority` (boolean)
  - `assigned` (boolean)
- **Relations**: One-to-many with Donations
- **Business Rules**:
  - Child can have multiple donations
  - Assigned flag tracks if child has any donation

#### Donation
- **Purpose**: Records donation commitments
- **Key Fields**:
  - `id` (cuid)
  - `childId` (foreign key)
  - `donorName` (string)
  - `department` (string)
  - `donationType` (string) - 'gift' or 'cash'
  - `amount` (decimal, nullable) - For cash donations
  - `createdAt` (datetime)
- **Relations**: Many-to-one with Child
- **Business Rules**:
  - Amount only required for cash donations
  - Department must be one of: Marketing, Sales, Accounts

### Database Patterns
- **Indexes**: On `assigned`, `[gender, age]`, `department`, `createdAt`
- **ID Strategy**: CUID for all primary keys
- **Timestamps**: Automatic createdAt/updatedAt on relevant models

---

## 3. API Architecture

### Endpoint Structure
```
/api/health            GET     - Health check endpoint
```

### Request/Response Patterns

#### Standard Response Format
```typescript
// Health check response
{
  status: 'healthy',
  timestamp: string (ISO 8601),
  environment: 'development' | 'production'
}
```

#### Authentication
- **Method**: None implemented
- **Headers**: N/A

#### Rate Limiting
- **Implementation**: None (handled by Vercel)
- **Limits**: Vercel defaults

#### File Upload Limits
- **Maximum Size**: N/A (no file uploads)
- **Supported Formats**: N/A

---

## 4. UI Components & Patterns

### Component Library
- **Components Available**: Default Next.js App Router components

### UI Patterns

#### App Router Layout
```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Application Components

#### Pages
- **Home Page**: Default Next.js starter page at `/`

---

## 5. Reusable Components

### Core Services
- **Prisma Client**: Database ORM (configured, not connected)

### Utility Functions
```typescript
// clsx + tailwind-merge utility ready for use
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
```

### Middleware
- None implemented yet

### UI Components
- None implemented yet

---

## 6. Development Patterns

### File Structure
```
/src
  /app
    /api
      /health         - API routes
    layout.tsx        - Root layout
    page.tsx          - Pages
    globals.css       - Global styles
/prisma
  schema.prisma       - Database schema
/public              - Static assets
```

### Naming Conventions
- **Files**: kebab-case for routes, PascalCase for components
- **Components**: PascalCase
- **Functions**: camelCase
- **API Routes**: route.ts for App Router

### Import Patterns
```typescript
// Absolute imports configured
import { something } from '@/components/something'
```

### Error Handling
```typescript
// Standard Next.js error handling
try {
  // operation
} catch (error) {
  return NextResponse.json({ error: 'message' }, { status: 500 })
}
```

### Environment Variables
```env
# Required (not yet configured)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

---

## 7. Authentication & Security

### Authentication Method
- **Type**: None
- **Implementation**: Anonymous donations only

### Session Management
- **Storage**: N/A
- **Duration**: N/A

### Permission System
- **Roles**: None
- **Enforcement**: N/A

### Security Patterns
- CORS handled by Next.js
- Environment variables for sensitive data

---

## 8. Infrastructure & Hosting

### Current Infrastructure
- **Hosting Platform**: Vercel (serverless functions)
- **Database**: Neon PostgreSQL (not connected)
- **Storage**: None

### Environment Configuration
- **Development**: Local with .env.local
- **Staging**: N/A
- **Production**: https://xmas-donation-o754892bi-junksamiad.vercel.app

### Resource Limits
- **API Timeout**: 10 seconds (Vercel default for hobby)
- **File Upload**: N/A
- **Memory**: 1024 MB (Vercel default)

---

## 9. DevOps & CI/CD

### Current Setup
- **Version Control**: GitHub (junksamiad/xmas-donation-app)
- **Deployment**: Automatic via Vercel on push to main
- **Build Process**: Next.js build with Turbopack

### Build Commands
```bash
npm run dev       # Development with Turbopack
npm run build     # Production build with Turbopack
npm run start     # Start production server
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
```

### Monitoring & Logging
- **Error Tracking**: Vercel dashboard only
- **Performance**: Vercel Analytics (not configured)
- **Logging**: Console logs visible in Vercel Functions tab

---

## 10. Integration Patterns

### Service Layer Pattern
Not yet implemented - will use:
```typescript
// Future pattern for services
export class ChildrenService {
  async getRandomChild() { }
  async searchChildren(criteria) { }
}
```

### Repository Pattern
Using Prisma ORM directly (no repository abstraction)

---

## 11. File Processing Pipeline

### Document Processing Flow
N/A - No file processing

### Supported Documents
N/A

### Processing Patterns
N/A

---

## 12. AI Document Processing

### Overview
**Purpose**: N/A
**Status**: Not implemented

### Processing Capabilities
N/A

### Performance
N/A

### Cost Management
N/A

---

## 13. Testing & Quality Standards

### Quality Gates
- **TypeScript**: Strict mode enabled
- **Build**: Must pass Next.js build
- **Linting**: None configured

### Testing Process
1. **Manual Testing**: Via deployed Vercel URL
2. **Type Checking**: TypeScript compilation

### Test Patterns
```typescript
// No test framework configured yet
// Will use React Testing Library + Jest
```

---

## 14. Sprint 1 Additions

### New Capabilities Added
- ✅ **Next.js Project**: Full TypeScript setup with App Router
- ✅ **Deployment Pipeline**: GitHub → Vercel automatic deployment
- ✅ **Database Schema**: Prisma models for Child and Donation
- ✅ **Health Check**: API endpoint at /api/health
- ✅ **Production URL**: https://xmas-donation-o754892bi-junksamiad.vercel.app

### Patterns Established
- **Project Structure**: App Router with src directory
- **API Pattern**: Route handlers in app/api
- **Database ORM**: Prisma with PostgreSQL
- **Deployment**: Git push triggers automatic deployment

### Components Created
- **Health API**: Simple health check endpoint
- **Prisma Schema**: Child and Donation models

---

## Notes for Future Sprints

1. **Database Connection**: Need to create Neon database and add connection strings to Vercel environment variables
2. **Data Migration**: 369 children records from Airtable ready to import
3. **UI Components**: shadcn/ui ready to install and configure
4. **Departments**: Hardcoded as Marketing, Sales, Accounts
5. **Real-time Updates**: Will use SWR with 5-10 second polling
6. **Authentication**: Keeping anonymous for now, may add admin auth later

---

*This document is the single source of truth for system capabilities. Update after each sprint with new patterns, components, and capabilities.*