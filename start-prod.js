const { spawn } = require('child_process');
const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';

// Start Next.js development server
const nextProcess = spawn('node', [
  path.join('node_modules', 'next', 'dist', 'bin', 'next'),
  'dev',
  '--turbopack'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

// Log any errors
nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js server:', err);
});

// Handle process exit
nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Next.js process exited with code ${code}`);
  }
});

console.log('Starting Next.js in production mode...');
