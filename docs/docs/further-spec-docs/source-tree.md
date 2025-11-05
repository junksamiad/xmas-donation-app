# Project Directory Structure

## Current Directory Layout (Sprint 5 Complete)

```
document-parser/
├── .bmad-core/                 # BMAD configuration
│   ├── core-config.yaml       # Core BMAD settings
│   ├── tasks/                 # BMAD tasks
│   ├── templates/             # BMAD templates
│   └── data/                  # BMAD data files
├── .vercel/                   # Vercel configuration
│   └── project.json          # Vercel project config
├── app/                       # Next.js App Router
│   ├── admin/                # Admin Dashboard
│   │   ├── (auth)/           # Auth route group
│   │   │   └── login/
│   │   │       └── page.tsx  # Admin login page
│   │   └── (protected)/      # Protected admin routes
│   │       ├── layout.tsx    # Admin layout with sidebar
│   │       ├── page.tsx      # Admin dashboard
│   │       ├── actions.ts    # Server actions
│   │       ├── activity/     # Activity monitoring (Sprint 4)
│   │       │   ├── page.tsx  # Global activity view
│   │       │   ├── actions.ts # Activity server actions
│   │       │   └── components/
│   │       │       ├── ActivitySummaryCards.tsx    # Metric cards
│   │       │       ├── ActivityTable.tsx          # Activity table
│   │       │       ├── DateRangeSelector.tsx      # Date filter
│   │       │       ├── DocumentTypeFilter.tsx     # Doc type filter
│   │       │       ├── ApiKeyFilter.tsx          # API key filter
│   │       │       ├── RefreshButton.tsx         # Manual refresh
│   │       │       └── ClientActivityView.tsx     # Client view
│   │       ├── users/        # User management
│   │       │   └── page.tsx  # Admin users list
│   │       └── clients/      # Client management (Sprint 2-3)
│   │           ├── page.tsx  # Client list
│   │           ├── actions.ts # Client server actions
│   │           ├── api-key-actions.ts # API key server actions (Sprint 3)
│   │           └── [id]/
│   │               ├── page.tsx     # Client detail with API keys tab
│   │               └── not-found.tsx # 404 for invalid clients
│   ├── api/
│   │   ├── admin/            # Admin API endpoints
│   │   │   ├── login/
│   │   │   │   └── route.ts  # Admin login endpoint
│   │   │   ├── logout/
│   │   │   │   └── route.ts  # Admin logout endpoint
│   │   │   └── users/
│   │   │       ├── route.ts  # Users CRUD
│   │   │       └── [id]/
│   │   │           ├── route.ts  # Single user operations
│   │   │           └── reset-password/
│   │   │               └── route.ts  # Password reset
│   │   ├── v1/               # API Version 1
│   │   │   ├── passport/
│   │   │   │   └── route.ts  # Passport parsing endpoint (Sprint 5)
│   │   │   │                 # - Multipart, base64, URL support
│   │   │   │                 # - Gemini AI integration
│   │   │   └── health/
│   │   │       └── route.ts  # Health check endpoint
│   │   ├── health/           # Root health check
│   │   │   └── route.ts
│   │   ├── docs/             # API documentation
│   │   │   └── route.ts      # Swagger UI endpoint
│   │   └── openapi.json/
│   │       └── route.ts      # OpenAPI spec endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   ├── error.tsx             # Error boundary
│   ├── global-error.tsx      # Global error handler
│   └── globals.css           # Global styles
├── components/
│   ├── admin/                # Admin UI Components
│   │   ├── admin-login-form.tsx        # Login form component
│   │   ├── AdminSidebar.tsx            # Admin navigation sidebar
│   │   ├── AdminUsersList.tsx          # Users table component
│   │   ├── AdminUsersListSkeleton.tsx  # Loading skeleton
│   │   ├── CreateAdminUserDialog.tsx   # Create user modal
│   │   ├── EditAdminUserDialog.tsx     # Edit user modal
│   │   ├── DeactivateConfirmDialog.tsx # Deactivate confirmation
│   │   ├── PasswordResetDialog.tsx     # Password reset modal
│   │   ├── AdminErrorBoundary.tsx      # Error boundary
│   │   ├── UserInfo.tsx                # User info display
│   │   └── clients/          # Client UI components (Sprint 2-3)
│   │       ├── ClientsList.tsx         # Client list table
│   │       ├── ClientsListSkeleton.tsx # Loading skeleton
│   │       ├── ClientDetails.tsx       # Client detail view with API keys
│   │       ├── CreateClientDialog.tsx  # Create client modal
│   │       ├── EditClientDialog.tsx    # Edit client modal
│   │       ├── ClientStatusDialog.tsx  # Status change modal
│   │       ├── create-client-schema.ts # Create validation
│   │       ├── edit-client-schema.ts   # Edit validation
│   │       ├── ApiKeysList.tsx         # API keys table (Sprint 3)
│   │       ├── ApiKeyStatusBadge.tsx   # Status badges (Sprint 3)
│   │       ├── ApiKeyColumns.tsx       # Table columns (Sprint 3)
│   │       ├── GenerateApiKeyDialog.tsx # Generate dialog (Sprint 3)
│   │       ├── GenerateApiKeyForm.tsx  # Generation form (Sprint 3)
│   │       ├── ApiKeyDisplay.tsx       # Secure display (Sprint 3)
│   │       ├── ApiKeyStatusDialog.tsx  # Status dialogs (Sprint 3)
│   │       ├── ApiKeyActions.tsx       # Actions menu (Sprint 3)
│   │       ├── ApiKeyDetailsDialog.tsx # Details modal (Sprint 3)
│   │       ├── ApiKeyDetailsContent.tsx # Details view (Sprint 3)
│   │       └── ApiKeyActivityList.tsx  # Activity list (Sprint 3)
│   ├── ui/                   # shadcn/ui components
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── tooltip.tsx
│   ├── app-sidebar.tsx       # Generic sidebar template
│   ├── login-form.tsx        # Generic login template
│   ├── nav-main.tsx          # Nav components
│   ├── nav-projects.tsx
│   ├── nav-secondary.tsx     # Secondary navigation
│   └── nav-user.tsx
├── docs/                      # Documentation
│   ├── archive/              # Archived sprint docs
│   │   └── phase-2/
│   │       ├── sprint-3/     # Sprint 3 archived docs
│   │       │   ├── 3.0-tier-alignment-migration.story.md
│   │       │   ├── 3.1-api-key-list.story.md
│   │       │   ├── 3.2-generate-api-key.story.md
│   │       │   ├── 3.3-revoke-deactivate-actions.story.md
│   │       │   ├── 3.4-api-key-details.story.md
│   │       │   ├── 3.5-server-actions-integration.story.md
│   │       │   ├── 3.6-integration-test-setup.story.md
│   │       │   ├── 3.7-end-to-end-test.story.md
│   │       │   └── sprint-3-summary.md
│   │       └── sprint-5/     # Sprint 5 archived docs
│   │           ├── prd.md   # Sprint 5 PRD
│   │           ├── architecture.md # Sprint 5 architecture
│   │           ├── story-5.1.md # Passport parser migration
│   │           ├── story-5.2.md # Multipart support
│   │           ├── story-5.3.md # JSON/base64 support
│   │           └── story-5.4.md # URL fetch support
│   ├── further-spec-docs/    # System documentation
│   │   ├── system-capabilities.md # Living system state
│   │   └── source-tree.md    # Directory structure
│   ├── testing/              # Test documentation
│   │   └── api-key-test-guide.md # API key testing guide (Sprint 3)
│   ├── test-docs/            # Sprint 5 test infrastructure
│   │   ├── test-multipart.ts # Multipart upload test
│   │   ├── test-base64.ts    # Base64 JSON test
│   │   ├── test-url.ts       # URL fetch test
│   │   ├── mock-s3/          # Mock S3 test files
│   │   ├── results/          # Test results storage
│   │   └── README.md         # Test documentation
│   ├── passport-endpoint-contract.md # API spec (Sprint 5)
│   ├── architecture/         # Architecture docs
│   │   ├── admin-ui-styling.md
│   │   ├── api-specification.md
│   │   ├── brownfield-context.md
│   │   ├── coding-standards.md
│   │   ├── database-schema.md
│   │   └── tech-stack.md
├── hooks/
│   ├── use-toast.ts          # Toast notification hook
│   └── use-mobile.tsx        # Mobile detection hook
├── lib/
│   ├── admin/                # Admin Services
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── auth.service.ts   # Auth service layer
│   │   ├── session.ts        # Session management
│   │   ├── admin-user.service.ts  # Admin user operations
│   │   ├── audit.service.ts  # Audit logging
│   │   ├── navigation.ts     # Admin nav configuration
│   │   └── rbac.middleware.ts # Role-based access control
│   ├── ai/                   # AI Services (Sprint 5)
│   │   ├── passport-parser.ts # Passport AI parsing logic
│   │   ├── passport-schema.ts # Passport Zod schemas
│   │   ├── doc-verification-constants.ts # AI model config
│   │   ├── doc-verification-interfaces.ts # Shared interfaces
│   │   └── file-detection.ts # Magic byte file detection
│   ├── clients/              # Client Services (Sprint 2)
│   │   ├── client.service.ts # Client business logic
│   │   ├── client.schemas.ts # Client validation schemas
│   │   └── __tests__/        # Client tests
│   ├── config/
│   │   ├── index.ts          # Central configuration
│   │   ├── constants.ts      # Application constants
│   │   ├── rate-limit.config.ts # Rate limit settings (Sprint 3: STARTER/PROFESSIONAL/ENTERPRISE)
│   │   └── __tests__/
│   │       └── index.test.ts
│   ├── db/                   # Database utilities
│   │   └── prisma.ts         # Prisma client singleton
│   ├── errors/
│   │   ├── index.ts          # Error classes
│   │   └── codes.ts          # Error codes enum
│   ├── middleware/
│   │   ├── compose.ts        # Middleware composer
│   │   ├── withAuth.ts       # Authentication middleware
│   │   ├── withErrorHandling.ts  # Error handling
│   │   ├── withRateLimit.ts      # Rate limiting
│   │   ├── withRequestLogging.ts # Request logging
│   │   ├── withUsageTracking.ts  # Usage tracking
│   │   └── __tests__/
│   ├── openapi/              # OpenAPI utilities
│   │   └── generator.ts      # OpenAPI generator
│   ├── repositories/
│   │   ├── api-key.repository.ts
│   │   └── __tests__/
│   ├── schemas/              # Zod validation schemas
│   │   └── requests/
│   │       └── passport.schema.ts
│   ├── security/
│   │   ├── api-key.security.ts  # API key hashing
│   │   └── __tests__/
│   ├── services/
│   │   ├── activity.service.ts          # Activity tracking (Sprint 4: Extended with getActivitySummary, getActivityDetails, getGlobalActivityMetrics, getClientActivitySummary)
│   │   ├── api-key-management.service.ts # API key management
│   │   ├── api-key.service.ts           # API key validation
│   │   ├── authentication.service.ts    # Authentication logic
│   │   ├── client-summary.service.ts    # Client summaries
│   │   ├── cost-calculation.service.ts  # Cost calculations
│   │   ├── logging.service.ts           # Logging service
│   │   ├── rate-limit.service.ts        # Rate limiting logic
│   │   ├── reporting.service.ts         # Usage reporting
│   │   ├── mock-data/                   # Mock responses
│   │   │   ├── passport.service.ts
│   │   │   └── __tests__/
│   │   └── __tests__/
│   ├── types/
│   │   ├── index.ts          # Type definitions
│   │   └── rate-limit.types.ts # Rate limit types (Sprint 3)
│   ├── utils/
│   │   ├── api-key-formatter.ts    # API key formatting
│   │   ├── client-summary-formatter.ts # Client formatting
│   │   ├── cost-aggregation.ts     # Cost calculations
│   │   ├── log-formatter.ts        # Log formatting
│   │   ├── log-sanitizer.ts        # Log sanitization
│   │   ├── logger.ts               # Logger utility
│   │   ├── report-formatter.ts     # Report formatting
│   │   └── __tests__/
│   └── utils.ts              # General utilities (cn function)
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts              # Database seeding
│   ├── migrations/          # Database migrations
│   │   └── 20250915162756_initial_postgresql_schema/
│   │       └── migration.sql
│   ├── migrations_backup_sqlite/    # SQLite migration backups
│   └── __tests__/
├── public/                   # Static assets
│   ├── easy-recruit-logo.png     # Company logo
│   ├── easy-recruit-favicon.ico  # Favicon
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/                  # Utility scripts
│   ├── api-key-management.ts    # API key CLI tool
│   ├── client-summary.ts        # Client summary tool
│   ├── generate-api-docs.ts     # API doc generator
│   ├── generate-api-key.ts      # Key generation tool
│   ├── list-api-keys.ts         # List keys tool
│   ├── seed-admin-user.ts       # Admin user seeder
│   ├── seed-test-data.ts        # Test data seeder
│   ├── usage-report.ts          # Usage report tool
│   └── __tests__/
├── tests/                    # Test files
│   ├── e2e/                 # End-to-end tests (Sprint 3)
│   │   ├── setup.ts         # Test environment setup
│   │   ├── helpers.ts       # Test helper functions
│   │   ├── test-data.ts     # Mock test data
│   │   ├── api-key-e2e.test.ts # API key E2E tests
│   │   ├── api-test-simplified.ts # Simplified API tests
│   │   ├── run-setup.ts     # Setup runner
│   │   ├── cleanup.ts       # Test cleanup
│   │   ├── test-report.md   # Test results markdown
│   │   └── test-report.json # Test results JSON
│   ├── helpers/             # Test helpers
│   ├── integration/         # Integration tests
│   │   ├── admin/           # Admin integration tests
│   │   │   ├── admin-auth.test.ts
│   │   │   ├── admin-login.test.ts
│   │   │   ├── admin-rbac.test.ts
│   │   │   ├── admin-session.test.ts
│   │   │   ├── admin-users-api.test.ts
│   │   │   └── audit.test.ts
│   │   ├── api/
│   │   │   ├── auth.test.ts
│   │   │   ├── documentation.test.ts
│   │   │   ├── passport.test.ts
│   │   │   ├── rate-limit.test.ts
│   │   │   └── usage-tracking.test.ts
│   │   └── scripts/
│   ├── prisma/
│   │   └── schema.test.ts
│   └── unit/                # Unit tests
│       ├── config.test.ts
│       └── scripts/
├── .env.example             # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── .mcp.json               # MCP server configuration
├── .prettierrc             # Prettier configuration
├── components.json         # shadcn/ui configuration
├── next-env.d.ts           # Next.js types
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies
├── package-lock.json       # Lock file
├── postcss.config.js       # PostCSS config
├── README.md               # Project documentation
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Vitest configuration
```

