'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import '../globals.css';

const TIME_LIMITS = {
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
} as const;

interface Player {
  id: number;
  name: string;
  score: number;
  average?: number | null;
  createdAt?: string | null;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sortType, setSortType] = useState<'score' | 'average'>('score');
  const [sortLabel, setSortLabel] = useState('Best Score');

  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [timeLabel, setTimeLabel] = useState('All Time');

  // -------------------------------
  // Load leaderboard data
  // -------------------------------
  useEffect(() => {
    async function load() {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json();

      if (!Array.isArray(data)) return;

      setPlayers(
        data.map((p: any) => ({
          id: p.id,
          name: p.username,
          score: p.score,
          average: p.average != null ? Math.round(p.average) : null,
          createdAt: p.createdAt ?? null,
        })),
      );
    }

    load();
  }, []);

  // -------------------------------
  // Time filter logic (clean + compact)
  // -------------------------------

  const filtered = useMemo(() => {
    if (timeFilter === 'all') return players;

    const now = Date.now();
    const limit = TIME_LIMITS[timeFilter];

    return players.filter((p) => {
      if (!p.createdAt) return false;
      return now - new Date(p.createdAt).getTime() <= limit;
    });
  }, [players, timeFilter]);

  // -------------------------------
  // Sorting logic (centralized)
  // -------------------------------
  const sorted = useMemo(
    () => [...filtered].sort((a, b) => {
      const A = a[sortType] ?? 0;
      const B = b[sortType] ?? 0;
      return B - A;
    }),
    [filtered, sortType],
  );
  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // -------------------------------
  // Helper functions
  // -------------------------------
  const getRankClass = (i: number) => {
    if (i === 0) return 'top-first';
    if (i === 1) return 'top-second';
    return 'top-third';
  };

  const getMedal = (i: number) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    return '🥉';
  };

  const handleSort = (type: 'score' | 'average', label: string) => {
    setSortType(type);
    setSortLabel(label);
  };

  const handleTime = (filter: 'all' | 'week' | 'month', label: string) => {
    setTimeFilter(filter);
    setTimeLabel(label);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <main className="leaderboard-bg confetti-wrapper">
      <div className="confetti-left" />
      <div className="confetti-right" />

      <h1 className="leaderboard-title">LEADERBOARD</h1>

      {/* TOP THREE */}
      <div className="top-three-container">
        {topThree.map((p, i) => (
          <div key={p.id} className={`top-card ${getRankClass(i)}`}>
            <div className="medal">{getMedal(i)}</div>
            <h3>{p.name}</h3>

            {sortType === 'score' && (
              <p>
                Score:
                <strong>
                  {p.score}
                </strong>
              </p>
            )}

            {sortType === 'average' && (
              <p>
                Average:
                <strong>
                  {p.average ?? '—'}
                </strong>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MAIN TABLE */}
      <div className="leaderboard-card">
        <div className="filter-bar">
          <DropdownButton title={sortLabel} variant="success">
            <Dropdown.Item onClick={() => handleSort('score', 'Best Score')}>
              Best Score
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort('average', 'Best Average')}>
              Best Average
            </Dropdown.Item>
          </DropdownButton>

          <DropdownButton title={timeLabel} variant="secondary" className="ms-3">
            <Dropdown.Item onClick={() => handleTime('all', 'All Time')}>
              All Time
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleTime('week', 'Past Week')}>
              Past Week
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleTime('month', 'Past Month')}>
              Past Month
            </Dropdown.Item>
          </DropdownButton>
        </div>

        <Table striped bordered hover responsive="md" className="shadow-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>{sortType === 'score' ? 'Best Score' : 'Average'}</th>
            </tr>
          </thead>

          <tbody>
            {rest.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 4}</td>
                <td>{p.name}</td>
                <td>{sortType === 'score' ? p.score : p.average ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
