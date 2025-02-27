import { NextResponse } from 'next/server';
import { getCounties } from '@/lib/supabase';

export async function GET() {
  try {
    // Get all counties
    const counties = await getCounties();

    return NextResponse.json({
      success: true,
      counties
    });
  } catch (error) {
    console.error('Error in counties API route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch counties',
        error: error
      },
      { status: 500 }
    );
  }
} 