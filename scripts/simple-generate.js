/**
 * Super simple Prisma generate script
 * Uses the most direct approach possible with the exec method
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Prisma Client generation using the simplest method...');

// First check if prisma/schema.prisma exists
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error(`Error: Prisma schema not found at ${schemaPath}`);
  process.exit(1);
}

// Execute the prisma generate command directly
const command = 'npx prisma generate';
console.log(`Executing command: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing prisma generate: ${error.message}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('Prisma Client generation completed');
});
