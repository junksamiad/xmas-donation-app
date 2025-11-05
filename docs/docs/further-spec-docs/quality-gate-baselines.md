# Quality Gate Baseline Standards

## Purpose
This document defines the acceptable baseline for code quality metrics. These baselines represent the current state of technical debt that has been reviewed and accepted. Any new code must not exceed these baselines without explicit justification.

## How to Use This Document
1. **Before merging**: Run all quality gates and compare against these baselines
2. **No new warnings/errors**: New code should not introduce warnings beyond these baselines
3. **Test files excluded**: Test file errors are not included in production baselines
4. **Document any additions**: If new warnings are unavoidable, document the justification

## Quality Gate Commands
```bash
npm run lint        # Check for linting issues
npm run type-check  # Check for TypeScript errors
npm run build       # Verify production build
```

---

## Current Baselines (Sprint 5 Complete)

### Lint Warnings: 23 Total

#### Detailed Warning List

##### `@typescript-eslint/no-explicit-any` (21 warnings)
1. `app/admin/(protected)/activity/components/ActivityTable.tsx:128` - Dynamic Prisma query result
2. `app/admin/(protected)/activity/components/ActivityTable.tsx:129` - Dynamic Prisma query result
3. `app/admin/(protected)/clients/ClientsList.tsx:227` - Dynamic column sorting handler
4. `app/admin/(protected)/clients/ClientsList.tsx:228` - Dynamic column sorting handler
5. `app/api/v1/health/route.ts:52` - Middleware composition pattern
6. `app/api/v1/passport/route.ts:394` - Middleware composition pattern
7. `components/admin/AdminUsersList.tsx:141` - Dynamic table sorting logic
8. `components/admin/AdminUsersList.tsx:142` - Dynamic table sorting logic
9. `components/admin/clients/ApiKeysList.tsx:259` - Dynamic column sorting
10. `components/admin/clients/ApiKeysList.tsx:260` - Dynamic column sorting
11. `lib/admin/audit.service.ts:60` - Flexible audit metadata object
12. `lib/admin/rbac.middleware.ts:19` - NextRequest type extension
13. `lib/clients/client.service.ts:305` - Dynamic Prisma query builder
14. `lib/middleware/compose.ts:18` - Middleware function composition
15. `lib/middleware/compose.ts:24` - Middleware function composition
16. `lib/middleware/compose.ts:72` - Middleware function composition (first parameter)
17. `lib/middleware/compose.ts:72` - Middleware function composition (second parameter)
18. `lib/middleware/compose.ts:75` - Middleware function composition
19. `lib/utils/report-formatter.ts:119` - Flexible report data structure
20. `lib/utils/report-formatter.ts:120` - Flexible report data structure

##### Other Warnings (2)
21. `components/admin/AdminSidebar.tsx:42` - `@next/next/no-img-element` - Using native `<img>` for static logo
22. `components/admin/clients/ApiKeyDetailsDialog.tsx:107` - `react-hooks/exhaustive-deps` - Intentional dependency omission

---

### TypeScript Errors: 0 Production Errors ✅

**Note**: Test files contain 16 errors but are excluded from production baselines as they don't affect the build.

### Build Status: PASSING ✅

---

## Justifications for Accepted Warnings

### Core Infrastructure `any` Types
- **Middleware composition** (`compose.ts`): TypeScript limitation with function composition
- **Dynamic report formatting** (`report-formatter.ts`): Handles variable data structures
- **Audit/RBAC services**: Legacy code managing dynamic permission structures

### Table Sorting `any` Types (Sprint 4)
- **Dynamic column types**: Tables sort mixed data types (strings, numbers, dates)
- **Isolated scope**: Limited to comparison variables in sorting logic
- **Industry pattern**: Standard approach for generic table sorting

### Middleware Composition (Sprint 5)
- **TypeScript limitation**: Known issue with contravariant type inference
- **Industry standard**: Same pattern used by Express, Redux, Next.js
- **Well-documented**: Includes detailed comment with GitHub issue reference

### Next.js Image Warning
- **Admin sidebar logo**: Uses standard img tag for SVG logo
- **No optimization needed**: SVG files don't benefit from Next.js Image component

---

## Enforcement Policy

1. **Zero tolerance for new warnings** without documented justification
2. **All new code must pass quality gates** before merge
3. **Test file errors excluded** from production metrics
4. **Quarterly review** to reduce baseline where possible

---

*Last Updated: December 2024*
*Current Sprint: 5 (AI Parser Integration Complete)*