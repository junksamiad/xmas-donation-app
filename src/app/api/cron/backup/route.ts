import { NextResponse } from 'next/server';

import * as fs from 'fs';
import * as path from 'path';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verify this is a Vercel Cron request
function verifyVercelCron(request: Request) {
  const authHeader = request.headers.get('authorization');

  // In production, verify the cron secret
  if (process.env.CRON_SECRET) {
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
  }

  // For testing, allow requests from Vercel cron
  return authHeader?.startsWith('Bearer ') || request.headers.get('user-agent')?.includes('vercel-cron');
}

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Verify this is a legitimate cron request
    if (!verifyVercelCron(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid cron secret' },
        { status: 401 }
      );
    }

    console.log('🔄 [CRON] Starting backup process...');

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`✓ [CRON] Created backup directory: ${backupDir}`);
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
      .filter((d) => d.donationType === 'cash' && d.amount)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    // Save to file
    fs.writeFileSync(filepath, JSON.stringify(donations, null, 2));

    // Cleanup old backups (keep last 30 days)
    const retentionDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const files = fs.readdirSync(backupDir);
    let deletedCount = 0;

    for (const file of files) {
      if (file.startsWith('donations-backup-') && file.endsWith('.json')) {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`✓ [CRON] Deleted old backup: ${file}`);
        }
      }
    }

    const duration = Date.now() - startTime;

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      backup: {
        filename,
        donations: donationCount,
        giftDonations: donations.filter((d) => d.donationType === 'gift').length,
        cashDonations: donations.filter((d) => d.donationType === 'cash').length,
        totalCashValue: `£${totalCash.toFixed(2)}`,
      },
      cleanup: {
        deleted: deletedCount,
        retentionDays,
      },
    };

    console.log('✅ [CRON] Backup completed:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ [CRON] Backup failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
