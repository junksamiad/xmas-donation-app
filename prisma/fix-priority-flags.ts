import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// The 26 real children with name + age + gender to uniquely identify them
const realChildren = [
  { name: 'Taahirah', age: 6, gender: 'female' },
  { name: 'Amelia', age: 8, gender: 'female' },
  { name: 'Amayae', age: 8, gender: 'female' },
  { name: 'Aayan', age: 8, gender: 'male' },
  { name: 'Koby', age: 8, gender: 'male' },
  { name: 'Mkale', age: 8, gender: 'male' },
  { name: 'Amy', age: 9, gender: 'female' },
  { name: 'Kioni', age: 10, gender: 'female' },
  { name: 'Oscar', age: 10, gender: 'male' },
  { name: 'Isaac', age: 10, gender: 'male' },
  { name: 'Ayannah', age: 11, gender: 'female' },
  { name: 'Jasmine', age: 12, gender: 'female' },
  { name: 'Matio', age: 12, gender: 'female' },
  { name: 'Harrison', age: 12, gender: 'male' },
  { name: 'Ruby', age: 13, gender: 'female' },
  { name: 'Keane', age: 13, gender: 'male' },
  { name: 'Reece', age: 13, gender: 'male' },
  { name: 'Layton', age: 13, gender: 'male' },
  { name: 'Grace', age: 15, gender: 'female' },
  { name: 'Lexi', age: 15, gender: 'female' },
  { name: 'Dante', age: 15, gender: 'male' },
  { name: 'Brooke', age: 16, gender: 'female' },
  { name: 'Amelie', age: 16, gender: 'female' },
  { name: 'Kaeden', age: 16, gender: 'male' },
  { name: 'Leo', age: 16, gender: 'male' },
  { name: 'Daniel', age: 16, gender: 'male' },
]

async function fixPriorityFlags() {
  console.log('Fixing priority flags...\n')

  // Step 1: Reset ALL children to priority=false
  console.log('Step 1: Resetting all priority flags to false...')
  const resetResult = await prisma.child.updateMany({
    data: { priority: false },
  })
  console.log(`✅ Reset ${resetResult.count} children to priority=false\n`)

  // Step 2: Set only the 26 real children to priority=true
  console.log('Step 2: Setting 26 real children to priority=true...')

  let successCount = 0
  for (const child of realChildren) {
    const result = await prisma.child.updateMany({
      where: {
        recipient: child.name,
        age: child.age,
        gender: child.gender,
      },
      data: { priority: true },
    })

    if (result.count > 0) {
      console.log(`✅ Set ${child.name} (${child.gender}, age ${child.age}) to priority=true`)
      successCount++
    } else {
      console.log(`❌ Could not find ${child.name} (${child.gender}, age ${child.age})`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Successfully set ${successCount} real children to priority=true`)

  // Step 3: Verify final counts
  const priorityCount = await prisma.child.count({
    where: { priority: true },
  })

  const totalCount = await prisma.child.count()

  console.log('\n' + '='.repeat(80))
  console.log('FINAL DATABASE STATE')
  console.log('='.repeat(80))
  console.log(`Priority children (real): ${priorityCount}`)
  console.log(`Non-priority children (fabricated): ${totalCount - priorityCount}`)
  console.log(`Total children: ${totalCount}`)
}

async function main() {
  try {
    await fixPriorityFlags()
  } catch (error) {
    console.error('Error during fix:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
