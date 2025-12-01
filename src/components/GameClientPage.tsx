'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  ProgressBar,
} from 'react-bootstrap';
import swal from 'sweetalert';
import dynamic from 'next/dynamic';
import { Submission } from '@prisma/client';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
});

interface GameClientPageProps {
  submissions: Submission[];
}

const GAME_TIME = 20;

const GamePage: React.FC<GameClientPageProps> = ({ submissions }) => {
  const questions = submissions.map((s) => ({
    id: s.id,
    imageUrl: s.imageUrl,
    correctAnswer: s.location,
    hint: s.caption,
  }));

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 🔥 Streak system
  const [streak, setStreak] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const endGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      swal(
        'Game Over!',
        `Your final score: ${finalScore} / ${questions.length}`,
        'info',
        { timer: 3000 },
      );
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

    const guessCorrect = userAnswer.trim().toLowerCase()
    === currentQuestion.correctAnswer.toLowerCase();

    let updatedScore = score;

    if (guessCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      updatedScore += 1; // Base point

      // 🔥 Bonus every 3 streaks
      if (newStreak % 3 === 0) {
        updatedScore += 1;
        setStreakBonus((prev) => prev + 1);
        swal(
          '🔥 Streak Bonus!',
          `You earned +1 bonus for a ${newStreak} streak!`,
          'success',
        );
      }

      setScore(updatedScore);
    } else {
      // Wrong answer resets streak
      setStreak(0);
      setStreakBonus(0);
    }

    // Move to next question
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
      setShowHint(false);
    } else {
      endGame(updatedScore);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-3">
                Manoa Guesser
              </Card.Title>

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
                      <div>{score}</div>
                      <div>/</div>
                      <div>{questions.length}</div>
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
                    <LeafletMap />
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
                    <Form.Group className="mb-3">
                      <Form.Label>Enter your guess:</Form.Label>
                      <Form.Control
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type the location name"
                        required
                      />
                    </Form.Group>

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
