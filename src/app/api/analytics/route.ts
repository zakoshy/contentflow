// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received analytics data from Zapier:', data);

    // In a real app, you would save this data to a database.
    // For now, we'll just log it and return a success response.

    return NextResponse.json({ message: 'Analytics data received successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error processing analytics data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: `Error: ${errorMessage}` }, { status: 500 });
  }
}
