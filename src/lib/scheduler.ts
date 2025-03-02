import cron from 'node-cron';
import { scrapeAndSaveVilasInmates, scrapeAndSaveWaukeshaInmates, scrapeAndSaveBarronInmates, scrapeAndSaveBurnettInmates } from './scraper';
import { deleteAllInmates } from './supabase';

/**
 * Deletes all inmates and then scrapes and saves new data
 */
export async function refreshAllInmates(): Promise<void> {
  console.log(`Starting complete inmate refresh at ${new Date().toISOString()}`);

  try {
    // First delete all existing inmates
    await deleteAllInmates();

    // Then scrape and save new data
    await scrapeAndSaveVilasInmates();
    await scrapeAndSaveWaukeshaInmates();
    await scrapeAndSaveBarronInmates();
    await scrapeAndSaveBurnettInmates();

    console.log('Complete inmate refresh completed successfully');
  } catch (error) {
    console.error('Error in refreshAllInmates:', error);
    throw error;
  }
}

export async function refreshSpecificCounty(county: string): Promise<void> {
  console.log(`Starting ${county} County inmate refresh at ${new Date().toISOString()}`);
  if (county === 'Burnett') {
    await scrapeAndSaveBurnettInmates();
  } else if (county === 'Vilas') {
    await scrapeAndSaveVilasInmates();
  } else if (county === 'Waukesha') {
    await scrapeAndSaveWaukeshaInmates();
  } else if (county === 'Barron') {
    await scrapeAndSaveBarronInmates();
  } else {
    console.error(`Invalid county: ${county}`);
    throw new Error(`Invalid county: ${county}`);
  }
}

/**
 * Schedules the inmate scraping job to run at 8:00 AM CST daily
 */
export function scheduleInmateScraping(): void {
  // Schedule the job to run at 8:00 AM CST (14:00 UTC)
  // The cron expression is: minute hour day-of-month month day-of-week
  cron.schedule('0 8 * * *', async () => {
    console.log(`Running scheduled inmate scraping job at ${new Date().toISOString()}`);
    try {
      // Use the new refresh function instead of individual scrape functions
      await refreshAllInmates();
      console.log('Scheduled inmate scraping completed successfully');
    } catch (error) {
      console.error('Error in scheduled inmate scraping:', error);
    }
  }, {
    scheduled: true,
    timezone: 'America/Chicago' // CST timezone
  });

  console.log('Inmate scraping job scheduled to run at 8:00 AM CST daily');
}

/**
 * Runs the inmate scraping job immediately
 */
export async function runImmediateScraping(): Promise<void> {
  console.log(`Running immediate inmate scraping job at ${new Date().toISOString()}`);

  try {
    // Use the new refresh function instead of individual scrape functions
    await refreshAllInmates();
    console.log('Immediate inmate scraping completed successfully');
  } catch (error) {
    console.error('Error in immediate inmate scraping:', error);
    throw error;
  }
} 