## Additional Files Not in Main Structure

```
├── .env.example             # Environment variables template
├── .env.development.local   # Development environment
├── .eslintignore           # ESLint ignore rules
├── test-client-dialog.js   # Test utility file
└── tsconfig.tsbuildinfo    # TypeScript build info
```

## Key Directory Conventions

1. **API Routes**: Always named `route.ts` in their respective directories
2. **Route Groups**: Use parentheses for Next.js route groups `(auth)`, `(protected)`
3. **Tests**: Co-located in `__tests__` directories or separate `/tests/` folder
4. **Services**: Business logic in `/lib/services/` or feature-specific folders
5. **Middleware**: Composable middleware in `/lib/middleware/`
6. **Schemas**: Zod schemas in `/lib/schemas/` or with services
7. **Types**: Shared types in `/lib/types/`
8. **Scripts**: CLI tools in `/scripts/`
9. **Documentation**: Architecture docs in `/docs/architecture/`

## File Naming Patterns

- **Services**: `{feature}.service.ts`
- **Middleware**: `with{Feature}.ts`
- **Repositories**: `{entity}.repository.ts`
- **Schemas**: `{purpose}.schema.ts` or `{entity}.schemas.ts`
- **Formatters**: `{entity}-formatter.ts`
- **Tests**: `{file}.test.ts`
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx` (Next.js convention)
- **Actions**: `actions.ts` (Server Actions)

## Important Notes

- **Admin Authentication**: Session-based with encrypted cookies (4-hour expiry)
- **API Authentication**: SHA-256 hashed API keys with tier-based rate limiting (Sprint 3)
- **Database**: PostgreSQL via Neon with Prisma ORM
- **Rate Limiting**: STARTER (100/min), PROFESSIONAL (500/min), ENTERPRISE (1000/min) - Sprint 3
- **UI Components**: shadcn/ui with Radix UI primitives + 11 new API key components (Sprint 3)
- **Testing**: Vitest for unit/integration, E2E test suite with helpers (Sprint 3)
- **State Management**: Server Components + Server Actions (no Redux/Zustand)
- **Styling**: Tailwind CSS with CSS variables
- **Type Safety**: Strict TypeScript with no `any` types in production
- **Deployment**: Vercel with serverless functions