'use client';

import { useState, useEffect } from 'react';
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

  // Fetch real leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();

      // Convert API fields to your interface format
      const formatted = data.map((player: any) => ({
        id: player.id,
        name: player.username, // maps username → name
        score: player.score,
      }));

      setPlayers(formatted);
    };

    loadLeaderboard();
  }, []);

  // Track sort direction
  const [sortAsc, setSortAsc] = useState(true);

  const sortByScore = () => {
    const sorted = [...players].sort((a, b) => {
      if (sortAsc) {
        return a.score - b.score;
      }
      return b.score - a.score;
    });

    setPlayers(sorted);
    setSortAsc((prev) => !prev);
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
