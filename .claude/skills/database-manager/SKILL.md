---
name: database-manager
description: Prisma database management for Christmas Donation App. Handles granular seeding, automated cloud backups via Vercel Blob, and disaster recovery. Use for database operations, backup management, or recovering lost data. ALWAYS ask before destructive operations.
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Database Manager Skill

Expert database management for the Christmas Donation App using Prisma, PostgreSQL (Neon), and Vercel Blob Storage.

## Core Principle: GRANULAR CONTROL

**NEVER run full database wipes without explicit user permission.**
Each table can be seeded independently for maximum control and safety.

## 🚨 DISASTER RECOVERY - START HERE IF DATA IS LOST

If donations have been accidentally deleted, **don't panic**:

### Quick Recovery Steps

```bash
# 1. List all available backups from production (Vercel Blob)
npm run db:restore-blob

# 2. Identify the backup BEFORE the disaster
#    Look for backups with donation counts > 0
#    Ignore recent backups if they show 0 donations

# 3. Restore from specific backup
npm run db:restore-blob donations-backup-YYYY-MM-DDTHH-MM-SS-XXXZ.json

# 4. Verify recovery
npx prisma studio
```

**The system creates automatic backups every 5 minutes in production.**

---

## Backup System Architecture

### Production Backups (Vercel Blob Storage)

**Automated backups run every 5 minutes** via Vercel Cron:
- Stored in **Vercel Blob** (persistent cloud storage)
- Retained for **30 days** (auto-cleanup)
- Accessible from anywhere
- Survives deployments and server restarts

**Key endpoints:**
- `/api/cron/backup` - Creates backups (runs automatically)
- `/api/backups` - Lists all available backups

### Local Backups (Development)

For local testing only:
```bash
npm run db:backup-donations  # Creates local JSON backup
npm run db:restore           # Restores from local backup
```

**⚠️ Local backups are NOT used in production!**

---

## Available Operations

### 1. Backup & Recovery (PRODUCTION)

#### List All Production Backups

```bash
# Show all backups from Vercel Blob
npm run db:restore-blob
```

This will display:
```
📂 Available backups from Vercel Blob:
   1. donations-backup-2025-11-17T10-50-34-416Z.json (13 donations, 11/17/2025, 10:50:34 AM) ← WILL USE THIS
   2. donations-backup-2025-11-17T10-55-33-826Z.json (0 donations, 11/17/2025, 10:55:33 AM)
   3. donations-backup-2025-11-17T10-45-34-643Z.json (13 donations, 11/17/2025, 10:45:34 AM)
```

#### Restore from Production Backup

```bash
# Restore from most recent backup (automatic)
npm run db:restore-blob

# Restore from specific backup (recommended for disaster recovery)
npm run db:restore-blob donations-backup-2025-11-17T10-50-34-416Z.json
```

**Critical**: When recovering from a disaster, **choose a backup BEFORE the deletion**:
- ✅ Pick backup with donation count > 0
- ❌ Avoid recent backups showing 0 donations (these captured the disaster state)

#### Manual Backup via API

You can trigger a backup manually:
```bash
curl https://xmas-donation-app.vercel.app/api/cron/backup
```

### 2. Granular Seeding (Reference Data)

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

### 3. Full Reset (DANGEROUS - Rare Use)

Only for fresh deployments or complete resets:

```bash
npm run db:seed-full
```

**WARNING**: Deletes ALL data (donations, children, departments, gift ideas).
Always confirm with user first.

---

## Database Schema

### Critical Tables

**Donations** (LIVE USER DATA - Auto-backed up every 5 minutes)
- User donation records
- Links donors to children
- Cash amounts and donation types
- **🔥 Most important data - automatically backed up to Vercel Blob**

**Children** (160 records)
- 10 per age group (1-16 years)
- 5 boys + 5 girls per age
- Multicultural UK-representative names

**Departments** (11 records)
- Company departments
- Required for donation form

**GiftIdea** (32 templates)
- Age/gender gift suggestions
- Reference data

**User** (1+ accounts)
- Admin accounts
- Password-protected (bcrypt)

---

## Common Workflows

### Workflow: Disaster Recovery (Donations Deleted)

