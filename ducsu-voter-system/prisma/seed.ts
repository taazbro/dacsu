import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Create admin user
  const adminPassword = await bcrypt.hash('Subscribe@vezran', 10)
  const userPassword = await bcrypt.hash('follow@vezranai', 10)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'Administrator',
      role: 'ADMIN',
      email: 'admin@ducsu.edu.bd'
    }
  })
  
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: userPassword,
      name: 'Standard User',
      role: 'USER',
      email: 'user@ducsu.edu.bd'
    }
  })
  
  console.log('✅ Users created')
  
  // Create halls
  const halls = [
    { name: 'Kabi Jasimuddin Hall', nameBn: 'কবি জসীম উদ্দীন হল', prefix: 'JS' },
    { name: 'Kabi Sufia Kamal Hall', nameBn: 'কবি সুফিয়া কামাল হল', prefix: 'SK' },
    { name: 'Jagannath Hall', nameBn: 'জগন্নাথ হল', prefix: 'JG' },
    { name: 'Bangabandhu Sheikh Mujibur Rahman Hall', nameBn: 'জাতির জনক বঙ্গবন্ধু শেখ মুজিবুর রহমান হল', prefix: 'BB' },
    { name: 'Dr Muhammad Shahidullah Hall', nameBn: 'ড. মুহম্মদ শহীদুল্লাহ হল', prefix: 'SH' },
    { name: 'Fazlul Huq Muslim Hall', nameBn: 'ফজলুল হক মুসলিম হল', prefix: 'FH' },
    { name: 'Begum Fazilatunnesa Mujib Hall', nameBn: 'বঙ্গমাতা শেখ ফজিলাতুন্নেছা মুজিব হল', prefix: 'FM' },
    { name: 'Bangladesh Kuwait Maitree Hall', nameBn: 'বাংলাদেশ-কুয়েত মৈত্রী হল', prefix: 'KM' },
    { name: 'Bijoy Ekattor Hall', nameBn: 'বিজয় একাত্তর হল', prefix: 'BE' },
    { name: 'Shaheed Sergeant Zahurul Haq Hall', nameBn: 'শহীদ সার্জেন্ট জহুরুল হক হল', prefix: 'ZH' },
    { name: 'Shamsun Nahar Hall', nameBn: 'শামসুন নাহার হল', prefix: 'SN' },
    { name: 'Salimullah Muslim Hall', nameBn: 'সলিমুল্লাহ মুসলিম হল', prefix: 'SL' },
    { name: 'Surya Sen Hall', nameBn: 'সূর্যসেন হল', prefix: 'SS' },
    { name: 'Sir AF Rahman Hall', nameBn: 'স্যার এ এফ রহমান হল', prefix: 'AR' },
    { name: 'Muktijoddha Ziaur Rahman Hall', nameBn: 'মুক্তিযোদ্ধা জিয়াউর রহমান হল', prefix: 'ZR' },
    { name: 'Amar Ekushey Hall', nameBn: 'অমর একুশে হল', prefix: 'AE' },
    { name: 'Haji Muhammad Muhsin Hall', nameBn: 'হাজী মুহম্মদ মুহসীন হল', prefix: 'MM' },
    { name: 'Begum Rokeya Hall', nameBn: 'বেগম রোকেয়া হল', prefix: 'BR' }
  ]
  
  for (const hallData of halls) {
    await prisma.hall.upsert({
      where: { prefix: hallData.prefix },
      update: {},
      create: hallData
    })
  }
  
  console.log('✅ Halls created')
  
  // Load voter data from JSON files
  const voterDataPath = path.join(process.cwd(), 'public', 'data', 'voter_database.json')
  
  if (fs.existsSync(voterDataPath)) {
    const voterData = JSON.parse(fs.readFileSync(voterDataPath, 'utf-8'))
    
    if (voterData.voters && Array.isArray(voterData.voters)) {
      console.log(`📊 Loading ${voterData.voters.length} voters...`)
      
      // Process in batches to avoid memory issues
      const batchSize = 500
      for (let i = 0; i < voterData.voters.length; i += batchSize) {
        const batch = voterData.voters.slice(i, i + batchSize)
        
        for (const voter of batch) {
          // Find the hall
          const hall = await prisma.hall.findFirst({
            where: {
              OR: [
                { name: { contains: voter.hall } },
                { nameBn: { contains: voter.hall } }
              ]
            }
          })
          
          if (hall) {
            await prisma.voter.upsert({
              where: { id: voter.id },
              update: {},
              create: {
                id: voter.id,
                name: voter.name,
                nameBn: voter.nameBn || voter.name,
                hallId: hall.id,
                department: voter.department,
                departmentBn: voter.departmentBn,
                session: voter.session,
                year: voter.year,
                verified: Math.random() > 0.3 // 70% verified for demo
              }
            })
          }
        }
        
        console.log(`  Processed ${Math.min(i + batchSize, voterData.voters.length)} voters...`)
      }
      
      console.log('✅ Voters imported')
    }
  } else {
    console.log('⚠️  No voter data file found, creating sample data...')
    
    // Create sample voters
    const hallRecords = await prisma.hall.findMany()
    const departments = ['Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'English', 'Bengali', 'Economics']
    
    for (const hall of hallRecords) {
      for (let i = 1; i <= 100; i++) {
        await prisma.voter.create({
          data: {
            id: `${hall.prefix}-${String(i).padStart(4, '0')}`,
            name: `Student ${i} ${hall.prefix}`,
            nameBn: `ছাত্র ${i} ${hall.prefix}`,
            hallId: hall.id,
            department: departments[Math.floor(Math.random() * departments.length)],
            session: '2023-24',
            year: String(Math.floor(Math.random() * 4) + 1),
            verified: Math.random() > 0.3
          }
        })
      }
    }
    
    console.log('✅ Sample voters created')
  }
  
  // Update hall voter counts
  const hallCounts = await prisma.voter.groupBy({
    by: ['hallId'],
    _count: true
  })
  
  for (const count of hallCounts) {
    await prisma.hall.update({
      where: { id: count.hallId },
      data: { voterCount: count._count }
    })
  }
  
  console.log('✅ Hall voter counts updated')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
