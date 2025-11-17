import { PrismaClient, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BackupDonation {
  id: string;
  childId: string;
  childName: string;
  donorName: string;
  donorEmail: string | null;
  departmentId: string;
  departmentName: string;
  donationType: string;
  amount: Prisma.Decimal | null;
  createdAt: string | Date;
  child?: any;
  department?: any;
}

async function main() {
  console.log('📥 Restoring donations from backup...');

  // Find most recent backup file
  const backupDir = path.join(process.cwd(), 'backups');

  if (!fs.existsSync(backupDir)) {
    console.error('');
    console.error('❌ No backup directory found!');
    console.error(`   Expected: ${backupDir}`);
    console.error('');
    console.error('Create a backup first: npm run db:backup-donations');
    process.exit(1);
  }

  const backupFiles = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('donations-backup-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (backupFiles.length === 0) {
    console.error('');
    console.error('❌ No backup files found!');
    console.error(`   Directory: ${backupDir}`);
    console.error('');
    console.error('Create a backup first: npm run db:backup-donations');
    process.exit(1);
  }

  // Use most recent backup
  const backupFile = backupFiles[0];
  const filepath = path.join(backupDir, backupFile);

  console.log(`📂 Using backup: ${backupFile}`);
  console.log('');

  // Read backup file
  const backupData: BackupDonation[] = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

  console.log(`⚠️  This will restore ${backupData.length} donation(s)`);
  console.log('⚠️  Existing donations will be DELETED first');
  console.log('');

  // Clear existing donations
  await prisma.donation.deleteMany();
  console.log('✓ Cleared existing donations');

  // Restore donations
  let restored = 0;
  let skipped = 0;

  for (const donation of backupData) {
    try {
      // Check if child still exists
      const childExists = await prisma.child.findUnique({
        where: { id: donation.childId },
      });

      // Check if department still exists
      const deptExists = await prisma.department.findUnique({
        where: { id: donation.departmentId },
      });

      if (!childExists) {
        console.warn(`⚠️  Skipping donation ${donation.id}: Child ${donation.childName} no longer exists`);
        skipped++;
        continue;
      }

      if (!deptExists) {
        console.warn(`⚠️  Skipping donation ${donation.id}: Department ${donation.departmentName} no longer exists`);
        skipped++;
        continue;
      }

      // Restore the donation
      await prisma.donation.create({
        data: {
          id: donation.id,
          childId: donation.childId,
          childName: donation.childName,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          departmentId: donation.departmentId,
          departmentName: donation.departmentName,
          donationType: donation.donationType,
          amount: donation.amount ? new Prisma.Decimal(donation.amount.toString()) : null,
          createdAt: new Date(donation.createdAt),
        },
      });

      restored++;
    } catch (error) {
      console.error(`❌ Error restoring donation ${donation.id}:`, error);
      skipped++;
    }
  }

  console.log('');
  console.log('✅ Restore completed!');
  console.log('');
  console.log('📊 Restore summary:');
  console.log(`   Restored: ${restored} donation(s)`);
  console.log(`   Skipped: ${skipped} donation(s)`);
  console.log(`   Total in backup: ${backupData.length}`);
  console.log('');
  console.log('📝 Verify in Prisma Studio: npx prisma studio');
}

main()
  .catch((e) => {
    console.error('❌ Error restoring donations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
