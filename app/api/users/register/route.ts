import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCollection } from '@/lib/db';
import type { Document } from 'mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type UserDoc = Document & {
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const users = await getCollection<UserDoc>('users');

    // Uniqueness checks
    const existing = await users.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email or username already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await users.insertOne({
      email,
      username,
      passwordHash,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      user: { _id: result.insertedId, email, username },
    });
  } catch (error: any) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Register failed' },
      { status: 500 }
    );
  }
}
