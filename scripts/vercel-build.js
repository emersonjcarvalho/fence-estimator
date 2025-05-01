/**
 * This script ensures Prisma Client is properly generated during Vercel builds
 */

const { execSync } = require('child_process');

// Log the start of Prisma generation
console.log('🔄 Running Prisma generation for Vercel deployment...');

try {
  // Run the prisma generate command
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error);
  process.exit(1);
}
