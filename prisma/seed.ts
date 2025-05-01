/**
 * Prisma seed script to populate the database with test data
 * 
 * Usage: 
 * 1. Make sure DATABASE_URL is set in .env.local
 * 2. Run: npx ts-node prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data for testing
const testSubmissions = [
  {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Los Angeles, CA',
    zip_code: '90210',
    property_type: 'Residential',
    service_type: 'New Installation',
    materials: ['PVC', 'Wood'],
    project_details: 'Converting bathtub to walk-in shower. Issues: Lack of space, hard to enter/exit. Has tankless water heater. Plumbing in good condition.',
  },
  {
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Broadway, New York, NY',
    zip_code: '10001',
    property_type: 'Residential',
    service_type: 'Replacement',
    materials: ['Aluminum'],
    project_details: 'Converting bathtub to walk-in shower. Issues: High threshold, inaccessible controls. Has storage tank water heater. Plumbing in fair condition.',
  },
  {
    full_name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '555-555-5555',
    address: '789 Michigan Ave, Chicago, IL',
    zip_code: '60601',
    property_type: 'Residential',
    service_type: 'Repair',
    materials: ['Other'],
    project_details: 'Upgrading existing shower to walk-in shower. No existing bathtub. Unsure about water heater and plumbing condition.',
  },
];

async function main() {
  console.log(`🌱 Start seeding database...`);

  // Check if we already have test data
  const existingCount = await prisma.fenceEstimates.count();
  
  if (existingCount > 0) {
    console.log(`⚠️ Database already has ${existingCount} submissions.`);
    
    // Ask if the user wants to delete existing data
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    const answer = await new Promise<string>(resolve => {
      readline.question('Do you want to delete existing data and reseed? (y/n): ', resolve);
    });
    
    readline.close();
    
    if (answer.toLowerCase() === 'y') {
      // Delete all existing submissions
      await prisma.fenceEstimates.deleteMany({});
      console.log('✅ Existing data deleted.');
    } else {
      console.log('❌ Seeding cancelled.');
      return;
    }
  }

  try {
    // Insert test data
    for (const submission of testSubmissions) {
      const result = await prisma.fenceEstimates.create({
        data: submission,
      });
      
      console.log(`✅ Created submission for ${result.full_name} with ID: ${result.id}`);
    }
    
    console.log(`🎉 Seeding completed successfully!`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
