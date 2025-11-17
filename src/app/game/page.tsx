'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button, Card, Col, Container, Form, Row, ProgressBar } from 'react-bootstrap';
import swal from 'sweetalert';

interface GameQuestion {
  id: number;
  imageUrl: string;
  correctAnswer: string;
}

const questions: GameQuestion[] = [
  { id: 1, imageUrl: '/hamilton.jpg', correctAnswer: 'Hamilton Library' },
  { id: 2, imageUrl: '/campus-center.jpg', correctAnswer: 'Campus Center' },
  { id: 3, imageUrl: '/kuykendall.png ', correctAnswer: 'Kuykendall Hall' },
  { id: 4, imageUrl: '/frear-hall.png', correctAnswer: 'Frear Hall' },
  { id: 5, imageUrl: '/sakamaki.png', correctAnswer: 'Sakamaki Hall' },
  { id: 6, imageUrl: '/life-sciences-building', correctAnswer: 'Life Sciences Building' },
  { id: 7, imageUrl: '/holmes-hall.jpg', correctAnswer: 'Holmes Hall' },
  { id: 8, imageUrl: '/hawaii-hall.png', correctAnswer: 'Hawaii Hall' },
  { id: 9, imageUrl: '/east-west-center.jpg', correctAnswer: 'East West Center' },
  { id: 10, imageUrl: '/japanese-garden.jpg', correctAnswer: 'Japanese Garden' },

];

const GAME_TIME = 20;

const GamePage: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Handle when time expires
  const endGame = useCallback(() => {
    setIsGameOver(true);
    swal('Game Over!', `Your final score: ${score} / ${questions.length}`, 'info', { timer: 3000 });
  }, [score]);

  const handleTimeUp = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
    } else {
      endGame();
    }
  }, [currentQuestionIndex, endGame]);

  // Countdown timer
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      userAnswer.trim().toLowerCase()
      === currentQuestion.correctAnswer.toLowerCase()
    ) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
    } else {
      endGame();
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-3">Manoa Guesser</Card.Title>

              {!isGameStarted || isGameOver ? (
                <div className="text-center">
                  <Button variant="primary" size="lg" onClick={startGame}>
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

                  <ProgressBar
                    now={(timer / GAME_TIME) * 100}
                    label={`${timer}s`}
                    className="mb-3"
                    animated
                    striped
                  />

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

                    <Button type="submit" variant="primary" className="w-100 mb-2">
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
