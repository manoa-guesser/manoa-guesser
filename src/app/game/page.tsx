import prisma from '@/lib/prisma';
// import GamePage from '../components/GameClientPage';
import GamePage from '../../components/GameClientPage';

export default async function GamePageWrapper() {
  const submissions = await prisma.submission.findMany({
    orderBy: { id: 'asc' }, // optional
  });

  return <GamePage submissions={submissions} />;
}
