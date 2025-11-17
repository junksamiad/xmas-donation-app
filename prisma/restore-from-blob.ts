import { PrismaClient, Prisma } from '@prisma/client';

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

interface Backup {
  filename: string;
  url: string;
  uploadedAt: string;
  size: number;
}

async function main() {
  console.log('📥 Restoring donations from Vercel Blob backup...');
  console.log('');

  const apiUrl = process.env.NEXT_PUBLIC_URL || 'https://xmas-donation-app.vercel.app';

  // Fetch list of available backups
  const response = await fetch(`${apiUrl}/api/backups`);

  if (!response.ok) {
    console.error('❌ Failed to fetch backups from Blob');
    process.exit(1);
  }

  const { backups }: { backups: Backup[] } = await response.json();

  if (backups.length === 0) {
    console.error('');
    console.error('❌ No backup files found in Blob storage!');
    console.error('');
    console.error('Create a backup first - the cron will run automatically');
    process.exit(1);
  }

  // Check if specific backup file provided as argument
  const specificBackup = process.argv[2];
  let selectedBackup: Backup;

  if (specificBackup) {
    // Use specified backup
    const backup = backups.find((b) => b.filename === specificBackup);
    if (!backup) {
      console.error('');
      console.error(`❌ Backup file not found: ${specificBackup}`);
      console.error('');
      console.error('Available backups:');
      backups.forEach((b, i) => {
        const date = new Date(b.uploadedAt).toLocaleString();
        console.error(`   ${i + 1}. ${b.filename} (${date})`);
      });
      process.exit(1);
    }
    selectedBackup = backup;
  } else {
    // List available backups and use most recent
    console.log('📂 Available backups from Vercel Blob:');

    // Need to fetch each backup to get donation count
    for (let i = 0; i < Math.min(backups.length, 10); i++) {
      const backup = backups[i];
      const date = new Date(backup.uploadedAt).toLocaleString();

      // Fetch the backup to count donations
      const backupResponse = await fetch(backup.url);
      const donations = await backupResponse.json();

      const marker = i === 0 ? ' ← WILL USE THIS' : '';
      console.log(
        `   ${i + 1}. ${backup.filename} (${donations.length} donations, ${date})${marker}`
      );
    }

    console.log('');
    console.log('💡 To use a different backup: npm run db:restore-blob <filename>');
    console.log('');

    selectedBackup = backups[0];
  }

  console.log(`📂 Using backup: ${selectedBackup.filename}`);
  console.log('');

  // Download the selected backup
  const backupResponse = await fetch(selectedBackup.url);
  const backupData: BackupDonation[] = await backupResponse.json();

  console.log(`⚠️  This will restore ${backupData.length} donation(s)`);
  console.log(`⚠️  Existing donations will be DELETED first`);
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
        console.warn(
          `⚠️  Skipping donation ${donation.id}: Child ${donation.childName} no longer exists`
        );
        skipped++;
        continue;
      }

      if (!deptExists) {
        console.warn(
          `⚠️  Skipping donation ${donation.id}: Department ${donation.departmentName} no longer exists`
        );
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
          amount: donation.amount
            ? new Prisma.Decimal(donation.amount.toString())
            : null,
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
}

main()
  .catch((e) => {
    console.error('❌ Error restoring donations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
