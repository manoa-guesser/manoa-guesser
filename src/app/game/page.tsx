import GamePage from '../../components/GameClientPage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function GamePageWrapper() {
  return <GamePage />;
}
