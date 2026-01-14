import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: `Database seeded successfully with ${result.count} products`,
      count: result.count,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}