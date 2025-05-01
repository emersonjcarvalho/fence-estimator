/**
 * Synchronous Prisma Generate Script
 * The most minimal approach possible using execSync
 */

const { execSync } = require('child_process');

try {
  console.log('Starting direct Prisma generation...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma generation completed successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
}
