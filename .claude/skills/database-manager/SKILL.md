---
name: database-manager
description: Prisma database management for Christmas Donation App. Handles granular seeding (departments, children, gift ideas, users), backups, and migrations. Use when managing database seeds, backing up donations, or deploying fresh instances. ALWAYS ask before destructive operations.
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Database Manager Skill

Expert database management for the Christmas Donation App using Prisma and PostgreSQL (Neon).

## Core Principle: GRANULAR CONTROL

**NEVER run full database wipes without explicit user permission.**
Each table can be seeded independently for maximum control and safety.

## Available Operations

### 1. Granular Seeding (Recommended)

Seed individual tables without affecting others:

```bash
# Departments only (11 company departments)
npm run db:seed-departments

# Children only (160 children: 10 per age 1-16)
npm run db:seed-children

# Gift Ideas only (32 age/gender templates)
npm run db:seed-gift-ideas

# Admin User only (1 admin account)
npm run db:seed-user
```

**Safety**: Each script only deletes/recreates its own table data.

### 2. Backup Operations

Priority: **Donations table** (contains live user data)

```bash
# Backup donations to JSON
npm run db:backup-donations

# Backup full database
npm run db:backup-full

# Restore from backup
npm run db:restore
```

### 3. Full Reset (DANGEROUS - Rare Use)

Only for fresh deployments or complete resets:

```bash
npm run db:seed-full
```

**WARNING**: Deletes ALL data (donations, children, departments, gift ideas).
Always confirm with user first.

## Database Schema

### Critical Tables

**Donations** (MUST be backed up before any operations)
- Live user donation data
- Links donors to children
- Cash amounts and types

**Children** (160 records)
- 10 per age group (1-16 years)
- 5 boys + 5 girls per age
- Multicultural UK-representative names

**Departments** (11 records)
- Company departments
- Required for donation form

**GiftIdea** (32 records)
- Age/gender gift templates
- Reference data

**User** (1+ records)
- Admin accounts
- Protected by bcrypt

## Workflow: Fresh Deployment

For a new production instance:

```bash
# Step 1: Seed reference data
npm run db:seed-departments
npm run db:seed-gift-ideas

# Step 2: Seed children
npm run db:seed-children

# Step 3: Create admin user
npm run db:seed-user

# Step 4: Verify in Prisma Studio
npx prisma studio
```

## Workflow: Update Departments

When departments change:

```bash
# 1. Backup first (if any donations exist)
npm run db:backup-donations

# 2. Update departments only
npm run db:seed-departments

# 3. Verify
npx prisma studio
```

**Safe**: Preserves donations, children, and other data.

## Workflow: Backup Before Changes

Always backup donations before risky operations:

```bash
# 1. Backup donations
npm run db:backup-donations

# 2. Perform operation
npm run db:seed-children  # or whatever you need

# 3. Verify nothing broke
npx prisma studio

# 4. If needed, restore
npm run db:restore
```

## Script Locations

All scripts are in: `prisma/` and `.claude/skills/database-manager/scripts/`

- `seed-departments.ts` - 11 departments only
- `seed-children.ts` - 160 children only (already exists)
- `seed-gift-ideas.ts` - 32 gift ideas only
- `seed-user.ts` - Admin user only
- `seed.ts` - Full reset (use sparingly)
- `backup-donations.ts` - Backup to JSON
- `restore-donations.ts` - Restore from JSON

## Safety Checks

Before ANY destructive operation:

1. **Check for existing donations**: `SELECT COUNT(*) FROM Donation;`
2. **Backup if needed**: `npm run db:backup-donations`
3. **Confirm with user**: "This will delete X records. Proceed?"
4. **Run operation**: Execute the specific seed
5. **Verify**: Check Prisma Studio

## Common Issues

### "Donations were deleted!"
- **Prevention**: Always backup first
- **Recovery**: `npm run db:restore` (if backup exists)
- **Root cause**: Used `db:seed-full` or `seed.ts` instead of granular seeds

### "Children table empty!"
- **Fix**: `npm run db:seed-children`
- **Why**: Main seed only creates 10 sample children, need full 160

### "Foreign key constraint error"
- **Cause**: Trying to delete departments/children with existing donations
- **Fix**: Backup and clear donations first, or modify seed to handle gracefully

## Migration Best Practices

When making schema changes:

```bash
# 1. Create migration
npx prisma migrate dev --name descriptive-name

# 2. Test locally first
npx prisma studio

# 3. Deploy to production
npx prisma migrate deploy

# 4. Re-seed if needed (granularly!)
npm run db:seed-departments
```

## Documentation

For detailed guides, see:
- [seeding-guide.md](docs/seeding-guide.md) - Comprehensive seeding documentation
- [backup-guide.md](docs/backup-guide.md) - Backup and restore procedures

## Environment Variables

Required in `.env`:
```
DATABASE_URL="postgresql://..."      # Pooled connection
DIRECT_URL="postgresql://..."        # Direct connection (migrations)
```

## When to Use This Skill

- Deploying fresh database instances
- Updating department lists
- Backing up donations before changes
- Seeding children (160 records)
- Creating admin users
- Database migrations
- Recovery operations

## When NOT to Use

- Regular app development (use migrations instead)
- Production hotfixes (too risky)
- Without backups (if donations exist)

---

**Remember**: Granular > Full. Safety > Speed. Backup > Risk.
