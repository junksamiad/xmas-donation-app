import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { childId, donorName, department, donationType, amount } = body;

    // Validate required fields
    if (!childId || !donorName || !department || !donationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate donation type
    if (donationType !== 'gift' && donationType !== 'cash') {
      return NextResponse.json(
        { error: 'Invalid donation type' },
        { status: 400 }
      );
    }

    // If cash donation, validate amount
    if (donationType === 'cash' && !amount) {
      return NextResponse.json(
        { error: 'Amount required for cash donations' },
        { status: 400 }
      );
    }

    // Check if child exists and is not already assigned
    const child = await prisma.child.findUnique({
      where: { id: childId }
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    if (child.assigned) {
      return NextResponse.json(
        { error: 'Child has already been assigned' },
        { status: 409 }
      );
    }

    // Create donation and mark child as assigned in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the donation
      const donation = await tx.donation.create({
        data: {
          childId,
          donorName,
          department,
          donationType,
          amount: amount ? new Decimal(amount) : null
        }
      });

      // Mark child as assigned
      await tx.child.update({
        where: { id: childId },
        data: { assigned: true }
      });

      return donation;
    });

    return NextResponse.json({
      success: true,
      donation: result
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
