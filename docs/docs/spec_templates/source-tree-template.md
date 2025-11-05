# Project Directory Structure

## Current Directory Layout

```
[PROJECT-NAME]/
├── .config/                   # Configuration files
│   └── [CONFIG FILES]
├── app/                       # Application root
│   ├── [ROUTE]/              # Route structure
│   │   └── page.tsx          # Page components
│   ├── api/
│   │   └── [VERSION]/        # API versioning
│   │       └── route.ts      # API endpoints
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── [FEATURE]/            # Feature components
│   │   └── [COMPONENT].tsx   # Component files
│   └── ui/                   # UI library components
│       └── [UI-COMPONENT].tsx
├── docs/                      # Documentation
│   ├── [CATEGORY]/           # Doc categories
│   └── [DOCUMENT].md         # Documentation files
├── hooks/
│   └── [HOOK].ts             # Custom React hooks
├── lib/
│   ├── [SERVICE]/            # Service layer
│   │   └── [SERVICE].ts      # Service files
│   ├── config/
│   │   └── [CONFIG].ts       # Configuration
│   ├── db/                   # Database utilities
│   ├── errors/               # Error handling
│   ├── middleware/           # Middleware
│   ├── schemas/              # Validation schemas
│   ├── services/             # Business logic
│   ├── types/                # Type definitions
│   └── utils/                # Utilities
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
│   └── [ASSETS]
├── scripts/                  # Utility scripts
│   └── [SCRIPT].ts
├── tests/                    # Test files
│   ├── e2e/                  # End-to-end tests
│   ├── integration/          # Integration tests
│   └── unit/                 # Unit tests
├── [CONFIG FILES]            # Root config files
└── package.json              # Dependencies
```

## Additional Files Not in Main Structure

```
├── .env.example             # Environment variables template
└── [OTHER FILES]
```

## Key Directory Conventions

1. **API Routes**: [CONVENTION]
2. **Route Groups**: [CONVENTION]
3. **Tests**: [CONVENTION]
4. **Services**: [CONVENTION]
5. **Middleware**: [CONVENTION]
6. **Schemas**: [CONVENTION]
7. **Types**: [CONVENTION]
8. **Scripts**: [CONVENTION]
9. **Documentation**: [CONVENTION]

## File Naming Patterns

- **Services**: [PATTERN]
- **Middleware**: [PATTERN]
- **Repositories**: [PATTERN]
- **Schemas**: [PATTERN]
- **Formatters**: [PATTERN]
- **Tests**: [PATTERN]
- **Pages**: [PATTERN]
- **Layouts**: [PATTERN]
- **Actions**: [PATTERN]

## Important Notes

- **[TOPIC]**: [DETAILS]