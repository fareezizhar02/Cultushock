import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully!',
      database: db.databaseName,
      collections: collections.map(c => c.name),
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}