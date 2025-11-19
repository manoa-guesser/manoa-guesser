/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const players = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        score: true,
      },
      orderBy: {
        score: 'desc',
      },
    });

    return NextResponse.json(players);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to load leaderboard' },
      { status: 500 },
    );
  }
}
