'use client';

import { useState, useEffect } from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import '../globals.css';

interface Player {
  id: number;
  name: string;
  score: number;
  accuracy?: number;
  average?: number;
  createdAt?: string; // for time filtering later
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sortLabel, setSortLabel] = useState("Best Score");
  const [sortType, setSortType] = useState<"score" | "accuracy" | "average">("score");

  // NEW
  const [timeLabel, setTimeLabel] = useState("All Time");
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all");

  useEffect(() => {
    const loadLeaderboard = async () => {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();

      if (!Array.isArray(data)) return;

      const formatted = data.map((player: any) => ({
        id: player.id,
        name: player.username,
        score: player.score,

        accuracy: player.accuracy ?? null,
        average: player.average ?? null,

        createdAt: player.createdAt ?? new Date().toISOString() // TEMP
      }));

      setPlayers(formatted);
    };

    loadLeaderboard();
  }, []);

  // SORTING
  const applySort = (type: "score" | "accuracy" | "average", label: string) => {
    setSortType(type);
    setSortLabel(label);

    setPlayers((p) =>
      [...p].sort((a, b) => {
        const A = (a as any)[type] ?? 0;
        const B = (b as any)[type] ?? 0;
        return B - A;
      })
    );
  };

  // TIME FILTERING (dummy logic for now)
  const filterByTime = (list: Player[]) => {
    if (timeFilter === "all") return list;

    const now = new Date().getTime();

    return list.filter((p) => {
      const created = new Date(p.createdAt!).getTime();
      const diff = now - created;

      if (timeFilter === "week") return diff <= 7 * 24 * 60 * 60 * 1000;
      if (timeFilter === "month") return diff <= 30 * 24 * 60 * 60 * 1000;
      return true;
    });
  };

  // APPLY TIME FILTER BEFORE TOP 3 + TABLE
  const filtered = filterByTime(players);

  const sorted = [...filtered].sort((a, b) => b.score - a.score);
  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <main className="leaderboard-bg">
      <h1 className="leaderboard-title">LEADERBOARD</h1>

      {/* TOP THREE */}
      <div className="top-three-container">
        {topThree[1] && (
          <div className="top-card top-second">
            <div className="medal">🥈</div>
            <h3>{topThree[1].name}</h3>
            <p>Score: {topThree[1].score}</p>
          </div>
        )}

        {topThree[0] && (
          <div className="top-card top-first">
            <div className="medal">🥇</div>
            <h3>{topThree[0].name}</h3>
            <p>Score: {topThree[0].score}</p>
          </div>
        )}

        {topThree[2] && (
          <div className="top-card top-third">
            <div className="medal">🥉</div>
            <h3>{topThree[2].name}</h3>
            <p>Score: {topThree[2].score}</p>
          </div>
        )}
      </div>

      {/* LEADERBOARD CARD */}
      <div className="leaderboard-card">

        {/* FILTER BAR WITH TWO DROPDOWNS */}
        <div className="filter-bar">

          {/* SORT */}
          <DropdownButton
            id="sort-dropdown"
            title={sortLabel}
            variant="success"
            className="leaderboard-dropdown px-3"
          >
            <Dropdown.Item onClick={() => applySort("score", "Best Score")}>
              Best Score
            </Dropdown.Item>

            <Dropdown.Item onClick={() => applySort("average", "Average Performance")}>
              Average Performance
            </Dropdown.Item>

            <Dropdown.Item onClick={() => applySort("accuracy", "Accuracy")}>
              Accuracy
            </Dropdown.Item>
          </DropdownButton>

          {/* TIME FILTER */}
          <DropdownButton
            id="time-dropdown"
            title={timeLabel}
            variant="secondary"
            className="leaderboard-dropdown px-3 ms-3"
          >
            <Dropdown.Item onClick={() => { setTimeFilter("all"); setTimeLabel("All Time"); }}>
              All Time
            </Dropdown.Item>

            <Dropdown.Item onClick={() => { setTimeFilter("week"); setTimeLabel("Past Week"); }}>
              Past Week
            </Dropdown.Item>

            <Dropdown.Item onClick={() => { setTimeFilter("month"); setTimeLabel("Past Month"); }}>
              Past Month
            </Dropdown.Item>
          </DropdownButton>

        </div>

        {/* TABLE */}
        <Table striped bordered hover responsive="md" className="shadow-sm">
          <thead className="leaderboard-table-head">
            <tr>
              <th>#</th>
              <th>Player</th>

              {sortType === "score" && <th>Best Score</th>}
              {sortType === "accuracy" && <th>Accuracy</th>}
              {sortType === "average" && <th>Average</th>}
            </tr>
          </thead>

          <tbody>
            {rest.map((player, index) => (
              <tr key={player.id}>
                <td>{index + 4}</td>
                <td>{player.name}</td>

                {sortType === "score" && <td>{player.score}</td>}
                {sortType === "accuracy" && <td>{player.accuracy ?? '—'}</td>}
                {sortType === "average" && <td>{player.average ?? '—'}</td>}
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
    </main>
  );
}