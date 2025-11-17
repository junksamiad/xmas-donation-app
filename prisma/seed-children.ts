import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// UK-representative names (multicultural demographic)
const boysNames = [
  // Traditional British
  'Oliver', 'George', 'Harry', 'Jack', 'Noah', 'Charlie', 'Oscar', 'Henry', 'Leo', 'Alfie',
  'Thomas', 'Freddie', 'William', 'Archie', 'Arthur', 'James', 'Edward', 'Joshua', 'Isaac', 'Lucas',
  // South Asian
  'Muhammad', 'Ali', 'Aarav', 'Aryan', 'Zayn', 'Amir', 'Hassan', 'Ibrahim', 'Rayan', 'Ayaan',
  'Yusuf', 'Adam', 'Omar', 'Hamza', 'Imran', 'Zain', 'Idris', 'Farhan', 'Samir', 'Ravi',
  // Eastern European
  'Aleksander', 'Dominik', 'Jakub', 'Kacper', 'Mateusz', 'Michal', 'Krzysztof', 'Piotr', 'Wojciech', 'Filip',
  // African/Caribbean
  'Emmanuel', 'Joshua', 'Samuel', 'David', 'Daniel', 'Nathan', 'Jordan', 'Andre', 'Marcus', 'Jamal',
  'Kwame', 'Kofi', 'Malik', 'Tariq', 'Isaiah', 'Elijah', 'Josiah', 'Micah', 'Solomon', 'Moses',
  // East Asian
  'Wei', 'Ming', 'Chen', 'Kai', 'Yuki', 'Kenji', 'Haruki', 'Ryu', 'Jin', 'Tao',
  // Middle Eastern
  'Karim', 'Rashid', 'Nabil', 'Faisal', 'Tariq', 'Khalid', 'Jamal', 'Bilal', 'Sami', 'Nasir',
];

const girlsNames = [
  // Traditional British
  'Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Isabella', 'Sophia', 'Grace', 'Lily', 'Emily',
  'Ella', 'Poppy', 'Evie', 'Charlotte', 'Sophie', 'Jessica', 'Ruby', 'Chloe', 'Lucy', 'Daisy',
  // South Asian
  'Aisha', 'Amira', 'Zara', 'Fatima', 'Sara', 'Layla', 'Maya', 'Aaliyah', 'Noor', 'Maryam',
  'Anika', 'Priya', 'Diya', 'Anaya', 'Isha', 'Riya', 'Kavya', 'Shreya', 'Zoya', 'Sana',
  // Eastern European
  'Aleksandra', 'Natalia', 'Julia', 'Zofia', 'Maja', 'Oliwia', 'Wiktoria', 'Amelia', 'Lena', 'Emilia',
  // African/Caribbean
  'Abigail', 'Hannah', 'Grace', 'Faith', 'Hope', 'Joy', 'Naomi', 'Esther', 'Ruth', 'Zara',
  'Amara', 'Nia', 'Imani', 'Kendra', 'Tiana', 'Jasmine', 'Aaliyah', 'Destiny', 'Trinity', 'Angel',
  // East Asian
  'Mei', 'Ling', 'Yuki', 'Hana', 'Sakura', 'Akira', 'Yui', 'Rin', 'Aiko', 'Keiko',
  // Middle Eastern
  'Amina', 'Yasmin', 'Salma', 'Nadia', 'Hana', 'Leila', 'Zahra', 'Samira', 'Farah', 'Soraya',
];

