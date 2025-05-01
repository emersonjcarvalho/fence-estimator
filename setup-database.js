/**
 * Simple database setup script
 * Run with: node setup-database.js
 * 
 * This script:
 * 1. Loads environment variables from .env
 * 2. Sets DATABASE_URL environment variable for Prisma commands
 * 3. Runs Prisma generate and db push commands
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔹 Home Service Estimator - Database Setup 🔹\n');

// Load DATABASE_URL from .env
let databaseUrl = '';
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
  console.log('✓ Found .env file');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);
  
  if (match && match[1]) {
    databaseUrl = match[1];
    console.log('✓ Found DATABASE_URL in .env file');
  }
}

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not found in .env file');
  console.error('Please create a .env file with DATABASE_URL in the root directory');
  console.error('Example:');
  console.error('DATABASE_URL="postgresql://username:password@hostname:port/database"');
  process.exit(1);
}

console.log(`✓ Using DATABASE_URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);

// Create a copy of the current environment with our DATABASE_URL
const env = { ...process.env, DATABASE_URL: databaseUrl };

// Use the appropriate NPX command for the current platform
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Run Prisma generate command
console.log('\n➡️ Running Prisma generate...');
const generateResult = spawnSync(npxCmd, ['prisma', 'generate'], { 
  stdio: 'inherit',
  env: env
});

if (generateResult.error || (generateResult.status !== 0)) {
  console.error('\n❌ Error running Prisma generate');
  if (generateResult.error) {
    console.error(generateResult.error.message);
  }
  process.exit(1);
}

// Run Prisma db push command
console.log('\n➡️ Running Prisma db push...');
const pushResult = spawnSync(npxCmd, ['prisma', 'db', 'push'], { 
  stdio: 'inherit',
  env: env
});

if (pushResult.error || (pushResult.status !== 0)) {
  console.error('\n❌ Error running Prisma db push');
  if (pushResult.error) {
    console.error(pushResult.error.message);
  }
  process.exit(1);
}

console.log('\n✅ Database setup completed successfully');
console.log('\n🎉 You can now start the application with:');
console.log('   npm run dev');
