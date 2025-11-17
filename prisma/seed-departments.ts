import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏢 Seeding departments...');

  // ⚠️ SAFETY: Only deletes departments, preserves all other data
  console.log('⚠️  This will DELETE all existing departments');
  console.log('✅ Safe: Preserves donations, children, gift ideas, users');

  await prisma.department.deleteMany();
  console.log('✓ Cleared existing departments');

  // Create 11 company departments
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
      data: { name, active: true },
    });
    departments.push(dept);
  }

  console.log(`✅ Created ${departments.length} departments`);
  console.log('');
  console.log('📊 Departments:');
  departments.forEach(dept => console.log(`   - ${dept.name}`));
  console.log('');
  console.log('🎄 Department seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding departments:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
