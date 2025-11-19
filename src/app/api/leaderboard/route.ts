/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma
  || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function GET(): Promise<NextResponse> {
  const players = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      score: true,
    },
    orderBy: { score: 'desc' },
  });

  return NextResponse.json(players);
}