**Scenario**: Donations were accidentally deleted or corrupted.

```bash
# Step 1: Don't panic! Check available backups
npm run db:restore-blob

# Step 2: Identify the last good backup
# Look for backup BEFORE deletion with donation count > 0

# Step 3: Restore from that specific backup
npm run db:restore-blob donations-backup-2025-11-17T10-50-34-416Z.json

# Step 4: Verify recovery
npx prisma studio
# Check donation count matches expected

# Step 5: Confirm with user
# "Restored X donations from backup at [TIME]"
```

**How it works**:
- Fetches backup from Vercel Blob Storage
- Clears current (corrupted) donations
- Restores donations from backup
- Validates foreign keys (children/departments must exist)
- Skips any donations that can't be restored

### Workflow: Fresh Deployment

For a new production instance:

```bash
# Step 1: Seed reference data
npm run db:seed-departments
npm run db:seed-gift-ideas

# Step 2: Seed children
npm run db:seed-children

# Step 3: Create admin user
npm run db:seed-user

# Step 4: Verify
npx prisma studio

# Backups will start automatically via cron (every 5 minutes)
```

### Workflow: Update Departments

When departments change:

```bash
# Safe: Backups happen automatically, but you can trigger manually if needed
curl https://xmas-donation-app.vercel.app/api/cron/backup

# Update departments
npm run db:seed-departments

# Verify
npx prisma studio
```

**Safe**: Automatic backups protect donation data. Departments can be updated independently.

---

## Backup System Details

### Vercel Blob Storage

**Location**: Production backups stored at:
```
https://genh6omwxjmnywrr.public.blob.vercel-storage.com/
```

**Filename format**:
```
donations-backup-YYYY-MM-DDTHH-MM-SS-XXXZ.json
Example: donations-backup-2025-11-17T10-50-34-416Z.json
```

**Access**:
- Public read URLs (anyone with URL can download)
- Managed via `/api/backups` endpoint
- Restore via `npm run db:restore-blob`

**Retention**:
- Automatic cleanup after 30 days
- Keeps last ~8,640 backups (5-min intervals × 30 days)

### Cron Schedule

**Production**: Every 5 minutes (`*/5 * * * *`)
- Configured in `vercel.json`
- Runs on Vercel's infrastructure (always active)
- No local machine required

**Timing examples**:
- 10:00, 10:05, 10:10, 10:15, 10:20, etc.

### Backup Contents

Each backup includes:
```json
[
  {
    "id": "donation-id",
    "childId": "child-id",
    "childName": "Child Name",
    "donorName": "Donor Name",
    "donorEmail": "donor@example.com",
    "departmentId": "dept-id",
    "departmentName": "Department",
    "donationType": "cash|gift",
    "amount": "25.00",
    "createdAt": "2025-11-17T10:30:00.000Z",
    "child": { /* full child record */ },
    "department": { /* full department record */ }
  }
]
```

---

## Script Locations

### Production Scripts (Vercel Blob)
- `src/app/api/cron/backup/route.ts` - Auto-backup endpoint (cron)
- `src/app/api/backups/route.ts` - List backups endpoint
- `prisma/restore-from-blob.ts` - Restore from Vercel Blob

### Local Scripts (Development)
- `prisma/seed-departments.ts` - 11 departments
- `prisma/seed-children.ts` - 160 children
- `prisma/seed-gift-ideas.ts` - 32 gift ideas
- `prisma/seed-user.ts` - Admin user
- `prisma/seed.ts` - Full reset (dangerous)
- `prisma/backup-donations.ts` - Local backup to JSON
- `prisma/restore-donations.ts` - Restore from local JSON

---

## Safety Checks

Before ANY destructive operation:

1. **Check automatic backups**: Verify recent backups exist
   ```bash
   npm run db:restore-blob
   ```

2. **Confirm with user**: "This will delete X records. Backups exist from [times]. Proceed?"

3. **Run operation**: Execute the specific command

4. **Verify**: Check Prisma Studio or production site

5. **If disaster occurs**: Restore from most recent good backup

---

## Common Issues & Solutions

### "Donations were deleted!"

