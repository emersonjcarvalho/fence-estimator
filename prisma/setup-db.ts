/**
 * Database setup and migration helper script
 * Usage: npx ts-node prisma/setup-db.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Helper to create readline interface
const createInterface = () => readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to execute a command with logging
const runCommand = (command: string, description: string): boolean => {
  try {
    console.log(`\n➡️ ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`);
    console.error(error);
    return false;
  }
};

// Helper to update/append a value in .env.local
const updateEnvValue = (envPath: string, key: string, value: string): void => {
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if the key already exists
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
      // Replace existing value
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      // Append new key-value pair
      envContent += `\n${key}=${value}`;
    }
  } else {
    // Create new file with key-value pair
    envContent = `${key}=${value}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
};

// Main async function to allow for await
async function main() {
  console.log('\n🔹 Prisma Database Setup Helper 🔹\n');
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Check existing configuration
  let dbHost = '';
  let dbPassword = '';
  let dbUsername = 'postgres';
  let dbName = 'postgres';
  let dbPort = '5432';
  let databaseUrl = '';
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check for component-based config
    const hostMatch = envContent.match(/DB_HOST=(.+)/);
    const passwordMatch = envContent.match(/DB_PASSWORD=(.+)/);
    const usernameMatch = envContent.match(/DB_USERNAME=(.+)/);
    const nameMatch = envContent.match(/DB_NAME=(.+)/);
    const portMatch = envContent.match(/DB_PORT=(.+)/);
    
    // Check for direct DATABASE_URL
    const urlMatch = envContent.match(/DATABASE_URL="(.+)"/);
    
    if (hostMatch) dbHost = hostMatch[1];
    if (passwordMatch) dbPassword = passwordMatch[1];
    if (usernameMatch) dbUsername = usernameMatch[1];
    if (nameMatch) dbName = nameMatch[1];
    if (portMatch) dbPort = portMatch[1];
    if (urlMatch) databaseUrl = urlMatch[1];
    
    if ((dbHost && dbPassword) || databaseUrl) {
      console.log('Database configuration found in .env.local');
    }
  }
  
  if (!dbHost && !dbPassword && !databaseUrl) {
    console.log('⚠️ No database configuration found in .env.local');
    
    const rl = createInterface();
    
    // Ask if the user wants to set it up
    const answer = await new Promise<string>(resolve => {
      rl.question('Would you like to set up the database configuration now? (y/n): ', resolve);
    });
    
    if (answer.toLowerCase() !== 'y') {
      rl.close();
      console.log('\n❌ Setup cancelled. Exiting...');
      return;
    }
    
    // Ask configuration method
    const configMethod = await new Promise<string>(resolve => {
      rl.question('\nDo you want to use 1) component-based config or 2) full DATABASE_URL? (1/2): ', resolve);
    });
    
    if (configMethod === '1') {
      // Component-based configuration
      
      // Get Supabase project reference
      const supabaseRef = await new Promise<string>(resolve => {
        rl.question('\nEnter your Supabase project reference (e.g., "abc123" from abc123.supabase.co): ', resolve);
      });
      
      // Construct host
      dbHost = `db.${supabaseRef}.supabase.co`;
      
      // Get password
      dbPassword = await new Promise<string>(resolve => {
        rl.question('\nEnter your database password: ', resolve);
      });
      
      // Optional: get username
      const customUsername = await new Promise<string>(resolve => {
        rl.question(`\nEnter database username (default is "${dbUsername}"): `, resolve);
      });
      if (customUsername) dbUsername = customUsername;
      
      // Optional: get database name
      const customDbName = await new Promise<string>(resolve => {
        rl.question(`\nEnter database name (default is "${dbName}"): `, resolve);
      });
      if (customDbName) dbName = customDbName;
      
      // Optional: get port
      const customPort = await new Promise<string>(resolve => {
        rl.question(`\nEnter database port (default is "${dbPort}"): `, resolve);
      });
      if (customPort) dbPort = customPort;
      
      // Construct DATABASE_URL for testing but save as separate components
      databaseUrl = `postgresql://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
      
      // Ask if user wants to save to .env.local
      const saveAnswer = await new Promise<string>(resolve => {
        rl.question('\nDo you want to save this configuration to .env.local? (y/n): ', resolve);
      });
      
      if (saveAnswer.toLowerCase() === 'y') {
        try {
          // Save components to .env.local
          updateEnvValue(envPath, 'DB_HOST', dbHost);
          updateEnvValue(envPath, 'DB_PASSWORD', dbPassword);
          updateEnvValue(envPath, 'DB_USERNAME', dbUsername);
          updateEnvValue(envPath, 'DB_NAME', dbName);
          updateEnvValue(envPath, 'DB_PORT', dbPort);
          
          console.log('✅ Database configuration saved to .env.local using component-based approach');
        } catch (error) {
          console.error('❌ Failed to save database configuration to .env.local:', error);
        }
      }
    } else {
      // Full DATABASE_URL configuration
      
      // Get Supabase URL
      const supabaseUrl = await new Promise<string>(resolve => {
        rl.question('\nEnter your Supabase project URL (e.g., https://abc123.supabase.co): ', resolve);
      });
      
      // Get password
      const dbPassword = await new Promise<string>(resolve => {
        rl.question('\nEnter your database password: ', resolve);
      });
      
      // Extract host from URL
      let host = '';
      try {
        const url = new URL(supabaseUrl);
        const projectRef = url.hostname.split('.')[0];
        host = `db.${projectRef}.supabase.co`;
      } catch (error) {
        console.error('❌ Invalid Supabase URL format');
        rl.close();
        return;
      }
      
      // Construct the DATABASE_URL
      databaseUrl = `postgresql://postgres:${dbPassword}@${host}:5432/postgres`;
      
      // Ask if user wants to save to .env.local
      const saveAnswer = await new Promise<string>(resolve => {
        rl.question('\nDo you want to save this DATABASE_URL to .env.local? (y/n): ', resolve);
      });
      
      if (saveAnswer.toLowerCase() === 'y') {
        try {
          // Save DATABASE_URL to .env.local
          updateEnvValue(envPath, 'DATABASE_URL', `"${databaseUrl}"`);
          
          console.log('✅ DATABASE_URL saved to .env.local');
        } catch (error) {
          console.error('❌ Failed to save DATABASE_URL to .env.local:', error);
        }
      }
    }
    
    rl.close();
  }
  
  // Display menu
  const rl = createInterface();
  
  console.log('\n🔹 Select an operation:');
  console.log('1) Pull schema from existing database');
  console.log('2) Push schema to database');
  console.log('3) Generate Prisma client');
  console.log('4) Run all operations (pull, generate, push)');
  console.log('5) Exit');
  
  const option = await new Promise<string>(resolve => {
    rl.question('\nEnter option (1-5): ', resolve);
  });
  
  rl.close();
  
  switch (option) {
    case '1':
      runCommand('npx prisma db pull', 'Pulling schema from database');
      break;
      
    case '2':
      runCommand('npx prisma db push', 'Pushing schema to database');
      break;
      
    case '3':
      runCommand('npx prisma generate', 'Generating Prisma client');
      break;
      
    case '4':
      if (runCommand('npx prisma db pull', 'Pulling schema from database')) {
        if (runCommand('npx prisma generate', 'Generating Prisma client')) {
          runCommand('npx prisma db push', 'Pushing schema to database');
        }
      }
      break;
      
    case '5':
      console.log('\n👋 Exiting...');
      break;
      
    default:
      console.log('\n❌ Invalid option. Exiting...');
  }
}

main().catch(e => {
  console.error('❌ Script error:', e);
  process.exit(1);
});
