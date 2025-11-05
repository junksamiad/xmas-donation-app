import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get all unassigned children
    const children = await prisma.child.findMany({
      where: {
        assigned: false
      }
    });

    if (children.length === 0) {
      return NextResponse.json(
        { error: 'No available children found' },
        { status: 404 }
      );
    }

    // Select a random child
    const randomIndex = Math.floor(Math.random() * children.length);
    const randomChild = children[randomIndex];

    return NextResponse.json({
      id: randomChild.id,
      recipient: randomChild.recipient,
      age: randomChild.age,
      gender: randomChild.gender,
      giftIdeas: randomChild.giftIdeas
    });
  } catch (error) {
    console.error('Error fetching random child:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
