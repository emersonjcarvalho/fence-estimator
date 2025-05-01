// Database update script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Updating database schema...');
  
  // Check for the existence of .env or .env.local
  if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
    console.error('No .env or .env.local file found. Please create one with your DATABASE_URL.');
    process.exit(1);
  }
  
  // Run Prisma generate to update the client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Run Prisma db push to update the schema
  console.log('Pushing schema changes to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Database updated successfully!');
  console.log('You can start the development server with: npm run dev');
  
} catch (error) {
  console.error('❌ Error updating database:', error.message);
  console.error('If this is a connection error, please check your DATABASE_URL in .env.local');
  
  // For development mode, show a more detailed message
  if (process.env.NODE_ENV === 'development') {
    console.error('\nDetailed error:');
    console.error(error);
  }
  
  process.exit(1);
}
