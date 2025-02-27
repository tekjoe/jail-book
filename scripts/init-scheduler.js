#!/usr/bin/env node

/**
 * This script initializes the inmate scraping scheduler.
 * It can be run manually or as part of a startup process.
 */

const http = require('http');

// URL to initialize the scheduler
const url = 'http://localhost:3000/api/init';

console.log(`Initializing scheduler at ${new Date().toISOString()}`);
console.log(`Sending request to: ${url}`);

// Send a GET request to the init endpoint
http.get(url, (res) => {
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
      } else {
        console.error('Failed to initialize scheduler:', response.message);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error initializing scheduler:', error.message);
});

// Also trigger an immediate scrape
const scrapeUrl = 'http://localhost:3000/api/scrape';
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
      } else {
        console.error('Failed to complete immediate scrape:', response.message);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error triggering immediate scrape:', error.message);
}); 