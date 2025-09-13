// src/app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'analytics-db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { posts: [] }; // Return empty structure if file doesn't exist
    }
    console.error('Error reading analytics DB:', error);
    return { posts: [] };
  }
}

async function writeDb(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to analytics DB:', error);
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    console.log('Received analytics data from Zapier:', newData);

    const db = await readDb();
    
    // Simple logic to add new data. In a real app, you'd have more robust logic.
    db.posts.push(newData);

    await writeDb(db);

    return NextResponse.json({ message: 'Analytics data received and saved successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error processing analytics data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: `Error: ${errorMessage}` }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: `Error: ${errorMessage}` }, { status: 500 });
  }
}
