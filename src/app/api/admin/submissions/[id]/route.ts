import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// Helper: ensure the current user is an ADMIN
async function ensureAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await ensureAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}) as any);

  const status = body.status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined;
  const action = body.action as 'clearReports' | undefined;

  // Handle "clearReports" from the Reported Images section
  if (action === 'clearReports') {
    const updated = await prisma.submission.update({
      where: { id },
      data: {
        reportCount: 0,
        reporters: [], // assumes reporters: Json? in schema
      },
    });

    return NextResponse.json(updated);
  }

  // Handle status update for moderation (approve / reject)
  if (!status) {
    return NextResponse.json({ error: 'Missing status or action' }, { status: 400 });
  }

  const updated = await prisma.submission.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const adminUser = await ensureAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  await prisma.submission.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
