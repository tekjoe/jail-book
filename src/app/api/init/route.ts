import { NextResponse } from 'next/server';
import { scheduleInmateScraping } from '@/lib/scheduler';

// Flag to track if the scheduler has been initialized
let schedulerInitialized = false;

export async function GET() {
  try {
    // Only initialize the scheduler once
    if (!schedulerInitialized) {
      scheduleInmateScraping();
      schedulerInitialized = true;
      return NextResponse.json({ success: true, message: 'Scheduler initialized successfully' });
    } else {
      return NextResponse.json({ success: true, message: 'Scheduler already initialized' });
    }
  } catch (error) {
    console.error('Error initializing scheduler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize scheduler', error: String(error) },
      { status: 500 }
    );
  }
} 