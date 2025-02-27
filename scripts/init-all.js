#!/usr/bin/env node

/**
 * This script initializes both the counties table and the scheduler.
 * It can be run manually or as part of a startup process.
 */

const http = require('http');

// URLs for initialization
const countiesUrl = 'http://localhost:3000/api/counties/init';
const schedulerUrl = 'http://localhost:3000/api/init';
const scrapeUrl = 'http://localhost:3000/api/scrape';

console.log(`Starting initialization at ${new Date().toISOString()}`);

// Initialize counties
console.log(`Initializing counties: ${countiesUrl}`);
http.get(countiesUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Counties initialization response:', response);
      
      if (response.success) {
        console.log('Counties initialized successfully');
        
        // Initialize scheduler after counties are initialized
        initializeScheduler();
      } else {
        console.error('Failed to initialize counties:', response.message);
      }
    } catch (error) {
      console.error('Error parsing counties response:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error initializing counties:', error.message);
  // Try to initialize scheduler anyway
  initializeScheduler();
});

// Function to initialize the scheduler
function initializeScheduler() {
  console.log(`Initializing scheduler: ${schedulerUrl}`);
  http.get(schedulerUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Scheduler initialization response:', response);
        
        if (response.success) {
          console.log('Scheduler initialized successfully');
          
          // Trigger immediate scrape after scheduler is initialized
          triggerScrape();
        } else {
          console.error('Failed to initialize scheduler:', response.message);
        }
      } catch (error) {
        console.error('Error parsing scheduler response:', error);
      }
    });
  }).on('error', (error) => {
    console.error('Error initializing scheduler:', error.message);
  });
}

// Function to trigger immediate scrape
function triggerScrape() {
  console.log(`Triggering immediate scrape: ${scrapeUrl}`);
  http.get(scrapeUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Immediate scrape response:', response);
        
        if (response.success) {
          console.log('Immediate scrape completed successfully');
          console.log('All initialization steps completed successfully');
        } else {
          console.error('Failed to complete immediate scrape:', response.message);
        }
      } catch (error) {
        console.error('Error parsing scrape response:', error);
      }
    });
  }).on('error', (error) => {
    console.error('Error triggering immediate scrape:', error.message);
  });
} 