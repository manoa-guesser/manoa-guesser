'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button, Card, Col, Container, Form, Row, ProgressBar } from 'react-bootstrap';
import swal from 'sweetalert';
import dynamic from 'next/dynamic';
import { Submission } from '@prisma/client';

const GAME_TIME = 20;

const LeafletMap = dynamic(() => import('@/components/GameMap'), {
  ssr: false,
});

interface GameClientPageProps {
  submissions: Submission[];
}

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

const GamePage: React.FC<GameClientPageProps> = ({ submissions }) => {
  const questions = submissions.map((s) => {
    const [latStr, lngStr] = s.location.split(',').map((v) => v.trim());

    return {
      id: s.id,
      imageUrl: s.imageUrl,
      correctAnswer: s.location,
      hint: s.caption,
      lat: parseFloat(latStr),
      lng: parseFloat(lngStr),
    };
  });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState<[number, number] | null>(null);

  // 🔥 Streak system
  const [streak, setStreak] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const endGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      swal('Game Over!', `Your final score: ${finalScore} / ${questions.length * 100}`, 'info', { timer: 5000 });
    },
    [questions.length],
  );

  const handleTimeUp = useCallback(() => {
    // Reset streak when time runs out
    setStreak(0);
    setStreakBonus(0);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
      setShowHint(false);
    } else {
      endGame(score);
    }
  }, [currentQuestionIndex, score, endGame, questions.length]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return undefined;

    if (timer <= 0) {
      handleTimeUp();
      return undefined;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isGameStarted, isGameOver, handleTimeUp]);

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setTimer(GAME_TIME);
    setStreak(0);
    setStreakBonus(0);
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

    setScore((prev) => prev + roundScore);

    swal({
      title: `Distance: ${distance.toFixed(1)} meters`,
      text: `You earned ${roundScore} points this round.`,
      icon: roundScore > 0 ? 'success' : 'error',
      timer: 5000,
    });

    // Move to next question
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedLatLng(null);
      setTimer(GAME_TIME);
      setShowHint(false);
    } else {
      swal({
        title: `Distance: ${distance.toFixed(1)} meters`,
        text: `You earned ${roundScore} points this round.`,
        icon: roundScore > 0 ? 'success' : 'error',
        timer: 5000,
      });
      endGame(score + roundScore);
    }
  };

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
                      <div>
                        {score}
                        /
                        {questions.length * 100}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* 🔥 Streak indicator */}
                  <div className="d-flex justify-content-center mb-2">
                    <div
                      style={{
                        backgroundColor: streak > 0 ? '#ffe08a' : '#eee',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        border: '1px solid #ccc',
                      }}
                    >
                      🔥 Streak:
                      {streak}
                      {streak >= 3 && (
                        <span style={{ marginLeft: '6px', color: '#d35400' }}>
                          (+
                          {streakBonus}
                          bonus)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hint button */}
                  <div className="d-flex justify-content-end mb-2">
                    <Button
                      variant="light"
                      style={{
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        fontWeight: 'bold',
                        padding: 0,
                        border: '1px solid #ccc',
                      }}
                      onClick={() => setShowHint((prev) => !prev)}
                    >
                      ?
                    </Button>
                  </div>

                  {/* Hint display */}
                  {showHint && (
                    <div className="hint-box mb-3">
                      <strong>Hint: </strong>
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
                  </div>

                  <div className="mb-3">
                    <LeafletMap onSelectLocation={(lat, lng) => setSelectedLatLng([lat, lng])} />
                  </div>

                  <ProgressBar
                    now={(timer / GAME_TIME) * 100}
                    className="mb-3"
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
                      variant="primary"
                      className="w-100 mb-2"
                      style={{
                        backgroundColor: '#1e6f43',
                        borderColor: '#1e6f43',
                      }}
                    >
                      Submit
                    </Button>

                    <div className="text-center">
                      <div>Score:</div>
                      <div>{score}</div>
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
