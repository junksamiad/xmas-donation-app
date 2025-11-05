import nextConfig from 'eslint-config-next/core-web-vitals';
import nextTsConfig from 'eslint-config-next/typescript';
import importX from 'eslint-plugin-import-x';

// Base configuration that applies to all files
const baseConfig = {
  plugins: {
    'import-x': importX,
  },
  rules: {
    // Block explicit any - requires authorization for any usage
    '@typescript-eslint/no-explicit-any': 'error',

    // Allow unused variables that start with underscore
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // ============================================
    // IMPORT ORDER ENFORCEMENT
    // ============================================
    'import-x/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'next',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@/lib/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@/app/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // ============================================
    // ARCHITECTURAL LAYER SEPARATION RULES
    // ============================================
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/lib/services/*'],
            message:
              "Components cannot import business services directly! Use Server Actions from actions.ts files instead. This maintains proper layer separation.",
          },
        ],
        paths: [
          {
            name: '@prisma/client',
            importNames: ['PrismaClient'],
            message:
              "Don't instantiate PrismaClient directly. Use the singleton from @/lib/db in service files only.",
          },
        ],
      },
    ],
  },
  settings: {
    'import-x/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.ts', '.tsx'],
      },
    },
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};

export default [
  // Global ignore patterns
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'next-env.d.ts',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '.vercel/**',
      'out/**',
      'build/**',
      'old-app/**',
    ],
  },

  // Extend Next.js configs
  ...nextConfig,
  ...nextTsConfig,

  // Apply base configuration to all TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
    ...baseConfig,
  },

  // ============================================
  // EXCEPTIONS FOR SERVICE FILES
  // Services NEED database access - this is their purpose!
  // ============================================
  {
    files: [
      'src/lib/services/**/*.ts',
      'src/lib/db.ts',
      'prisma/**/*.ts',
    ],
    rules: {
      // Service files can access database and import between themselves
      'no-restricted-imports': 'off',
    },
  },

  // ============================================
  // EXCEPTIONS FOR SERVER ACTIONS
  // Server Actions bridge the App Layer and Business Layer
  // ============================================
  {
    files: ['**/actions.ts', '**/actions.tsx', 'src/app/actions/**/*.ts', 'src/app/actions/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/db'],
              message:
                'Server Actions should use business services (from @/lib/services) instead of direct database access. This maintains proper layer separation.',
            },
          ],
        },
      ],
    },
  },

  // ============================================
  // RESTRICTIONS FOR APP LAYER COMPONENTS
  // Components must use Server Actions, never business services directly
  // ============================================
  {
    files: ['src/app/**/*.tsx', 'src/app/**/*.ts', 'src/components/**/*.tsx', 'src/components/**/*.ts'],
    ignores: ['**/actions.ts', '**/actions.tsx', 'src/app/actions/**/*', 'src/app/api/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/services/*'],
              message:
                'Components cannot import business services! Use Server Actions from actions.ts files instead. Server Components should also use actions for consistency.',
            },
            {
              group: ['@/lib/db'],
              message:
                'Components cannot access the database. Use Server Actions that call business services.',
            },
          ],
        },
      ],
    },
  },

  // ============================================
  // EXCEPTIONS FOR API ROUTES
  // API routes can use business services but not database directly
  // ============================================
  {
    files: ['src/app/api/**/*.ts', 'src/app/api/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/db'],
              message:
                'API routes should use business services (from @/lib/services) instead of direct database access.',
            },
          ],
        },
      ],
    },
  },

  // ============================================
  // EXCEPTIONS FOR LIB UTILITIES
  // Utilities should not import business services or database
  // ============================================
  {
    files: ['src/lib/utils/**/*.ts', 'src/lib/types/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/services/*'],
              message: 'Utility layer should not depend on business services.',
            },
            {
              group: ['@/lib/db'],
              message: 'Utility layer should not access the database.',
            },
            {
              group: ['@/app/*'],
              message: 'Utility layer should not depend on app layer.',
            },
          ],
        },
      ],
    },
  },

  // ============================================
  // EXCEPTIONS FOR TEST FILES
  // ============================================
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      // Tests can import anything for mocking purposes
      'no-restricted-imports': 'off',
      'import-x/order': 'off',
    },
  },

  // ============================================
  // EXCEPTIONS FOR SCRIPTS
  // ============================================
  {
    files: ['scripts/**/*.ts', 'scripts/**/*.js', 'scripts/**/*.mts', 'prisma/**/*.ts'],
    rules: {
      // Scripts are operational tools that run outside the app architecture
      'no-restricted-imports': 'off',
    },
  },
];
