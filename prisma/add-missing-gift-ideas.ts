import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎁 Adding missing gift ideas for ages 1-3...');

  const missingAges = [
    // Age 1
    {
      age: 1,
      gender: 'male',
      giftIdeas: ['Soft toys', 'Baby books', 'Building blocks', 'Musical toys'],
      category: null,
    },
    {
      age: 1,
      gender: 'female',
      giftIdeas: ['Soft dolls', 'Baby books', 'Building blocks', 'Musical toys'],
      category: null,
    },
    // Age 2
    {
      age: 2,
      gender: 'male',
      giftIdeas: ['Toy cars', 'Building blocks', 'Picture books', 'Activity toys'],
      category: null,
    },
    {
      age: 2,
      gender: 'female',
      giftIdeas: ['Soft dolls', 'Building blocks', 'Picture books', 'Activity toys'],
      category: null,
    },
    // Age 3
    {
      age: 3,
      gender: 'male',
      giftIdeas: ['Action figures', 'Toy cars', 'Building blocks', 'Puzzles'],
      category: null,
    },
    {
      age: 3,
      gender: 'female',
      giftIdeas: ['Dolls', 'Soft toys', 'Building blocks', 'Puzzles'],
      category: null,
    },
  ];

  for (const giftIdea of missingAges) {
    await prisma.giftIdea.create({
      data: giftIdea,
    });
    console.log(`  ✓ Added age ${giftIdea.age} (${giftIdea.gender})`);
  }

  const total = await prisma.giftIdea.count();
  console.log(`\n✅ Gift Ideas table now has ${total} records`);
  console.log('   Ages 1-16, 2 records per age (male + female)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
