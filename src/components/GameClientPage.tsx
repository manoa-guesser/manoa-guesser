'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button, Card, Col, Container, Form, Row, ProgressBar } from 'react-bootstrap';
import swal from 'sweetalert';
import dynamic from 'next/dynamic';
import { Submission } from '@prisma/client';

const GAME_TIME = 20;
const STREAK_BONUS_POINTS = 25;

const LeafletMap = dynamic(() => import('@/components/GameMap'), {
  ssr: false,
});

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function scoreFromDistance(distanceMeters: number): number {
  if (distanceMeters < 10) return 100;
  if (distanceMeters < 30) return 75;
  if (distanceMeters < 60) return 50;
  if (distanceMeters < 100) return 25;
  return 0;
}

function formatSubmissions(subs: Submission[]) {
  return subs.map((s) => {
    const [latStr, lngStr] = s.location.split(',').map((v) => v.trim());
    return {
      id: s.id,
      imageUrl: s.imageUrl,
      correctAnswer: s.location,
      hint: s.caption,
      submittedBy: s.submittedBy,
      lat: parseFloat(latStr),
      lng: parseFloat(lngStr),
    };
  });
}

const GamePage = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<[number, number] | null>(null);

  const [streak, setStreak] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const endGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      swal('Game Over!', `Your final score:\n ${finalScore} / ${questions.length * 100}`, 'info', { timer: 5000 });
    },
    [questions.length],
  );

  const handleTimeUp = useCallback(() => {
    setStreak(0);
    setStreakBonus(0);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(GAME_TIME);
      setShowHint(false);
    } else {
      endGame(score);
    }
  }, [currentQuestionIndex, score, endGame, questions.length]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return GAME_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameStarted, isGameOver, handleTimeUp]);

  const startGame = async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();

      if (!res.ok) {
        swal('Error', data.error || 'Could not start new game', 'error');
        return;
      }

      setQuestions(formatSubmissions(data));

      setIsGameStarted(true);
      setIsGameOver(false);
      setCurrentQuestionIndex(0);
      setScore(0);
      setTimer(GAME_TIME);
      setStreak(0);
      setStreakBonus(0);
      setSelectedLatLng(null);
      setShowHint(false);
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to load a new game.', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLatLng) {
      swal('No guess', 'Please drop a pin on the map!', 'warning');
      return;
    }

    const [guessLat, guessLng] = selectedLatLng;

    const distance = getDistanceMeters(guessLat, guessLng, currentQuestion.lat, currentQuestion.lng);
    const roundScore = scoreFromDistance(distance);

    let bonus = 0;
    let newStreak = streak;

    if (roundScore > 0) {
      newStreak = streak + 1;
      bonus = newStreak >= 2 ? (newStreak - 1) * STREAK_BONUS_POINTS : 0;

      setStreak(newStreak);
      setStreakBonus(bonus);
    } else {
      setStreak(0);
      setStreakBonus(0);
    }

    const totalRoundScore = roundScore + bonus;
    const newScore = score + totalRoundScore;

    setScore(newScore);

    swal({
      title: `Distance:\n ${distance.toFixed(1)} meters`,
      text: `You earned ${roundScore} points${bonus ? ` + ${bonus} streak bonus` : ''}`,
      icon: roundScore > 0 ? 'success' : 'error',
      timer: 5000,
    });

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedLatLng(null);
      setTimer(GAME_TIME);
      setShowHint(false);
    } else {
      endGame(newScore);
    }
  };

  if (isGameStarted && questions.length === 0) {
    return <div className="text-center mt-5" style={{ color: 'white' }}>Loading game...</div>;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-3 hero-title">Manoa Guesser</Card.Title>

              {!isGameStarted || isGameOver ? (
                <div className="text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={startGame}
                    style={{
                      backgroundColor: '#1e6f43',
                      borderColor: '#1e6f43',
                    }}
                  >
                    Start Game
                  </Button>

                  {isGameOver && (
                    <div className="mt-3">
                      <div>Your last score:</div>
                      <strong>
                        {score}
                        /
                        {questions.length * 100}
                      </strong>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-center mb-2">
                    <div
                      style={{
                        backgroundColor: streak ? '#ffe08a' : '#eee',
                        padding: '6px 16px',
                        borderRadius: '999px',
                        fontWeight: 'bold',
                        border: '1px solid #ccc',
                        boxShadow: streak >= 3 ? '0 0 8px rgba(255,140,0,0.6)' : undefined,
                      }}
                    >
                      <span>🔥 Streak: </span>
                      <span>{streak}</span>
                      {streak >= 2
                      && (
                      <span style={{ marginLeft: 8, color: '#d35400' }}>
                        (
                          {streakBonus}
                        )
                      </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mb-2">
                    <Button
                      variant="light"
                      style={{
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        fontWeight: 'bold',
                        padding: 0,
                        border: '1px solid #ccc',
                      }}
                      onClick={() => {
                        setShowHint((prev) => !prev);
                      }}
                    >
                      ?
                    </Button>
                  </div>

                  {showHint && (
                    <div className="hint-box mb-3">
                      <strong>Hint:</strong>
                      <br />
                      {currentQuestion.hint}
                    </div>
                  )}

                  <div className="text-center mb-3">
                    <Image
                      src={currentQuestion.imageUrl}
                      alt="Campus location"
                      width={500}
                      height={350}
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                    />

                    <div style={{ fontSize: '0.9rem', marginTop: '4px', color: '#666' }}>
                      Submitted by:
                      <strong>
                        {currentQuestion.submittedBy}
                      </strong>
                    </div>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-2"
                      onClick={async () => {
                        const confirmed = await swal({
                          title: 'Report Image?',
                          text: 'Flag this image as incorrect or inappropriate?',
                          icon: 'warning',
                          buttons: ['Cancel', 'Report'],
                          dangerMode: true,
                        });

                        if (!confirmed) return;

                        try {
                          const res = await fetch('/api/reports', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              submissionId: currentQuestion.id,
                            }),
                          });

                          if (!res.ok) throw new Error('Failed');

                          swal('Reported!', 'Thank you — our admins will review this image.', 'success');
                        } catch (err) {
                          console.error(err);
                          swal('Error', 'Unable to submit report.', 'error');
                        }
                      }}
                    >
                      Report Image
                    </Button>
                  </div>

                  <LeafletMap onSelectLocation={(lat, lng) => setSelectedLatLng([lat, lng])} />

                  <ProgressBar
                    now={(timer / GAME_TIME) * 100}
                    className="my-3"
                    animated
                    striped
                    style={{ backgroundColor: '#cfe9d3' }}
                  >
                    <ProgressBar
                      now={(timer / GAME_TIME) * 100}
                      label={`${timer}s`}
                      style={{ backgroundColor: '#7ecf8a' }}
                    />
                  </ProgressBar>

                  <Form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      className="w-100 mb-2"
                      style={{
                        backgroundColor: '#1e6f43',
                        borderColor: '#1e6f43',
                      }}
                    >
                      Submit
                    </Button>

                    <div className="text-center">
                      <strong>Score:</strong>
                      <br />
                      {score}
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
