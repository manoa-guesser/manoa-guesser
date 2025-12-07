import prisma from '@/lib/prisma';
import GamePage from '../../components/GameClientPage';

export const runtime = 'nodejs';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]; // clone first
  let m = arr.length;

  while (m > 0) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }

  return arr;
}

export default async function GamePageWrapper() {
  // Step 1: Fetch only APPROVED IDs
  const ids = await prisma.submission.findMany({
    where: { status: 'APPROVED' },
    select: { id: true },
  });

  const idList = ids.map((x) => x.id);

  if (idList.length < 10) {
    throw new Error('Not enough approved submissions to start a 10-round game.');
  }

  // Step 2: Randomly choose 10 unique IDs
  const selectedIds = shuffle(idList).slice(0, 10);

  // Step 3: Fetch the actual submission records
  const submissions = await prisma.submission.findMany({
    where: { id: { in: selectedIds } },
  });

  return <GamePage submissions={submissions} />;
}
