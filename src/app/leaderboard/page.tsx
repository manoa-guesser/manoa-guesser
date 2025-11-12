'use client';

import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

interface Player {
  id: number;
  name: string;
  score: number;
}

export default function LeaderboardPage() {
  // Mock leaderboard data
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Lawrence', score: 980 },
    { id: 2, name: 'Ava', score: 870 },
    { id: 3, name: 'Noah', score: 940 },
    { id: 4, name: 'Mia', score: 760 },
  ]);

  // Track sort direction
  const [sortAsc, setSortAsc] = useState(true);

  const sortByScore = () => {
    const sorted = [...players].sort((a, b) =>
      sortAsc ? a.score - b.score : b.score - a.score
    );
    setPlayers(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <main className="p-5">
      <h1 className="text-3xl font-bold mb-4 text-center">Leaderboard</h1>
      <div className="d-flex justify-content-center mb-3">
        <Button onClick={sortByScore} variant="primary">
          Sort by Score
          {sortAsc ? '▲' : '▼'}
        </Button>
      </div>

      <Table striped bordered hover responsive="md" className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
