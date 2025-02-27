#!/usr/bin/env node

/**
 * This script initializes the counties table.
 * It can be run manually or as part of a startup process.
 */

const http = require('http');

// URL to initialize the counties
const url = 'http://localhost:3000/api/counties/init';

console.log(`Initializing counties at ${new Date().toISOString()}`);
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
      console.log('Counties initialization response:', response);
      
      if (response.success) {
        console.log('Counties initialized successfully');
      } else {
        console.error('Failed to initialize counties:', response.message);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error initializing counties:', error.message);
}); 