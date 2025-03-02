import { NextResponse } from 'next/server';
import { refreshAllInmates, refreshSpecificCounty } from '@/lib/scheduler';

export async function GET(request: Request) {
  try {
    // Get the county parameter from the URL if it exists
    const url = new URL(request.url);
    const county = url.searchParams.get('county');

    // Check for API key (in a real app, use a more secure method)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If county parameter is provided, refresh only that county
    if (county) {
      // Validate county name
      const validCounties = ['Vilas', 'Waukesha', 'Barron', 'Burnett'];
      if (!validCounties.includes(county)) {
        return NextResponse.json({
          success: false,
          message: `Invalid county: ${county}. Valid options are: ${validCounties.join(', ')}`
        }, { status: 400 });
      }

      // Run the refresh process for the specific county
      await refreshSpecificCounty(county);

      return NextResponse.json({
        success: true,
        message: `${county} County refresh completed successfully`
      });
    } else {
      // Run the refresh process for all counties
      await refreshAllInmates();

      return NextResponse.json({
        success: true,
        message: 'Database refresh completed successfully'
      });
    }
  } catch (error) {
    console.error('Error in refresh API route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database refresh failed',
        error: error
      },
      { status: 500 }
    );
  }
} 