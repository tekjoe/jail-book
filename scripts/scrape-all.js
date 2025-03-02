#!/usr/bin/env node

// This script scrapes inmate data from all supported counties and saves it to Supabase

require('dotenv').config();
const { 
  scrapeAndSaveVilasInmates, 
  scrapeAndSaveWaukeshaInmates, 
  scrapeAndSaveBarronInmates,
  scrapeAndSaveBurnettInmates
} = require('../src/lib/scraper');

async function main() {
  try {
    console.log('Starting all counties inmate scraping script...');
    
    console.log('\n--- Vilas County ---');
    await scrapeAndSaveVilasInmates();
    
    console.log('\n--- Waukesha County ---');
    await scrapeAndSaveWaukeshaInmates();
    
    console.log('\n--- Barron County ---');
    await scrapeAndSaveBarronInmates();
    
    console.log('\n--- Burnett County ---');
    await scrapeAndSaveBurnettInmates();
    
    console.log('\nAll counties inmate scraping completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error in all counties inmate scraping script:', error);
    process.exit(1);
  }
}

main(); 