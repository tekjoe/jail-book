import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import pdf from 'pdf-parse';
import pdf_table_extractor from 'pdf-table-extractor';
import { Inmate, saveInmates } from './supabase';

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}


// URL for Vilas County Sheriff's services page
const VILAS_SERVICES_URL = 'https://www.vilascountysheriff.org/services';
const WAUKESHA_INMATES_PDF = 'https://src.waukeshacounty.gov/page/Internet%20Inmate%20Information.pdf';

/**
 * Downloads the inmate PDF from Vilas County Sheriff's website
 * @returns Path to the downloaded PDF file
 */
export async function downloadVilasPDF(): Promise<string> {
  try {
    console.log('Launching browser to scrape Vilas County inmate list...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the services page
    await page.goto(VILAS_SERVICES_URL);

    await delay(1000);


    // Find the link with text "Current Inmate List"
    const linkElement = await page.$("#comp-j9zy5x1z a.wixui-rich-text__text");

    console.log(linkElement);

    if (!linkElement) {
      throw new Error('Could not find "Current Inmate List" link on the page');
    }

    // Get the href attribute from the link
    const href = await page.evaluate((el: Element) => {
      return (el as HTMLAnchorElement).href;
    }, linkElement);

    // Close the browser
    await browser.close();

    // Download the PDF
    console.log(`Downloading PDF from: ${href}`);
    const response = await axios({
      method: 'GET',
      url: href,
      responseType: 'arraybuffer'
    });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save the PDF to a file
    const pdfPath = path.join(tempDir, `vilas_inmates_${new Date().toISOString().split('T')[0]}.pdf`);
    fs.writeFileSync(pdfPath, response.data);

    console.log(`PDF downloaded and saved to: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error('Error downloading Vilas County PDF:', error);
    throw error;
  }
}

/**
 * Downloads the inmate PDF from Vilas County Sheriff's website
 * @returns Path to the downloaded PDF file
 */
export async function downloadWaukeshaPDF(): Promise<string> {
  try {
    console.log('Downloading Waukesha County inmate list...');

    // Download the PDF
    console.log(`Downloading PDF from: ${WAUKESHA_INMATES_PDF}`);
    const response = await axios({
      method: 'GET',
      url: WAUKESHA_INMATES_PDF,
      responseType: 'arraybuffer'
    });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save the PDF to a file
    const pdfPath = path.join(tempDir, `waukesha_inmates_${new Date().toISOString().split('T')[0]}.pdf`);
    fs.writeFileSync(pdfPath, response.data);

    console.log(`PDF downloaded and saved to: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error('Error downloading Waukesha County PDF:', error);
    throw error;
  }

}

/**
 * Parses the inmate PDF and extracts inmate names
 * @param pdfPath Path to the PDF file
 * @returns Array of inmates with first and last names
 */
export async function parseWaukeshaInmatePDF(pdfPath: string): Promise<Omit<Inmate, 'id' | 'created_at'>[]> {
  try {
    console.log(`Parsing PDF: ${pdfPath}`);
    // Use pdf-table-extractor to extract tables from the PDF
    return new Promise((resolve, reject) => {
      pdf_table_extractor(pdfPath, (result: any) => {
        try {
          // Extract tables from the result
          const pageTables = result.pageTables;

          // Process the tables to extract inmate information
          const inmates: Omit<Inmate, 'id' | 'created_at'>[] = [];

          // Iterate through each page's tables
          for (const page of pageTables) {
            for (const row of page.tables) {
              // Each row is an array with [lastName, firstName, location]
              if (row.length >= 2 && row[0] && row[1]) {
                const lastName = row[0].trim().replace(/\n/g, '').charAt(0).toUpperCase() + row[0].trim().replace(/\n/g, '').slice(1).toLowerCase();
                const firstName = row[1].trim().replace(/\n/g, '').charAt(0).toUpperCase() + row[1].trim().replace(/\n/g, '').slice(1).toLowerCase();

                // Only add if we have both names
                if (lastName && firstName) {
                  inmates.push({
                    last_name: lastName,
                    first_name: firstName,
                    county: 'Waukesha'
                  });
                }
              }
            }
          }

          console.log(`Extracted ${inmates.length} inmates from the PDF`);
          resolve(inmates);
        } catch (error) {
          console.error('Error processing PDF tables:', error);
          reject(error);
        }
      }, (error: any) => {
        console.error('Error extracting tables from PDF:', error);
        reject(error);
      });
    });

  } catch (error) {
    console.error('Error parsing inmate PDF:', error);
    throw error;
  }
}

/**
 * Main function to scrape and save Waukesha County inmates
 */
export async function scrapeAndSaveWaukeshaInmates(): Promise<void> {
  try {
    console.log('Starting Waukesha County inmate scraping process...');

    // Download the PDF
    const pdfPath = await downloadWaukeshaPDF();

    // Parse the PDF
    const inmates = await parseWaukeshaInmatePDF(pdfPath);

    // Save inmates to Supabase
    await saveInmates(inmates);

    console.log('Waukesha County inmate scraping completed successfully');
  } catch (error) {
    console.error('Error in scrapeAndSaveWaukeshaInmates:', error);
    throw error;
  }
}


/**
 * Parses the inmate PDF and extracts inmate names
 * @param pdfPath Path to the PDF file
 * @returns Array of inmates with first and last names
 */
export async function parseVilasInmatePDF(pdfPath: string): Promise<Omit<Inmate, 'id' | 'created_at'>[]> {
  try {
    console.log(`Parsing PDF: ${pdfPath}`);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    // Extract text from PDF
    const text = data.text;

    // Extract names using regex pattern for "Name: Last, First"
    const nameRegex = /Name:\s+([^,]+),\s+(\S+)/g;
    const matches = [...text.matchAll(nameRegex)];

    const inmates: Omit<Inmate, 'id' | 'created_at'>[] = matches.map(match => ({
      last_name: match[1].trim(),
      first_name: match[2].trim().replace("Name", ""),
      county: 'Vilas'
    }));

    console.log(`Extracted ${inmates.length} inmates from the PDF`);
    return inmates;
  } catch (error) {
    console.error('Error parsing inmate PDF:', error);
    throw error;
  }
}

/**
 * Main function to scrape and save Vilas County inmates
 */
export async function scrapeAndSaveVilasInmates(): Promise<void> {
  try {
    console.log('Starting Vilas County inmate scraping process...');

    // Download the PDF
    const pdfPath = await downloadVilasPDF();

    // Parse the PDF
    const inmates = await parseVilasInmatePDF(pdfPath);

    // Log the inmates data before saving
    console.log(`Found ${inmates.length} inmates to save:`, JSON.stringify(inmates.slice(0, 3), null, 2));

    // Save inmates to Supabase
    await saveInmates(inmates);

    console.log('Vilas County inmate scraping completed successfully');
  } catch (error) {
    console.error('Error in scrapeAndSaveVilasInmates:', error);
    throw error;
  }
} 