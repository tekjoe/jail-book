#!/usr/bin/env node

// This script scrapes inmate data from Barron County and saves it to Supabase

require('dotenv').config();
const { scrapeAndSaveBarronInmates } = require('../src/lib/scraper');

async function main() {
  try {
    console.log('Starting Barron County inmate scraping script...');
    await scrapeAndSaveBarronInmates();
    console.log('Barron County inmate scraping completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error in Barron County inmate scraping script:', error);
    process.exit(1);
  }
}

main(); 