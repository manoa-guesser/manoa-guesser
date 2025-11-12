'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, ProgressBar } from 'react-bootstrap';
import swal from 'sweetalert';

interface GameQuestion {
  id: number;
  imageUrl: string;
  correctAnswer: string;
}

// Example questions, replace with your backend API
const questions: GameQuestion[] = [
  { id: 1, imageUrl: 'hamilton.jpg', correctAnswer: 'Library' },
  { id: 2, imageUrl: 'campus-center.jpg', correctAnswer: 'Campus Center' },
];

const GAME_TIME = 20; // seconds per question

const GamePage: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Countdown timer
  useEffect(() => {
    if (!isGameStarted || isGameOver) return;
    if (timer <= 0) {
      handleTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isGameStarted, isGameOver, currentQuestionIndex]);

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setTimer(GAME_TIME);
  };

  const handleTimeUp = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
    } else {
      endGame();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update score if correct
    if (userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
      setScore((prev) => prev + 1);
    }

    // Move to next question or finish
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    swal('Game Over!', `Your final score: ${score} / ${questions.length}`, 'info', { timer: 3000 });
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
                  {isGameOver && <div className="mt-3">Your last score: {score} / {questions.length}</div>}
                </div>
              ) : (
                <>
                  <div className="text-center mb-3">
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Campus location"
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
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
                    <div className="text-center">Score: {score}</div>
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
