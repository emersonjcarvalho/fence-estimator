/**
 * Direct Prisma Generator Script
 * 
 * This script directly uses the Prisma Generator API to generate 
 * the Prisma Client without relying on npx or spawn commands.
 */

const { generate } = require('@prisma/internals');
const { Diagnostic } = require('@prisma/generator-helper');
const path = require('path');
const fs = require('fs');

// Function to load environment variables from .env files
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local')
  ];
  
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        
        for (const line of lines) {
          const match = line.match(/^\s*([^#=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            
            // Handle quoted values
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            
            // Only set if not already defined in process.env
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
        console.log(`Loaded environment variables from ${envPath}`);
      } catch (error) {
        console.warn(`Warning: Could not load ${envPath}:`, error.message);
      }
    }
  }
}

// Load environment variables
loadEnv();

// Set up schema path
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

// Make sure the schema exists
if (!fs.existsSync(schemaPath)) {
  console.error(`Error: Prisma schema not found at ${schemaPath}`);
  process.exit(1);
}

// Log start
console.log('Starting Prisma Client generation...');
console.log(`Using schema at: ${schemaPath}`);

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL is not set in environment variables');
  console.warn('The Prisma client will be generated without a connection to the database');
  console.warn('This may cause issues if your schema requires introspection');
} else {
  // Mask the password in the log
  const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  console.log(`Using DATABASE_URL: ${maskedUrl}`);
}

// Run the generator
(async () => {
  try {
    // Generate the Prisma Client
    const options = {
      schemaPath,
      printDownloadProgress: true,
      skipDownload: false,
    };
    
    console.log('Generating Prisma Client...');
    const results = await generate(options);
    
    // Check for errors
    const errors = results.flatMap(result => 
      result.errors && result.errors.length > 0 ? result.errors : []
    );
    
    if (errors.length > 0) {
      console.error('Errors occurred during generation:');
      errors.forEach(error => {
        console.error(`- ${error.message}`);
      });
      process.exit(1);
    }
    
    // Check for warnings
    const warnings = results.flatMap(result => 
      result.warnings && result.warnings.length > 0 ? result.warnings : []
    );
    
    if (warnings.length > 0) {
      console.warn('Warnings during generation:');
      warnings.forEach(warning => {
        console.warn(`- ${warning.message}`);
      });
    }
    
    console.log('Prisma Client generated successfully!');
  } catch (error) {
    console.error('Error generating Prisma Client:', error);
    process.exit(1);
  }
})();
