import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import prisma from '@/lib/prisma';
/* eslint-disable import/prefer-default-export */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { submissionId } = await req.json();

  if (!submissionId) {
    return NextResponse.json({ error: 'submissionId required' }, { status: 400 });
  }

  const reporter = (session?.user?.email as string | undefined) ?? 'Anonymous';

  try {
    // Get existing reporters list
    const record = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { reporters: true },
    });

    const previous = Array.isArray(record?.reporters) ? record.reporters : [];
    const updated = [...previous, reporter];

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        reportCount: { increment: 1 },
        reporters: updated,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to report' }, { status: 500 });
  }
}
