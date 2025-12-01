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

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
});

interface GameQuestion {
  id: number;
  imageUrl: string;
  correctAnswer: string;
  hint: string;
}

const questions: GameQuestion[] = [
  {
    id: 1,
    imageUrl: '/hamilton.jpg',
    correctAnswer: 'Hamilton Library',
    hint: 'The main library at UH Mānoa',
  },
  {
    id: 2,
    imageUrl: '/campus-center.jpg',
    correctAnswer: 'Campus Center',
    hint: 'A hub for food, events, and student activities',
  },
  {
    id: 3,
    imageUrl: '/kuykendall.png',
    correctAnswer: 'Kuykendall Hall',
    hint: 'Named after a former UH president',
  },
  {
    id: 4,
    imageUrl: '/frear-hall.png',
    correctAnswer: 'Frear Hall',
    hint: 'One of the main student housing buildings',
  },
  {
    id: 5,
    imageUrl: '/sakamaki-hall.png',
    correctAnswer: 'Sakamaki Hall',
    hint: 'Connected to Moore Hall',
  },
  {
    id: 6,
    imageUrl: '/life-sciences-building.png',
    correctAnswer: 'Life Sciences Building',
    hint: 'New STEM facility opened in 2020',
  },
  {
    id: 7,
    imageUrl: '/holmes-hall.png',
    correctAnswer: 'Holmes Hall',
    hint: 'Where the College of Engineering is located',
  },
  {
    id: 8,
    imageUrl: '/hawaii-hall.png',
    correctAnswer: 'Hawaii Hall',
    hint: 'One of the oldest buildings on campus',
  },
  {
    id: 9,
    imageUrl: '/east-west-complex.png',
    correctAnswer: 'East West Center',
    hint: 'International research organization',
  },
  {
    id: 10,
    imageUrl: '/japanese-garden.png',
    correctAnswer: 'Japanese Garden',
    hint: 'A peaceful hidden spot between buildings',
  },
];

const GAME_TIME = 20;

const GamePage: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const endGame = useCallback((finalScore: number) => {
    setIsGameOver(true);
    swal(
      'Game Over!',
      `Your final score: ${finalScore} / ${questions.length}`,
      'info',
      { timer: 3000 },
    );
  }, []);

  const handleTimeUp = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer('');
      setTimer(GAME_TIME);
      setShowHint(false);
    } else {
      endGame(score);
    }
  }, [currentQuestionIndex, score, endGame]);

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

    const guessCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    const updatedScore = guessCorrect ? score + 1 : score;

    if (guessCorrect) setScore(updatedScore);

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
