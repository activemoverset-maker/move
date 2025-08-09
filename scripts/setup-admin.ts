import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    console.log('🚀 Setting up admin user...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: process.env.ADMIN_EMAIL! },
    })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12)
    
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: process.env.ADMIN_EMAIL!,
        password: hashedPassword,
        name: process.env.ADMIN_NAME!,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`👤 Name: ${admin.name}`)
    console.log(`🆔 ID: ${admin.id}`)
    console.log('\n🔐 You can now login at /admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Check required environment variables
const requiredEnvVars = ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_NAME']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach(varName => console.error(`   - ${varName}`))
  console.error('\nPlease set these variables in your .env.local file')
  process.exit(1)
}

setupAdmin() 
 
 
 