**Solution**:
```bash
# 1. List backups
npm run db:restore-blob

# 2. Find last backup BEFORE deletion
# Look for backup with donation count > 0

# 3. Restore
npm run db:restore-blob donations-backup-YYYY-MM-DDTHH-MM-SS-XXXZ.json
```

**Prevention**: Automatic backups run every 5 minutes. Max data loss = 5 minutes.

### "No backups found in Blob storage!"

**Causes**:
1. Vercel Blob not set up (check Vercel dashboard → Stores)
2. Cron not running (check `/api/cron/backup` endpoint)
3. BLOB_READ_WRITE_TOKEN env var missing

**Fix**:
1. Go to Vercel → Storage → Create Blob Store
2. Redeploy to pick up environment variables
3. Trigger manual backup: `curl https://xmas-donation-app.vercel.app/api/cron/backup`

### "Restore skipped some donations"

**Cause**: Foreign key constraints (child or department deleted)

**Info**: Restore script shows warnings:
```
⚠️  Skipping donation ABC: Child "Name" no longer exists
```

**Fix**:
- Reseed children: `npm run db:seed-children`
- Reseed departments: `npm run db:seed-departments`
- Run restore again

### "Children table empty!"

**Fix**: `npm run db:seed-children`

**Why**: Main seed only creates 10 sample children, need full 160

---

## Environment Variables

### Required in `.env` (Development)
```bash
DATABASE_URL="postgresql://..."      # Pooled connection
DIRECT_URL="postgresql://..."        # Direct connection (migrations)
```

### Required in Vercel (Production)
- `DATABASE_URL` - Auto-configured by Neon integration
- `DIRECT_URL` - Auto-configured by Neon integration
- `BLOB_READ_WRITE_TOKEN` - Auto-configured when Blob store created
- `CRON_SECRET` - Optional, for extra cron security

---

## Migration Best Practices

When making schema changes:

```bash
# 1. Backups run automatically, but verify
npm run db:restore-blob

# 2. Create migration
npx prisma migrate dev --name descriptive-name

# 3. Test locally
npx prisma studio

# 4. Deploy to production
git push  # Vercel auto-deploys

# 5. Re-seed if needed (granularly!)
npm run db:seed-departments
```

---

## Monitoring & Health Checks

### Check Backup System Health

```bash
# List recent backups (should have backups every 5 minutes)
npm run db:restore-blob

# Verify cron is running (check Vercel logs)
vercel logs --scope junksamiad

# Manual health check
curl https://xmas-donation-app.vercel.app/api/backups
```

**Expected**: New backup every 5 minutes during active hours.

### Verify Recovery Capability

Periodically test disaster recovery:
```bash
# 1. Note current donation count
# 2. Delete test donation
# 3. Restore from backup
npm run db:restore-blob
# 4. Verify donation restored
```

---

## When to Use This Skill

- 🚨 **Disaster recovery** (donations deleted/corrupted)
- 📦 **List production backups** (check backup health)
- 🔧 **Restore from specific backup** (time-travel recovery)
- 🌱 **Seed reference data** (departments, children, gift ideas)
- 🆕 **Fresh deployment** (new database instance)
- 🔄 **Database migrations** (schema changes)

## When NOT to Use

- Regular app development (use migrations instead)
- Production hotfixes (too risky without backup verification)
- Without checking backups exist first

---

## Quick Reference Commands

```bash
# DISASTER RECOVERY
npm run db:restore-blob                    # List & restore latest
npm run db:restore-blob <filename>         # Restore specific backup

# SEEDING
npm run db:seed-departments                # 11 departments
npm run db:seed-children                   # 160 children
npm run db:seed-gift-ideas                 # 32 gift templates
npm run db:seed-user                       # Admin user
npm run db:seed-full                       # Full reset (DANGEROUS)

# VERIFICATION
npx prisma studio                          # Browse database
curl https://xmas-donation-app.vercel.app/api/backups  # Check backups
```

---

**Remember**:
- ⏰ **Automatic backups every 5 minutes** (production)
- 🔒 **30-day retention** in Vercel Blob
- 🎯 **Granular > Full** for safety
- 💾 **Always verify backups exist** before destructive ops
- 🚨 **Max data loss: 5 minutes** (time between backups)
