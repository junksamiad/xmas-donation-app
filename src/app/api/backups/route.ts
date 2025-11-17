import { NextResponse } from 'next/server';

import { list } from '@vercel/blob';

// List all available backups
export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'donations-backup-',
    });

    // Sort by upload date (newest first)
    const sortedBlobs = blobs.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    // Format the response
    const backups = sortedBlobs.map((blob) => ({
      filename: blob.pathname,
      url: blob.url,
      uploadedAt: blob.uploadedAt,
      size: blob.size,
    }));

    return NextResponse.json({
      success: true,
      count: backups.length,
      backups,
    });
  } catch (error) {
    console.error('❌ Error listing backups:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
