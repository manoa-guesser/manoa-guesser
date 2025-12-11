'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import '../globals.css';

interface Player {
  id: number;
  name: string;
  score: number;
  average?: number | null;
  createdAt?: string | null;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sortLabel, setSortLabel] = useState('Best Score');
  const [sortType, setSortType] = useState<'score' | 'average'>('score');

  const [timeLabel, setTimeLabel] = useState('All Time');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  // ===============================
  // LOAD LEADERBOARD DATA
  // ===============================
  useEffect(() => {
    const loadLeaderboard = async () => {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json();

      if (!Array.isArray(data)) return;

      const formatted: Player[] = data.map((player: any) => ({
        id: player.id,
        name: player.username,
        score: player.score,

        // Clamp average to whole number
        average:
          player.average !== null && player.average !== undefined
            ? Math.round(player.average)
            : null,

        createdAt: player.createdAt ?? null,
      }));

      setPlayers(formatted);
    };

    loadLeaderboard();
  }, []);

  // ===============================
  // SORTING LOGIC
  // ===============================
  const applySort = useCallback((type: 'score' | 'average', label: string) => {
    setSortType(type);
    setSortLabel(label);

    setPlayers(prev => [...prev].sort((a, b) => {
      const A = (a as any)[type] ?? 0;
      const B = (b as any)[type] ?? 0;
      return B - A;
    }));
  }, []);

  // ===============================
  // DATE FILTERING
  // ===============================
  const filterByTime = useCallback(
    (list: Player[]) => {
      if (timeFilter === 'all') return list;

      const now = Date.now();
      const weekMs = 7 * 24 * 60 * 60 * 1000;
      const monthMs = 30 * 24 * 60 * 60 * 1000;

      return list.filter(player => {
        if (!player.createdAt) return false;

        const createdTime = new Date(player.createdAt).getTime();
        const diff = now - createdTime;

        if (timeFilter === 'week') return diff <= weekMs;
        if (timeFilter === 'month') return diff <= monthMs;
        return true;
      });
    },
    [timeFilter],
  );

  // ===============================
  // APPLY FILTER + SORT
  // ===============================
  const filtered = filterByTime(players);

  const sorted = [...filtered].sort((a, b) => {
    const A = (a as any)[sortType] ?? 0;
    const B = (b as any)[sortType] ?? 0;
    return B - A;
  });

  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // ===============================
  // RANK CARD HELPERS (no nested ternaries)
  // ===============================
  const getRankClass = (index: number) => {
    if (index === 0) return 'top-first';
    if (index === 1) return 'top-second';
    return 'top-third';
  };

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    return '🥉';
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <main className="leaderboard-bg">
      <h1 className="leaderboard-title">LEADERBOARD</h1>

      {/* TOP THREE DISPLAY */}
      <div className="top-three-container">
        {topThree.map((player, index) => (
          <div key={player.id} className={`top-card ${getRankClass(index)}`}>
            <div className="medal">{getMedal(index)}</div>

            <h3>{player.name}</h3>

            {sortType === 'score' && (
              <p>
                Score:
                <strong>{player.score}</strong>
              </p>
            )}

            {sortType === 'average' && (
              <p>
                Average:
                <strong>{player.average ?? '—'}</strong>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="leaderboard-card">
        <div className="filter-bar">
          {/* SORT DROPDOWN */}
          <DropdownButton id="sort-dropdown" title={sortLabel} variant="success">
            <Dropdown.Item onClick={() => applySort('score', 'Best Score')}>
              Best Score
            </Dropdown.Item>
            <Dropdown.Item onClick={() => applySort('average', 'Best Average')}>
              Best Average
            </Dropdown.Item>
          </DropdownButton>

          {/* TIME DROPDOWN */}
          <DropdownButton
            id="time-dropdown"
            title={timeLabel}
            variant="secondary"
            className="ms-3"
          >
            <Dropdown.Item onClick={() => { setTimeFilter('all'); setTimeLabel('All Time'); }}>
              All Time
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setTimeFilter('week'); setTimeLabel('Past Week'); }}>
              Past Week
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setTimeFilter('month'); setTimeLabel('Past Month'); }}>
              Past Month
            </Dropdown.Item>
          </DropdownButton>
        </div>

        {/* TABLE DATA */}
        <Table striped bordered hover responsive="md" className="shadow-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>

              {sortType === 'score' && <th>Best Score</th>}
              {sortType === 'average' && <th>Average</th>}
            </tr>
          </thead>

          <tbody>
            {rest.map((player, index) => (
              <tr key={player.id}>
                <td>{index + 4}</td>
                <td>{player.name}</td>

                {sortType === 'score' && <td>{player.score}</td>}
                {sortType === 'average' && <td>{player.average ?? '—'}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </main>
  );
}
