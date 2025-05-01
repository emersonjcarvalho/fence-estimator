/**
 * Simplified database setup script
 * Checks the environment, constructs DATABASE_URL if needed, and runs Prisma commands
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env and .env.local
function loadEnvVariables() {
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  // Start with empty config
  const envConfig = {};
  
  // Try to load from .env if it exists
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    parseEnvFile(envContent, envConfig);
    console.log('Loaded environment variables from .env');
  }
  
  // Try to load from .env.local (which overrides .env)
  if (fs.existsSync(envLocalPath)) {
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    parseEnvFile(envLocalContent, envConfig);
    console.log('Loaded environment variables from .env.local');
  }
  
  return envConfig;
}

// Parse env file content
function parseEnvFile(content, config) {
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comments and empty lines
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Parse key=value pairs
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      let [, key, value] = match;
      key = key.trim();
      
      // Handle quoted values
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      config[key] = value;
    }
  }
}

// Load environment variables
const envVars = loadEnvVariables();

// Check for component-based configuration
let databaseUrl = '';

if (envVars.DATABASE_URL) {
  databaseUrl = envVars.DATABASE_URL;
  console.log('Found DATABASE_URL in environment variables');
} else if (envVars.DB_HOST && envVars.DB_PASSWORD) {
  // Construct from components
  const username = envVars.DB_USERNAME || 'postgres';
  const password = envVars.DB_PASSWORD;
  const host = envVars.DB_HOST;
  const port = envVars.DB_PORT || '5432';
  const database = envVars.DB_NAME || 'postgres';
  
  databaseUrl = `postgresql://${username}:${password}@${host}:${port}/${database}`;
  console.log(`Constructed DATABASE_URL from components (using ${host})`);
  
  // Write the DATABASE_URL to a temporary .env file for Prisma to use
  fs.writeFileSync('.env', `DATABASE_URL="${databaseUrl}"\n`);
  console.log('Created temporary .env file with DATABASE_URL');
} else {
  console.error('Error: No database configuration found');
  console.error('Please set either DATABASE_URL or DB_HOST and DB_PASSWORD in .env or .env.local');
  process.exit(1);
}

// Use the appropriate NPX command for the current platform
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Run Prisma commands
try {
  console.log('Running Prisma generate...');
  execSync(`${npxCmd} prisma generate`, { stdio: 'inherit' });
  
  console.log('Running Prisma db push...');
  execSync(`${npxCmd} prisma db push`, { stdio: 'inherit' });
  
  console.log('✅ Database setup completed successfully');
} catch (error) {
  console.error('❌ Error running Prisma commands:', error.message);
  process.exit(1);
} finally {
  // Clean up temporary .env file if we created one
  if (!envVars.DATABASE_URL && fs.existsSync('.env')) {
    fs.unlinkSync('.env');
    console.log('Removed temporary .env file');
  }
}