// Age-appropriate gift ideas generator
function getGiftIdeas(age: number, gender: string): string {
  const giftSets = {
    '0-3': {
      male: ['Soft toys', 'Baby books', 'Building blocks', 'Musical toys', 'Activity mats'],
      female: ['Soft dolls', 'Baby books', 'Building blocks', 'Musical toys', 'Activity mats'],
    },
    '4-6': {
      male: ['Action figures', 'Toy cars', 'Dinosaurs', 'Building sets', 'Colouring books'],
      female: ['Dolls', 'Craft sets', 'Dress-up clothes', 'Building sets', 'Colouring books'],
    },
    '7-9': {
      male: ['LEGO sets', 'Sports equipment', 'Board games', 'Science kits', 'Books'],
      female: ['Art supplies', 'Craft kits', 'Books', 'Board games', 'Musical instruments'],
    },
    '10-12': {
      male: ['Video games', 'Sports gear', 'Books', 'Science kits', 'Hobby kits'],
      female: ['Books', 'Art supplies', 'Craft kits', 'Board games', 'Sports equipment'],
    },
    '13-16': {
      male: ['Tech gadgets', 'Sports equipment', 'Books', 'Gaming accessories', 'Music equipment'],
      female: ['Tech gadgets', 'Books', 'Fashion accessories', 'Art supplies', 'Sports equipment'],
    },
  };

  let ageGroup: keyof typeof giftSets;
  if (age <= 3) ageGroup = '0-3';
  else if (age <= 6) ageGroup = '4-6';
  else if (age <= 9) ageGroup = '7-9';
  else if (age <= 12) ageGroup = '10-12';
  else ageGroup = '13-16';

  const genderKey = gender === 'male' ? 'male' : 'female';
  const gifts = giftSets[ageGroup][genderKey];

  // Select 3-4 random gifts
  const numGifts = 3 + Math.floor(Math.random() * 2);
  const shuffled = [...gifts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numGifts).join(', ');
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function main() {
  console.log('🎄 Seeding children database with UK demographic data...');

  // ⚠️ SAFETY CHECK: Ensure no donations exist before deleting children
  const donationCount = await prisma.donation.count();
  if (donationCount > 0) {
    console.error('');
    console.error('❌ SAFETY BLOCK: Cannot seed children!');
    console.error(`   ${donationCount} donation(s) exist in database`);
    console.error('');
    console.error('Options:');
    console.error('   1. Backup donations first: npm run db:backup-donations');
    console.error('   2. Delete donations: await prisma.donation.deleteMany()');
    console.error('   3. Deploy to fresh database instead');
    console.error('');
    throw new Error('Donations exist - refusing to delete children data');
  }

  // Safe to proceed - no donations exist
  await prisma.child.deleteMany();
  console.log('✓ Cleared existing children (no donations affected)');

  const children = [];

  // Create shuffled name pools
  const shuffledBoys = shuffleArray(boysNames);
  const shuffledGirls = shuffleArray(girlsNames);

  let boysIndex = 0;
  let girlsIndex = 0;

  // Generate 10 children per age (1-16), alternating gender
  for (let age = 1; age <= 16; age++) {
    // 5 boys per age group
    for (let i = 0; i < 5; i++) {
      const name = shuffledBoys[boysIndex % shuffledBoys.length];
      boysIndex++;

      children.push({
        recipient: name,
        age,
        gender: 'male',
        giftIdeas: getGiftIdeas(age, 'male'),
        priority: Math.random() < 0.1, // 10% are priority cases
      });
    }

    // 5 girls per age group
    for (let i = 0; i < 5; i++) {
      const name = shuffledGirls[girlsIndex % shuffledGirls.length];
      girlsIndex++;

      children.push({
        recipient: name,
        age,
        gender: 'female',
        giftIdeas: getGiftIdeas(age, 'female'),
        priority: Math.random() < 0.1, // 10% are priority cases
      });
    }
  }

  // Shuffle the final array to mix ages and genders
  const shuffledChildren = shuffleArray(children);

  // Insert in batches for better performance
  const batchSize = 50;
  for (let i = 0; i < shuffledChildren.length; i += batchSize) {
    const batch = shuffledChildren.slice(i, i + batchSize);
    await prisma.child.createMany({
      data: batch,
    });
  }

  console.log(`✅ Created ${shuffledChildren.length} children`);
  console.log('');
  console.log('📊 Demographics breakdown:');
  console.log(`   Ages: 1-16 (10 children per age group)`);
  console.log(`   Gender: 50% male, 50% female`);
  console.log(`   Priority cases: ~${Math.round(shuffledChildren.length * 0.1)}`);
  console.log('');
  console.log('🌍 UK multicultural representation included');
  console.log('🎁 Age-appropriate gift ideas assigned');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
