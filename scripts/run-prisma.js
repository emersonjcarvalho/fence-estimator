/**
 * Helper script to run Prisma commands with constructed DATABASE_URL
 * 
 * This script:
 * 1. Loads environment variables from .env.local
 * 2. Constructs DATABASE_URL from component variables if needed
 * 3. Sets the DATABASE_URL environment variable for the child process
 * 4. Runs the specified Prisma command
 * 
 * Special handling for Vercel environment is included to ensure
 * Prisma commands run correctly during deployment.
 */

const { spawnSync } = require('child_process');
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

// Construct DATABASE_URL from components
function constructDatabaseUrl(config) {
  const username = config.DB_USERNAME || 'postgres';
  const password = config.DB_PASSWORD;
  const host = config.DB_HOST;
  const port = config.DB_PORT || '5432';
  const database = config.DB_NAME || 'postgres';
  
  // Check for required components
  if (!password || !host) {
    console.error('Error: DB_PASSWORD and DB_HOST are required in environment variables');
    process.exit(1);
  }
  
  // Construct the URL
  const url = `postgresql://${username}:${password}@${host}:${port}/${database}`;
  console.log(`Constructed DATABASE_URL from components (using ${host})`);
  
  return url;
}

// Detect if we're running in Vercel environment
function isVercelEnvironment() {
  return process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
}

// Run Prisma command with DATABASE_URL
function runPrismaCommand(command, args = []) {
  // Special handling for Vercel environment
  if (isVercelEnvironment()) {
    console.log('Detected Vercel environment, using direct environment variables');
    
    // In Vercel, just use the environment variables already set
    console.log(`Running prisma ${command} ${args.join(' ')} in Vercel environment`);
    
    // Use npx directly in Vercel
    const npxCmd = 'npx';
    
    // Run the command using environment variables provided by Vercel
    const result = spawnSync(npxCmd, ['prisma', command, ...args], {
      stdio: 'inherit'
    });
    
    if (result.error || (result.status !== 0)) {
      console.error(`Error running prisma ${command} in Vercel environment`);
      if (result.error) {
        console.error(result.error.message);
      }
      process.exit(result.status || 1);
    }
    
    console.log(`Vercel Prisma command completed successfully`);
    return;
  }
  
  // Load env variables (for non-Vercel environments)
  const config = loadEnvVariables();
  
  // Get DATABASE_URL (from direct config or components)
  let databaseUrl = '';
  
  if (config.DATABASE_URL) {
    databaseUrl = config.DATABASE_URL;
    console.log('Using DATABASE_URL from environment');
  } else if (config.DB_HOST && config.DB_PASSWORD) {
    databaseUrl = constructDatabaseUrl(config);
  } else {
    console.error('Error: No database configuration found');
    console.error('Please set either DATABASE_URL or DB_HOST and DB_PASSWORD in .env.local');
    process.exit(1);
  }
  
  // Mask password in logs
  const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ':****@');
  console.log(`Using DATABASE_URL: ${maskedUrl}`);
  
  // Create a copy of the current environment with our DATABASE_URL
  const env = { ...process.env, DATABASE_URL: databaseUrl };
  
  console.log(`Running prisma ${command} ${args.join(' ')}`);
  
  // Use the appropriate NPX command for the current platform
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  
  // Run the command with the environment including DATABASE_URL
  const result = spawnSync(npxCmd, ['prisma', command, ...args], {
    stdio: 'inherit',
    env: env
  });
  
  if (result.error || (result.status !== 0)) {
    console.error(`Error running prisma ${command}`);
    if (result.error) {
      console.error(result.error.message);
    }
    process.exit(result.status || 1);
  }
  
  console.log(`Command completed successfully`);
}

// Get command from arguments
const [, , command, ...args] = process.argv;

if (!command) {
  console.error('Usage: node scripts/run-prisma.js <command> [args]');
  console.error('Example: node scripts/run-prisma.js generate');
  console.error('Example: node scripts/run-prisma.js db push');
  process.exit(1);
}

// Handle "db" commands (e.g. "db push", "db pull")
if (command === 'db') {
  const dbCommand = args.shift();
  runPrismaCommand(command, [dbCommand, ...args]);
} else {
  runPrismaCommand(command, args);
}
