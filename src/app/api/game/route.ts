import prisma from '@/lib/prisma';

function shuffle<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  try {
    // Get all APPROVED IDs
    const ids = await prisma.submission.findMany({
      where: { status: 'APPROVED' },
      select: { id: true },
    });

    const idList = ids.map((x) => x.id);

    if (idList.length < 10) {
      return Response.json(
        { error: 'Not enough approved submissions for a 10-round game.' },
        { status: 400 },
      );
    }

    const selectedIds = shuffle(idList).slice(0, 10);

    // console.log('Selected Submission IDs for Game:', selectedIds);

    const submissions = await prisma.submission.findMany({
      where: { id: { in: selectedIds } },
    });
    // console.log('Selected Submissions for Game:', submissions);

    const ordered = selectedIds.map(id => submissions.find(s => s.id === id));
    // console.log('Ordering Submissions for Game:', ordered);

    return Response.json(ordered);
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
