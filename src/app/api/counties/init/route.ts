import { NextResponse } from 'next/server';
import { initializeCounties } from '@/lib/supabase';

export async function GET() {
  try {
    // Check for API key (in a real app, use a more secure method)
    // const apiKey = request.headers.get('x-api-key');
    // if (apiKey !== process.env.API_SECRET_KEY) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Initialize counties
    await initializeCounties();

    return NextResponse.json({
      success: true,
      message: 'Counties initialized successfully'
    });
  } catch (error) {
    console.error('Error in counties initialization API route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Counties initialization failed',
        error: error
      },
      { status: 500 }
    );
  }
} 