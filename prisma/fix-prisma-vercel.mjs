#!/usr/bin/env node

/**
 * Prisma Vercel Deployment Fix
 * 
 * This script is specifically designed to fix issues with Prisma Client generation in Vercel deployments.
 * It handles various edge cases and ensures that Prisma generates correctly in all environments.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Set up logging
const log = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`)
};

// Check if we're in Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
log.info(`Running in Vercel environment: ${isVercel ? 'Yes' : 'No'}`);

// Check Prisma schema
const schemaPath = join(rootDir, 'prisma', 'schema.prisma');
if (!existsSync(schemaPath)) {
  log.error(`Prisma schema not found at: ${schemaPath}`);
  process.exit(1);
}
log.success(`Found Prisma schema at: ${schemaPath}`);

// Function to run a command and handle errors
function runCommand(command) {
  try {
    log.info(`Running: ${command}`);
    const result = execSync(command, { 
      cwd: rootDir,
      stdio: 'pipe', 
      encoding: 'utf8',
      env: { ...process.env }
    });
    log.success(`Command completed successfully`);
    return { success: true, output: result };
  } catch (error) {
    log.error(`Command failed: ${error.message}`);
    if (error.stdout) log.info(`Command stdout: ${error.stdout}`);
    if (error.stderr) log.error(`Command stderr: ${error.stderr}`);
    return { success: false, error, output: error.stdout || '' };
  }
}

// Try direct npm approach first
log.info('Attempting direct npx prisma generate...');
const npxResult = runCommand('npx prisma generate');

if (npxResult.success) {
  log.success('Prisma client generated successfully using npx!');
  process.exit(0);
}

// If npx approach fails, try the postinstall script
log.info('npx approach failed, trying direct postinstall script...');
try {
  // We're using dynamic import because we're in ESM
  const postinstallPath = join(rootDir, 'node_modules', '@prisma', 'client', 'scripts', 'postinstall.js');
  if (existsSync(postinstallPath)) {
    log.info(`Found postinstall script at: ${postinstallPath}`);
    
    // We'll create a small script to run this
    const tempScriptPath = join(rootDir, 'prisma', 'temp-postinstall-runner.cjs');
    writeFileSync(tempScriptPath, `
      try {
        console.log('Running Prisma postinstall directly...');
        require('@prisma/client/scripts/postinstall');
        console.log('Prisma postinstall completed successfully');
      } catch (error) {
        console.error('Error in postinstall:', error);
        process.exit(1);
      }
    `);
    
    const postinstallResult = runCommand(`node ${tempScriptPath}`);
    
    if (postinstallResult.success) {
      log.success('Prisma client generated successfully using postinstall script!');
      process.exit(0);
    }
  } else {
    log.error(`Postinstall script not found at: ${postinstallPath}`);
  }
} catch (error) {
  log.error(`Error trying postinstall approach: ${error.message}`);
}

// Last resort: try to use prisma directly from node_modules
log.info('Trying direct node_modules/.bin/prisma approach...');
const directPrismaBin = join(rootDir, 'node_modules', '.bin', 'prisma');
if (existsSync(directPrismaBin)) {
  log.info(`Found Prisma binary at: ${directPrismaBin}`);
  const directResult = runCommand(`${directPrismaBin} generate`);
  
  if (directResult.success) {
    log.success('Prisma client generated successfully using direct binary!');
    process.exit(0);
  }
} else {
  log.error(`Direct Prisma binary not found at: ${directPrismaBin}`);
}

// If we got here, all approaches failed
log.error('All Prisma generation approaches failed!');

// Let's check if Prisma is installed correctly
log.info('Checking Prisma installation...');
const nodeModulesPrisma = join(rootDir, 'node_modules', 'prisma');
const nodeModulesPrismaClient = join(rootDir, 'node_modules', '@prisma', 'client');

if (!existsSync(nodeModulesPrisma)) {
  log.error(`Prisma not found in node_modules: ${nodeModulesPrisma}`);
} else {
  log.success(`Prisma found in node_modules!`);
}

if (!existsSync(nodeModulesPrismaClient)) {
  log.error(`@prisma/client not found in node_modules: ${nodeModulesPrismaClient}`);
} else {
  log.success(`@prisma/client found in node_modules!`);
}

// Final attempt: reinstall Prisma
log.info('Attempting to reinstall Prisma as a last resort...');
const reinstallResult = runCommand('npm install prisma @prisma/client --no-save');

if (reinstallResult.success) {
  log.info('Prisma reinstalled, trying generation one more time...');
  const finalResult = runCommand('npx prisma generate');
  
  if (finalResult.success) {
    log.success('Prisma client generated successfully after reinstallation!');
    process.exit(0);
  }
}

log.error('Failed to generate Prisma client after all attempts.');
log.warn('The build will continue, but the application may not work correctly.');
log.warn('Please check the database configuration and try again.');

// We don't exit with an error code so the build can continue and potentially use fallbacks
process.exit(0);
