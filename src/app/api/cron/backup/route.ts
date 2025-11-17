import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';
import { put, list, del } from '@vercel/blob';

const prisma = new PrismaClient();

// Verify this is a Vercel Cron request
function verifyVercelCron(request: Request) {
  const authHeader = request.headers.get('authorization');

  // In production, verify the cron secret
  if (process.env.CRON_SECRET) {
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
  }

  // For testing, allow requests from Vercel cron
  return (
    authHeader?.startsWith('Bearer ') ||
    request.headers.get('user-agent')?.includes('vercel-cron')
  );
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

    // Get counts
    const donationCount = donations.length;
    const totalCash = donations
      .filter((d) => d.donationType === 'cash' && d.amount)
      .reduce((sum, d) => sum + Number(d.amount), 0);

    // Upload to Vercel Blob
    const backupData = JSON.stringify(donations, null, 2);
    const blob = await put(filename, backupData, {
      access: 'public',
      contentType: 'application/json',
    });

    console.log(`✓ [CRON] Uploaded backup to Blob: ${blob.url}`);

    // Cleanup old backups (keep last 30 days)
    const retentionDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // List all backups
    const { blobs } = await list({
      prefix: 'donations-backup-',
    });

    let deletedCount = 0;

    for (const existingBlob of blobs) {
      // Check if blob is older than retention period
      if (existingBlob.uploadedAt < cutoffDate) {
        await del(existingBlob.url);
        deletedCount++;
        console.log(`✓ [CRON] Deleted old backup: ${existingBlob.pathname}`);
      }
    }

    const duration = Date.now() - startTime;

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      backup: {
        filename,
        url: blob.url,
        donations: donationCount,
        giftDonations: donations.filter((d) => d.donationType === 'gift')
          .length,
        cashDonations: donations.filter((d) => d.donationType === 'cash')
          .length,
        totalCashValue: `£${totalCash.toFixed(2)}`,
      },
      cleanup: {
        deleted: deletedCount,
        retentionDays,
        totalBackups: blobs.length - deletedCount,
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
