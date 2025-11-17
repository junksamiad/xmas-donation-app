import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Seeding admin user...');

  // ⚠️ SAFETY: Only deletes users, preserves all other data
  console.log('⚠️  This will DELETE all existing users');
  console.log('✅ Safe: Preserves donations, children, departments, gift ideas');

  await prisma.user.deleteMany();
  console.log('✓ Cleared existing users');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log(`✅ Created admin user`);
  console.log('');
  console.log('📊 Admin credentials:');
  console.log(`   Username: ${adminUser.username}`);
  console.log(`   Password: admin123 (change after first login!)`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the default password in production!');
  console.log('');
  console.log('👤 User seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
