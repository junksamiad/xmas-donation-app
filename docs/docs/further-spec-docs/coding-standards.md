# 15. Coding Standards

## General Principles

1. **Type Safety First**: Minimize `any` types in production code (baseline tracking required), pragmatic exceptions in tests
2. **Fail Fast**: Validate early, throw meaningful errors
3. **Single Responsibility**: Each function/class does one thing well
4. **Testable Code**: Write code with testing in mind
5. **Documentation**: Code should be self-documenting with JSDoc for public APIs
6. **Quality Enforcement**: All code must pass TypeScript, ESLint, and build checks

## Naming Conventions

### Files and Folders
```typescript
// Files
user.service.ts          // Services: noun.service.ts
withAuth.ts             // Middleware: with{Feature}.ts
api-key.repository.ts   // Repositories: {entity}.repository.ts
parse.schema.ts         // Schemas: {purpose}.schema.ts
route.ts               // API routes: always route.ts

// Folders
/services              // Plural for collections
/middleware            // Singular for categories
/api/v1/passport      // Kebab-case for URLs
```

### Variables and Functions
```typescript
// Variables - camelCase
const userId = "123";
const apiKeyHash = "abc";
const isAuthenticated = true;

// Functions - camelCase, verb first
function validateApiKey(key: string): boolean {}
function parseDocument(base64: string): ParseResult {}
async function fetchUserById(id: string): Promise<User> {}

// Classes - PascalCase
class AuthenticationService {}
class ApiKeyRepository {}

// Interfaces/Types - PascalCase, I prefix optional
interface User {}
interface ApiResponse {}
type DocumentType = 'passport' | 'driving-licence';

// Enums - PascalCase for name, SCREAMING_SNAKE for values
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMITED = 'RATE_LIMITED'
}

// Constants - SCREAMING_SNAKE for true constants
const MAX_RETRIES = 3;
const API_VERSION = 'v1';

// Object constants - camelCase
const defaultConfig = {
  timeout: 5000,
  retries: 3
};
```

### Database (Prisma)
```prisma
// Models - PascalCase singular
model Client {}
model ApiKey {}

// Fields - camelCase throughout
model Client {
  id        Int @id @default(autoincrement()) // Always use Int for IDs
  firstName String
  createdAt DateTime @default(now())
}

// Relations - camelCase
apiKeys ApiKey[] @relation("ClientApiKeys")

// Enums - PascalCase name, SCREAMING_SNAKE values
enum ClientStatus {
  ACTIVE
  SUSPENDED
}

// IMPORTANT: Database IDs are always numbers in TypeScript
// Prisma Int → TypeScript number
// Never use string for database IDs
```

## Code Organization

### Sprint 1: Admin-Specific Organization (Implemented)
```typescript
// Admin file naming conventions
/app/admin/(auth)/*/page.tsx        // Auth route group pages
/app/admin/(protected)/*/page.tsx   // Protected admin pages
/app/admin/(protected)/actions.ts   // Server Actions
/lib/admin/*.service.ts             // Admin services (mixed naming: some .service.ts, some .ts)
/lib/admin/auth.ts                  // Authentication utilities
/lib/admin/session.ts               // Session management
/components/admin/*.tsx             // Admin UI components
/app/api/admin/*/route.ts           // Admin API routes

// Admin-specific type prefixes
interface AdminUser {}              // Prefix with 'Admin'
type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT';
enum AdminStatus { ACTIVE, INACTIVE, SUSPENDED }
enum AuditAction {}                 // Comprehensive audit actions
```

### Import Order
```typescript
// 1. Node built-ins
import { createHash } from 'crypto';

// 2. External packages
import { NextRequest } from 'next/server';
import { z } from 'zod';

// 3. Internal aliases
import { prisma } from '@/lib/prisma';
import { ApiError } from '@/lib/errors';

// 4. Relative imports
import { validateRequest } from './utils';

// 5. Type imports
import type { User, ApiKey } from '@/types';
```

### File Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Main export (class/function)
// 5. Helper functions
// 6. Default export (if needed)

// Example service file:
import { prisma } from '@/lib/prisma';

interface CreateUserDto {
  email: string;
  name: string;
}

const MAX_USERS_PER_ACCOUNT = 10;

export class UserService {
  async createUser(dto: CreateUserDto) {
    // Implementation
  }
  
