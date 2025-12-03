import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export default async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { submissionId } = await req.json();

  if (!submissionId) {
    return NextResponse.json({ error: 'submissionId required' }, { status: 400 });
  }

  const reporter = (session?.user?.email as string | undefined) ?? 'Anonymous';

  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { reporters: true },
    });

    const previousReporters: string[] = Array.isArray(submission?.reporters) ? submission!.reporters : [];

    const updatedReporters = [...previousReporters, reporter];

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        reportCount: { increment: 1 },
        reporters: updatedReporters,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Report error:', e);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
