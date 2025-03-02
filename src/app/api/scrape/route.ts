import { NextResponse } from 'next/server';
import { runImmediateScraping } from '@/lib/scheduler';

export async function GET(request: Request) {
  try {
    // Check for API key (in a real app, use a more secure method)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the scraping process
    await runImmediateScraping();

    return NextResponse.json({ success: true, message: 'Scraping process completed successfully' });
  } catch (error) {
    console.error('Error in scrape API route:', error);
    return NextResponse.json(
      { success: false, message: 'Scraping process failed', error: error },
      { status: 500 }
    );
  }
} 