  private validateEmail(email: string) {
    // Helper
  }
}
```

## Server Actions Pattern (Sprint 1)

```typescript
// Server Actions should return ActionResponse type
interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Server Action with proper error handling
export async function createClientAction(
  data: CreateClientDto
): Promise<ActionResponse<Client>> {
  try {
    // 1. Validate session
    const session = await validateAdminSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Execute business logic
    const client = await clientService.createClient(data);

    // 3. Audit log
    await auditService.log({
      action: 'CLIENT_CREATED',
      userId: session.userId,
      targetId: client.id,
    });

    // 4. Revalidate cache
    revalidatePath('/admin/clients');

    return { success: true, data: client };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An error occurred' };
  }
}
```

## Error Handling

```typescript
// Always use custom errors
import { ApiError, ERROR_CODES } from '@/lib/errors';

// Good
throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, 'Invalid API key');

// Bad
throw new Error('Invalid API key');

// Always handle errors explicitly
try {
  const result = await riskyOperation();
} catch (error) {
  // Log the error
  logger.error('Operation failed', { error, context });
  
  // Return user-friendly error
  if (error instanceof ApiError) {
    throw error;
  }
  
  throw new ApiError(500, ERROR_CODES.INTERNAL_ERROR, 'Operation failed');
}
```

## Async/Await

```typescript
// Always use async/await over promises
// Good
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
}

// Bad
function fetchData() {
  return fetch('/api/data').then(res => res.json());
}

// Always handle async errors
async function safeOperation() {
  try {
    return await riskyAsyncOperation();
  } catch (error) {
    logger.error('Async operation failed', error);
    throw new ApiError(500, ERROR_CODES.OPERATION_FAILED);
  }
}
```

## TypeScript Specific

```typescript
// Use type inference where obvious
// Good
const name = "John"; // Type inferred as string

// Unnecessary
const name: string = "John";

// Be explicit for function returns
// Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Use union types over enums for simple cases
// Good
type Status = 'active' | 'inactive' | 'pending';

// Overkill for simple cases
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

// Use const assertions for literals
const config = {
  apiVersion: 'v1',
  maxRetries: 3
} as const;
```

## API Response Standards

```typescript
// Success response
{
  "success": true,
  "data": { /* actual data */ },
  "metadata": {
    "version": "v1",
    "timestamp": "2024-12-10T10:00:00Z",
    "requestId": "req_123"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": { /* field errors */ }
  },
  "metadata": { /* same as above */ }
}

// Paginated response
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalCount": 100
  },
  "metadata": { /* same as above */ }
}
```

## Testing Standards (Sprint 2 Strategy Integrated)

### 🔴 Mandatory Two-Phase Testing Process

Every story MUST pass both phases before marking complete:

#### Phase 1: Code Quality Checks (Developer)
```bash
# Run in order after completing each story
npm test                    # Run any existing tests
npm run lint               # Must not exceed 9 warnings (baseline)
npm run type-check         # Must have 0 errors (baseline)
npm run build              # Must succeed

# Check for new 'any' types
grep -r "any" app/admin lib/clients components/admin \
  --include="*.ts" --include="*.tsx" | \
  grep -v "// eslint-disable" | wc -l  # Establish baseline and track
```

#### Phase 2: Browser Testing (Browser-Tester Sub-Agent)
```typescript
// After code quality passes, invoke browser-tester
await Task.invoke('browser-tester', {
  subagent_type: 'browser-tester',
  description: 'Test Story X.X implementation',
  prompt: `[Specific test instructions per story - see testing strategy doc]`
})
```

### Quality Baselines (DO NOT EXCEED)

| Metric | Current Baseline | Location of Existing Issues |
|--------|-----------------|----------------------------|
| **Lint Warnings** | Baseline TBD | Run `npm run lint` to establish current baseline |
| **Type Errors** | 0 in production | Test files have 16 (ignored) |
| **'any' Types** | ~84 instances | Multiple files - baseline audit needed |
| **Build Status** | Must succeed | - |
| **Page Load** | <2 seconds | No degradation allowed |

### Test File Structure
```typescript
// Test file naming
{feature}.service.test.ts       // Service tests
{feature}.test.ts               // Component tests
route.test.ts                   // API route tests

