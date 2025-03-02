#!/usr/bin/env node

// This script scrapes inmate data from Burnett County and saves it to Supabase

require('dotenv').config();
require('ts-node').register();
const { scrapeAndSaveBurnettInmates } = require('../dist/lib/scraper');

async function main() {
  try {
    console.log('Starting Burnett County inmate scraping script...');
    await scrapeAndSaveBurnettInmates();
    console.log('Burnett County inmate scraping completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error in Burnett County inmate scraping script:', error);
    process.exit(1);
  }
}

main(); 