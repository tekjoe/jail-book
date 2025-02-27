#!/usr/bin/env node

/**
 * This script starts the Next.js application and initializes the scheduler and counties.
 * It's intended for production use.
 */

const { spawn } = require('child_process');
const path = require('path');

// Start the Next.js application
console.log('Starting Next.js application...');
const nextProcess = spawn('npm', ['run', 'start'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js application:', error);
  process.exit(1);
});

// Wait for the application to start before initializing
console.log('Waiting for application to start before initializing services...');
setTimeout(() => {
  // Initialize the scheduler
  console.log('Initializing scheduler...');
  const initSchedulerProcess = spawn('node', [path.join(__dirname, 'init-scheduler.js')], {
    stdio: 'inherit',
    shell: true
  });

  initSchedulerProcess.on('error', (error) => {
    console.error('Failed to initialize scheduler:', error);
  });
  
  // Initialize the counties
  console.log('Initializing counties...');
  const initCountiesProcess = spawn('node', [path.join(__dirname, 'init-counties.js')], {
    stdio: 'inherit',
    shell: true
  });

  initCountiesProcess.on('error', (error) => {
    console.error('Failed to initialize counties:', error);
  });
}, 10000); // Wait 10 seconds for the app to start

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  nextProcess.kill('SIGTERM');
  process.exit(0);
}); 