// Full unit/integration test structure (not smoke tests)
describe('ClientService', () => {
  describe('createClient', () => {
    it('should create client with valid data', async () => {
      const client = await clientService.createClient(validData);
      expect(client).toBeDefined();
      expect(client.tier).toBe('FREE');
    });

    it('should reject duplicate email', async () => {
      await expect(clientService.createClient(duplicateEmail))
        .rejects.toThrow('Email already exists');
    });

    it('should create audit log', async () => {
      await clientService.createClient(validData);
      const logs = await auditService.getRecentLogs();
      expect(logs[0].action).toBe('CLIENT_CREATED');
    });
  });
});
```

### Browser Testing Requirements
- UI features MUST be tested via browser-tester sub-agent
- Test both happy path and error scenarios
- Verify audit logs are created
- Check for console errors
- Ensure no hard deletes in database

### Common Test Fixes

```typescript
// Issue: Decimal type from Prisma
// BAD
creditBalance: client.creditBalance  // Decimal type fails serialization

// GOOD
creditBalance: Number(client.creditBalance)  // Convert to number

// Issue: Missing test IDs for browser testing
// GOOD
<button data-testid="create-client-button">New Client</button>

// Issue: Async state not updating
// GOOD - Always revalidate after mutations
revalidatePath('/admin/clients')
```

## Documentation Standards

```typescript
/**
 * Validates an API key and returns the associated client
 * @param apiKey - The API key to validate
 * @returns The authenticated client
 * @throws {ApiError} 401 if key is invalid
 * @example
 * const client = await validateApiKey('dp_live_123');
 */
export async function validateApiKey(apiKey: string): Promise<Client> {
  // Implementation
}

// For complex types, document properties
/**
 * Configuration for document parsing
 */
interface ParseConfig {
  /** Maximum file size in bytes (default: 10MB) */
  maxFileSize?: number;
  
  /** Supported document types */
  allowedTypes?: DocumentType[];
  
  /** Whether to include OCR for images */
  includeOcr?: boolean;
}
```

## Quality Enforcement

### 'any' Type Policy
```typescript
// Production Code: MINIMIZE USAGE
// Current state: Multiple instances found across:
// - lib/middleware/compose.ts (11 instances - complex middleware typing)
// - lib/utils/*.ts (10 instances across multiple files)
// - lib/clients/client.service.ts (production code)
// - lib/admin/rbac.middleware.ts (production code)
// - scripts/*.ts (53 instances - CLI tools)
// Note: Baseline audit and reduction plan needed

// ❌ Don't add new 'any' types
function processData(data: any) { } // AVOID

// ✅ Use proper types or 'unknown' with type guards
function processData(data: unknown) {
  if (typeof data === 'string') {
    // Now TypeScript knows data is a string
  }
}

// Test Files: Pragmatic Exceptions Allowed
// ✅ Minimal 'any' usage acceptable for complex mocks
const mockRepo = vi.mocked<Repository>()
mockRepo.find.mockImplementation(((args: any) => {
  // Complex mock logic
}) as any)
```

### Quality Gates (Definition of Done)

A story is ONLY complete when ALL criteria are met:

**Code Quality:**
- [ ] `npm run type-check` → 0 errors (baseline: 0)
- [ ] `npm run lint` → No new warnings (baseline: 9 legacy)
- [ ] `npm run build` → Must succeed
- [ ] No new 'any' types (track against established baseline)

**Functional Testing:**
- [ ] Browser-tester sub-agent executed and passed
- [ ] No console errors in browser
- [ ] UI responsive (<2s page loads)

**Data Integrity:**
- [ ] Audit logs created for all operations
- [ ] No hard deletes (soft delete via status only)
- [ ] Status transitions follow documented rules

**Sprint Completion Gate:**
- [ ] All stories tested and passed
- [ ] Full end-to-end workflow tested
- [ ] No regression in existing features
- [ ] Testing strategy document followed

### Environment Setup
Required environment variables for development:
```bash
# Security
API_KEY_SALT=<generated-with-openssl>  # For API key hashing
ADMIN_SESSION_SECRET=<generated-with-openssl>  # For admin session encryption (Phase 2)

# Rate Limiting (development)
KV_REST_API_URL=https://test-kv.vercel.app
KV_REST_API_TOKEN=test_token_for_local_development

# Database
DATABASE_URL=postgresql://...

# Admin Setup (Sprint 1 - Implemented)
ADMIN_SESSION_SECRET=<64-char-hex>      # Required for session encryption
ADMIN_EMAIL=admin@cucumber-recruitment.com  # Default admin email
ADMIN_PASSWORD=<secure-password>        # Default admin password
```

## Related Documents

- **Testing Strategy**: Documentation to be created for test scenarios per story
- **Architecture Documentation**: `/docs/architecture/` - Technical specifications
- **Sprint PRDs**: `/docs/prd.md` - Product requirements

## Git Commit Standards

```bash