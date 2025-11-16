import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  await prisma.donation.deleteMany();
  await prisma.child.deleteMany();
  await prisma.giftIdea.deleteMany();
  await prisma.department.deleteMany();

  // Create departments
  const departmentNames = [
    'Commercial',
    'Customer Success',
    'Finance, Legal & Transformation',
    'Makutu',
    'Sci-Net',
    'Managed Services',
    'People',
    'Sales',
    'Technology',
    'Academy',
    'Professional Services',
  ];

  const departments = [];
  for (const name of departmentNames) {
    const dept = await prisma.department.create({
      data: { name },
    });
    departments.push(dept);
  }
  console.log(`✅ Seeded ${departments.length} departments`);

  // Create gift idea templates for various ages/genders
  // Exactly 2 records per age (1 male + 1 female) for ages 1-16
  const giftIdeas = [
    // Ages 1-3
    { age: 1, gender: 'male', giftIdeas: ['Soft toys', 'Baby books', 'Building blocks', 'Musical toys'], category: null },
    { age: 1, gender: 'female', giftIdeas: ['Soft dolls', 'Baby books', 'Building blocks', 'Musical toys'], category: null },
    { age: 2, gender: 'male', giftIdeas: ['Toy cars', 'Building blocks', 'Picture books', 'Activity toys'], category: null },
    { age: 2, gender: 'female', giftIdeas: ['Soft dolls', 'Building blocks', 'Picture books', 'Activity toys'], category: null },
    { age: 3, gender: 'male', giftIdeas: ['Action figures', 'Toy cars', 'Building blocks', 'Puzzles'], category: null },
    { age: 3, gender: 'female', giftIdeas: ['Dolls', 'Soft toys', 'Building blocks', 'Puzzles'], category: null },

    // Ages 4-6
    { age: 4, gender: 'male', giftIdeas: ['Action figures', 'Toy cars', 'Building blocks', 'Picture books'], category: null },
    { age: 4, gender: 'female', giftIdeas: ['Dolls', 'Soft toys', 'Picture books', 'Tea sets'], category: null },
    { age: 5, gender: 'male', giftIdeas: ['Dinosaur toys', 'Puzzles', 'Toy trains', 'Storybooks'], category: null },
    { age: 5, gender: 'female', giftIdeas: ['Teddy bears', 'Coloring books', 'Puzzles', 'Dress-up clothes'], category: null },
    { age: 6, gender: 'male', giftIdeas: ['Action figures', 'Toy cars', 'Building blocks', 'Board games'], category: null },
    { age: 6, gender: 'female', giftIdeas: ['Dolls', 'Art supplies', 'Storybooks', 'Musical toys'], category: null },

    // Ages 7-9
    { age: 7, gender: 'male', giftIdeas: ['LEGO sets', 'Board games', 'Sports equipment', 'Books'], category: null },
    { age: 7, gender: 'female', giftIdeas: ['Dolls', 'Art supplies', 'Storybooks', 'Craft kits'], category: null },
    { age: 8, gender: 'male', giftIdeas: ['LEGO sets', 'Video games', 'Sports gear', 'Science kits'], category: null },
    { age: 8, gender: 'female', giftIdeas: ['Craft kits', 'Musical instruments', 'Jewelry', 'Books'], category: null },
    { age: 9, gender: 'male', giftIdeas: ['Sports gear', 'Puzzles', 'Educational toys', 'Board games'], category: null },
    { age: 9, gender: 'female', giftIdeas: ['Art supplies', 'Books', 'Science kits', 'Craft kits'], category: null },

    // Ages 10-12
    { age: 10, gender: 'male', giftIdeas: ['LEGO sets', 'Board games', 'Science kits', 'Books'], category: null },
    { age: 10, gender: 'female', giftIdeas: ['Books', 'Art supplies', 'Jewelry', 'Sports equipment'], category: null },
    { age: 11, gender: 'male', giftIdeas: ['Video games', 'Sports equipment', 'Books', 'Tech gadgets'], category: null },
    { age: 11, gender: 'female', giftIdeas: ['Books', 'Art supplies', 'Science kits', 'Musical instruments'], category: null },
    { age: 12, gender: 'male', giftIdeas: ['Sports equipment', 'Video games', 'Books', 'Hobby kits'], category: null },
    { age: 12, gender: 'female', giftIdeas: ['Books', 'Art supplies', 'Tech gadgets', 'Jewelry'], category: null },

    // Ages 13-16
    { age: 13, gender: 'male', giftIdeas: ['Tech gadgets', 'Books', 'Hobby kits', 'Sports equipment'], category: null },
    { age: 13, gender: 'female', giftIdeas: ['Books', 'Art supplies', 'Tech gadgets', 'Fashion accessories'], category: null },
    { age: 14, gender: 'male', giftIdeas: ['Tech gadgets', 'Sports equipment', 'Books', 'Gaming accessories'], category: null },
    { age: 14, gender: 'female', giftIdeas: ['Books', 'Tech gadgets', 'Art supplies', 'Fashion accessories'], category: null },
    { age: 15, gender: 'male', giftIdeas: ['Tech gadgets', 'Books', 'Sports equipment', 'Music equipment'], category: null },
    { age: 15, gender: 'female', giftIdeas: ['Tech gadgets', 'Books', 'Fashion accessories', 'Art supplies'], category: null },
    { age: 16, gender: 'male', giftIdeas: ['Tech gadgets', 'Books', 'Sports equipment', 'Gaming gear'], category: null },
    { age: 16, gender: 'female', giftIdeas: ['Tech gadgets', 'Books', 'Fashion accessories', 'Art supplies'], category: null },
  ];

  for (const idea of giftIdeas) {
    await prisma.giftIdea.create({
      data: idea,
    });
  }
  console.log(`✅ Seeded ${giftIdeas.length} gift idea templates`);

  // Create sample children
  const children = [
    { recipient: 'Emma', age: 7, gender: 'female', giftIdeas: 'Dolls, art supplies, storybooks' },
    { recipient: 'Oliver', age: 10, gender: 'male', giftIdeas: 'LEGO sets, board games, science kits' },
    { recipient: 'Sophia', age: 5, gender: 'female', giftIdeas: 'Teddy bears, coloring books, puzzles' },
    { recipient: 'Liam', age: 12, gender: 'male', giftIdeas: 'Sports equipment, video games, books' },
    { recipient: 'Ava', age: 8, gender: 'female', giftIdeas: 'Craft kits, musical instruments, jewelry' },
    { recipient: 'Noah', age: 6, gender: 'male', giftIdeas: 'Action figures, toy cars, building blocks' },
    { recipient: 'Isabella', age: 11, gender: 'female', giftIdeas: 'Books, art supplies, science kits' },
    { recipient: 'Ethan', age: 9, gender: 'male', giftIdeas: 'Sports gear, puzzles, educational toys' },
    { recipient: 'Mia', age: 4, gender: 'female', giftIdeas: 'Dolls, soft toys, picture books' },
    { recipient: 'Lucas', age: 13, gender: 'male', giftIdeas: 'Tech gadgets, books, hobby kits' },
  ];

  for (const child of children) {
    await prisma.child.create({
      data: child,
    });
  }
  console.log(`✅ Seeded ${children.length} children`);

  console.log('🎄 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
