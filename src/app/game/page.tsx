import prisma from '@/lib/prisma';
import { Submission } from '@prisma/client';
import GamePage from '../../components/GameClientPage';

export default async function GamePageWrapper() {
  const submissions = await prisma.$queryRaw<Submission[]>`
    SELECT * FROM "Submission"
    WHERE status = 'APPROVED'
    ORDER BY RANDOM()
    LIMIT ${10};
  `;

  return <GamePage submissions={submissions} />;
}
