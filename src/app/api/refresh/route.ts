import { NextResponse } from 'next/server';
import { refreshAllInmates } from '@/lib/scheduler';

export async function GET() {
  try {
    // Check for API key (in a real app, use a more secure method)
    // const apiKey = request.headers.get('x-api-key');
    // if (apiKey !== process.env.API_SECRET_KEY) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Run the refresh process
    await refreshAllInmates();

    return NextResponse.json({
      success: true,
      message: 'Database refresh completed successfully'
    });
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