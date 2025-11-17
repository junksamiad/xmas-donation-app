import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('💾 Backing up donations...');

  // Create backups directory if it doesn't exist
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`✓ Created backup directory: ${backupDir}`);
  }

  // Fetch all donations with related data
  const donations = await prisma.donation.findMany({
    include: {
      child: true,
      department: true,
    },
  });

  // Generate timestamped filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `donations-backup-${timestamp}.json`;
  const filepath = path.join(backupDir, filename);

  // Get counts
  const donationCount = donations.length;
  const totalCash = donations
    .filter(d => d.donationType === 'cash' && d.amount)
    .reduce((sum, d) => sum + Number(d.amount), 0);

  // Save to file
  fs.writeFileSync(filepath, JSON.stringify(donations, null, 2));

  console.log('');
  console.log('✅ Backup completed successfully!');
  console.log('');
  console.log('📊 Backup summary:');
  console.log(`   Total donations: ${donationCount}`);
  console.log(`   Gift donations: ${donations.filter(d => d.donationType === 'gift').length}`);
  console.log(`   Cash donations: ${donations.filter(d => d.donationType === 'cash').length}`);
  console.log(`   Total cash value: £${totalCash.toFixed(2)}`);
  console.log('');
  console.log('💾 Backup file:');
  console.log(`   ${filepath}`);
  console.log('');
  console.log('📝 To restore: npm run db:restore');
}

main()
  .catch((e) => {
    console.error('❌ Error backing up donations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
