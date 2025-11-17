# Database Seeding Guide

Comprehensive guide for seeding the Christmas Donation App database.

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Individual Seeds](#individual-seeds)
3. [Fresh Deployment](#fresh-deployment)
4. [Updating Data](#updating-data)
5. [Safety Guidelines](#safety-guidelines)
6. [Troubleshooting](#troubleshooting)

---

## Quick Reference

```bash
# Individual table seeds (SAFE - granular control)
npm run db:seed-departments   # 11 departments
npm run db:seed-children       # 160 children
npm run db:seed-gift-ideas     # 32 gift ideas
npm run db:seed-user           # 1 admin user

# Backup & Restore
npm run db:backup-donations    # Backup to JSON
npm run db:restore             # Restore from backup

# Full reset (DANGEROUS - use sparingly)
npm run db:seed-full           # Deletes EVERYTHING
```

---

## Individual Seeds

### Departments (11 records)

**What it does:**
- Deletes ALL existing departments
- Creates 11 company departments
- Preserves: donations, children, gift ideas, users

**When to use:**
- Fresh deployment
- Department list updates
- After schema changes

**Command:**
```bash
npm run db:seed-departments
```

**Output:**
```
🏢 Seeding departments...
⚠️  This will DELETE all existing departments
✅ Safe: Preserves donations, children, gift ideas, users
✓ Cleared existing departments
✅ Created 11 departments

📊 Departments:
   - Commercial
   - Customer Success
   - Finance, Legal & Transformation
   ... (11 total)
```

**⚠️ Warning:** If donations exist that reference departments, you may get foreign key errors.

---

### Children (160 records)

**What it does:**
- **Safety check:** Blocks if donations exist
- Deletes ALL existing children
- Creates 160 children (10 per age 1-16: 5 boys + 5 girls)
- UK-representative multicultural names
- Age-appropriate gift ideas

**When to use:**
- Fresh deployment
- After accidentally running main seed (which only creates 10 children)
- Reset child pool

**Command:**
```bash
npm run db:seed-children
```

**Output (success):**
```
🎄 Seeding children database with UK demographic data...
✓ Cleared existing children (no donations affected)
✅ Created 160 children

📊 Demographics breakdown:
   Ages: 1-16 (10 children per age group)
   Gender: 50% male, 50% female
   Priority cases: ~16
```

**Output (blocked):**
```
❌ SAFETY BLOCK: Cannot seed children!
   5 donation(s) exist in database

Options:
   1. Backup donations first: npm run db:backup-donations
   2. Delete donations: await prisma.donation.deleteMany()
   3. Deploy to fresh database instead
```

**⚠️ Important:** This script REFUSES to run if donations exist. Backup first!

---

### Gift Ideas (32 records)

**What it does:**
- Deletes ALL existing gift ideas
- Creates 32 gift idea templates (2 per age 1-16: male + female)
- Preserves: donations, children, departments, users

**When to use:**
- Fresh deployment
- After schema changes
- Updating gift templates

**Command:**
```bash
npm run db:seed-gift-ideas
```

**Output:**
```
🎁 Seeding gift ideas...
⚠️  This will DELETE all existing gift ideas
✅ Safe: Preserves donations, children, departments, users
✓ Cleared existing gift ideas
✅ Created 32 gift idea templates

📊 Gift Ideas breakdown:
   Ages: 1-16 (2 per age: 1 male + 1 female)
   Total: 32 templates
```

---

### Admin User (1 record)

**What it does:**
- Deletes ALL existing users
- Creates 1 admin user
- Password: `admin123` (bcrypt hashed)
- Preserves: donations, children, departments, gift ideas

**When to use:**
- Fresh deployment
- Reset admin password
- Create initial admin account

**Command:**
```bash
npm run db:seed-user
```

**Output:**
```
👤 Seeding admin user...
⚠️  This will DELETE all existing users
✅ Safe: Preserves donations, children, departments, gift ideas
✓ Cleared existing users
✅ Created admin user

📊 Admin credentials:
   Username: admin
   Password: admin123 (change after first login!)

⚠️  IMPORTANT: Change the default password in production!
```

**🔒 Security:** ALWAYS change the default password in production!

---

## Fresh Deployment

For deploying to a new database instance:

```bash
# Step 1: Verify database connection
npx prisma migrate deploy

# Step 2: Seed reference data (in any order)
npm run db:seed-departments
npm run db:seed-gift-ideas

# Step 3: Seed children (requires no donations)
npm run db:seed-children

# Step 4: Create admin user
npm run db:seed-user

# Step 5: Verify everything
npx prisma studio
```

**Total records:**
- 11 departments
- 160 children
- 32 gift ideas
- 1 user
- 0 donations

---

## Updating Data

### Update Departments

```bash
# 1. Backup (if donations exist)
npm run db:backup-donations

# 2. Update departments
npm run db:seed-departments

# 3. Verify
npx prisma studio
```

### Reset Children Pool

```bash
# If no donations exist
npm run db:seed-children

# If donations exist:
# 1. Backup first
npm run db:backup-donations

# 2. Manually delete donations (in Prisma Studio or via script)

# 3. Re-seed children
npm run db:seed-children

# 4. Restore donations
npm run db:restore
```

---

## Safety Guidelines

### Before ANY Destructive Operation

1. **Check for donations:**
   ```sql
   SELECT COUNT(*) FROM Donation;
   ```

2. **Backup if needed:**
   ```bash
   npm run db:backup-donations
   ```

3. **Confirm with user:**
   ```
   This will delete X records. Proceed? (y/n)
   ```

4. **Run operation**

5. **Verify result:**
   ```bash
   npx prisma studio
   ```

### Backup Strategy

**Always backup before:**
- Seeding children (if donations exist)
- Running full seed
- Schema migrations
- Production deployments

**Backup location:**
```
backups/
└── donations-backup-2025-11-17T12-30-00-000Z.json
```

---

## Troubleshooting

### "Foreign key constraint failed"

**Symptom:** Error when trying to delete departments/children

**Cause:** Donations reference these records

**Solution:**
```bash
# 1. Backup donations
npm run db:backup-donations

# 2. Delete donations
# (manually in Prisma Studio)

# 3. Run seed
npm run db:seed-departments

# 4. Restore donations
npm run db:restore
```

---

### "Children seed blocked"

**Symptom:** Seed-children.ts refuses to run

**Cause:** Donations exist (safety check)

**Solution:**
```bash
# Option A: Backup and restore
npm run db:backup-donations
# Manually delete donations in Prisma Studio
npm run db:seed-children
npm run db:restore

# Option B: Fresh database
# Deploy to new database instance
npm run db:seed-children
```

---

### "Only 10 children in database"

**Symptom:** App search doesn't work well, few children available

**Cause:** Ran `npm run db:seed` instead of `db:seed-children`

**Solution:**
```bash
npm run db:seed-children
```

---

### "Backup file not found"

**Symptom:** Restore fails, can't find backup

**Cause:** No backup exists

**Solution:**
```bash
# Create backup first
npm run db:backup-donations

# Then restore
npm run db:restore
```

---

## Advanced: Custom Seeds

### Seed with Custom Data

Create custom seed script:

```typescript
// prisma/seed-custom.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Your custom seed logic here
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run it:
```bash
tsx prisma/seed-custom.ts
```

---

## Related Documentation

- [SKILL.md](../SKILL.md) - Database Manager Skill overview
- [backup-guide.md](backup-guide.md) - Backup and restore procedures
- [prisma/schema.prisma](../../../prisma/schema.prisma) - Database schema

---

**Remember:** Granular seeds give you control. Always backup before risky operations!
