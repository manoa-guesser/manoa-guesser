/* eslint-disable import/prefer-default-export */

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // disable ISR caching
export const fetchCache = 'force-no-store';

export async function GET() {
  const users = await prisma.user.findMany({
    include: { scores: true },
  });

  const formatted = users.map((u) => {
    const scores = u.scores.map((s) => s.value);

    const best = scores.length ? Math.max(...scores) : 0;
    const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const accuracy = scores.length ? (scores.filter((v) => v > 0).length / scores.length) * 100 : 0;

    const createdAt = u.scores[0]?.createdAt ?? null;

    return {
      id: u.id,
      username: u.username,
      score: best,
      average,
      accuracy,
      createdAt,
    };
  });

  return NextResponse.json(formatted);
}
