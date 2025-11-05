import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.donation.deleteMany();
  await prisma.child.deleteMany();

  // Create sample children
  const children = [
    {
      recipient: 'Emma',
      age: 7,
      gender: 'female',
      giftIdeas: 'Dolls, art supplies, storybooks',
    },
    {
      recipient: 'Oliver',
      age: 10,
      gender: 'male',
      giftIdeas: 'LEGO sets, board games, science kits',
    },
    {
      recipient: 'Sophia',
      age: 5,
      gender: 'female',
      giftIdeas: 'Teddy bears, coloring books, puzzles',
    },
    {
      recipient: 'Liam',
      age: 12,
      gender: 'male',
      giftIdeas: 'Sports equipment, video games, books',
    },
    {
      recipient: 'Ava',
      age: 8,
      gender: 'female',
      giftIdeas: 'Craft kits, musical instruments, jewelry',
    },
    {
      recipient: 'Noah',
      age: 6,
      gender: 'male',
      giftIdeas: 'Action figures, toy cars, building blocks',
    },
    {
      recipient: 'Isabella',
      age: 11,
      gender: 'female',
      giftIdeas: 'Books, art supplies, science kits',
    },
    {
      recipient: 'Ethan',
      age: 9,
      gender: 'male',
      giftIdeas: 'Sports gear, puzzles, educational toys',
    },
    {
      recipient: 'Mia',
      age: 4,
      gender: 'female',
      giftIdeas: 'Dolls, soft toys, picture books',
    },
    {
      recipient: 'Lucas',
      age: 13,
      gender: 'male',
      giftIdeas: 'Tech gadgets, books, hobby kits',
    },
  ];

  for (const child of children) {
    await prisma.child.create({
      data: child,
    });
  }

  console.log('Seeded 10 children');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
