import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 26 real children with condensed gift ideas (ages 6-16)
const realChildren = [
  // Age 6
  { name: 'Taahirah', age: 6, gender: 'female', giftIdeas: 'Art supplies, Bracelet making kit, Books' },

  // Age 8
  { name: 'Amelia', age: 8, gender: 'female', giftIdeas: 'Arts and crafts, Painting supplies, Slime kit' },
  { name: 'Amayae', age: 8, gender: 'female', giftIdeas: 'Slime kit, Dance accessories, Outdoor toys' },
  { name: 'Aayan', age: 8, gender: 'male', giftIdeas: 'Football, Basketball, Computer games' },
  { name: 'Koby', age: 8, gender: 'male', giftIdeas: 'Board games, Hot Wheels cars, Pokemon cards' },
  { name: 'Mkale', age: 8, gender: 'male', giftIdeas: 'Minecraft merchandise, Lego sets, Beano comics' },

  // Age 9
  { name: 'Amy', age: 9, gender: 'female', giftIdeas: 'Music equipment, Cooking set, Dance accessories' },

  // Age 10
  { name: 'Kioni', age: 10, gender: 'female', giftIdeas: 'Drawing and painting set, Doll clothes making kit, Stop motion animation kit, Books' },
  { name: 'Oscar', age: 10, gender: 'male', giftIdeas: 'Space toys, Lego sets, Sonic merchandise' },
  { name: 'Isaac', age: 10, gender: 'male', giftIdeas: 'Anime merchandise, Art supplies, Pokemon cards' },

  // Age 11
  { name: 'Ayannah', age: 11, gender: 'female', giftIdeas: 'Perfume, FNAF Corpse Bride merchandise, Pokemon items' },

  // Age 12
  { name: 'Jasmine', age: 12, gender: 'female', giftIdeas: 'Music equipment, Make-up kit, Nail art set' },
  { name: 'Matio', age: 12, gender: 'female', giftIdeas: 'Drawing supplies, Art set, Sketchbooks' },
  { name: 'Harrison', age: 12, gender: 'male', giftIdeas: 'Boxing equipment, Cinema vouchers, Bike accessories' },

  // Age 13
  { name: 'Ruby', age: 13, gender: 'female', giftIdeas: 'Arts and crafts kit, Craft supplies, Painting set' },
  { name: 'Keane', age: 13, gender: 'male', giftIdeas: 'Football equipment, Gaming accessories, Video games' },
  { name: 'Reece', age: 13, gender: 'male', giftIdeas: 'Football equipment, Cooking set, Recipe books' },
  { name: 'Layton', age: 13, gender: 'male', giftIdeas: 'Drawing supplies, Art supplies, Cooking set' },

  // Age 15
  { name: 'Grace', age: 15, gender: 'female', giftIdeas: 'Animal toys, Roblox gift card, Percy Jackson books' },
  { name: 'Lexi', age: 15, gender: 'female', giftIdeas: 'Art supplies, One Direction merchandise, Cat themed items' },
  { name: 'Dante', age: 15, gender: 'male', giftIdeas: 'Aftershave, Fashion accessories, Bike equipment' },

  // Age 16
  { name: 'Brooke', age: 16, gender: 'female', giftIdeas: 'Make-up set, Music equipment, Cinema vouchers' },
  { name: 'Amelie', age: 16, gender: 'female', giftIdeas: 'Make-up set, Drawing supplies, Art kit' },
  { name: 'Kaeden', age: 16, gender: 'male', giftIdeas: 'Football equipment, Music equipment, Gaming accessories' },
  { name: 'Leo', age: 16, gender: 'male', giftIdeas: 'Aftershave, Fashion accessories, Bike equipment' },
  { name: 'Daniel', age: 16, gender: 'male', giftIdeas: 'Skateboard accessories, Low Temperature Stirling Engine, Science experiment kit' },
]

async function replaceWithRealChildren() {
  console.log('Starting replacement of fabricated children with real children...\n')

  let successCount = 0
  let failureCount = 0
  const replacements: Array<{
    realChild: string
    replacedChild: string
    age: number
    gender: string
  }> = []

  for (const realChild of realChildren) {
    try {
      // Find a fabricated child with matching age and gender that hasn't been replaced yet
      const fabricatedChild = await prisma.child.findFirst({
        where: {
          age: realChild.age,
          gender: realChild.gender,
          priority: false, // Only replace non-priority (fabricated) children
          assigned: false, // Only replace unassigned children
        },
      })

      if (!fabricatedChild) {
        console.log(`❌ No match found for ${realChild.name} (${realChild.gender}, age ${realChild.age})`)
        failureCount++
        continue
      }

      // Replace the fabricated child with the real child
      await prisma.child.update({
        where: { id: fabricatedChild.id },
        data: {
          recipient: realChild.name,
          giftIdeas: realChild.giftIdeas,
          priority: true, // Mark as priority
        },
      })

      replacements.push({
        realChild: realChild.name,
        replacedChild: fabricatedChild.recipient,
        age: realChild.age,
        gender: realChild.gender,
      })

      console.log(`✅ Replaced "${fabricatedChild.recipient}" with "${realChild.name}" (${realChild.gender}, age ${realChild.age})`)
      successCount++
    } catch (error) {
      console.error(`❌ Error replacing ${realChild.name}:`, error)
      failureCount++
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('REPLACEMENT SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Successfully replaced: ${successCount}`)
  console.log(`❌ Failed: ${failureCount}`)
  console.log(`📊 Total real children: ${realChildren.length}`)

  console.log('\n' + '='.repeat(80))
  console.log('DETAILED REPLACEMENTS')
  console.log('='.repeat(80))
  replacements.forEach((r) => {
    console.log(`${r.realChild} (${r.gender}, ${r.age}) replaced "${r.replacedChild}"`)
  })

  // Verify priority counts
  const priorityCount = await prisma.child.count({
    where: { priority: true },
  })

  const totalCount = await prisma.child.count()

  console.log('\n' + '='.repeat(80))
  console.log('DATABASE VERIFICATION')
  console.log('='.repeat(80))
  console.log(`Priority children (real): ${priorityCount}`)
  console.log(`Non-priority children (fabricated): ${totalCount - priorityCount}`)
  console.log(`Total children: ${totalCount}`)
}

async function main() {
  try {
    await replaceWithRealChildren()
  } catch (error) {
    console.error('Error during replacement:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
