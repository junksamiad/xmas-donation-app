import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const ageStr = searchParams.get('age');

    if (!gender || !ageStr) {
      return NextResponse.json(
        { error: 'Missing required parameters: gender and age' },
        { status: 400 }
      );
    }

    const age = parseInt(ageStr, 10);

    if (isNaN(age)) {
      return NextResponse.json(
        { error: 'Invalid age parameter' },
        { status: 400 }
      );
    }

    // Get children matching criteria and not assigned
    const children = await prisma.child.findMany({
      where: {
        gender,
        age,
        assigned: false
      }
    });

    if (children.length === 0) {
      return NextResponse.json(
        { error: 'No matching children found' },
        { status: 404 }
      );
    }

    // Select a random child from matches
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
    console.error('Error searching for child:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
