'use client';

import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  return (
    <div className="bg-home min-vh-100 d-flex align-items-center">
      <Container className="text-center">

        {/* Hero Text */}
        <Row className="mb-4">
          <Col>
            <h1 className="display-3 fw-bold hero-title">
              MANOA GUESSER!
            </h1>

            <p className="fs-3 hero-subtitle">
              Discover the Manoa campus like never before!
            </p>
          </Col>
        </Row>

        {/* Center Card: changes based on login state */}
        <Row className="justify-content-center mb-5">
          <Col xs={12} md={6} lg={4}>
            <Card
              className="p-4 rounded-4 home-card"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
              {!isLoggedIn ? (
                <>
                  <h3 className="fw-bold mb-3">Sign Up to Begin Playing!</h3>
                  <p className="mb-3">
                    Create an account to start guessing locations around UH Mānoa and earn points.
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <Button href="/auth/signup" variant="primary" className="green_btn">
                      Sign Up
                    </Button>
                    <Button href="/auth/signin" variant="outline-success">
                      Sign In
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="fw-bold mb-3">
                    Welcome back
                    {session?.user?.email ? `, ${session.user.email}` : ''}
                    !
                  </h3>
                  <p className="mb-3">
                    Ready to keep exploring the Manoa campus and climb the leaderboard?
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <Button href="/game" variant="primary" className="green_btn">
                      Play Game
                    </Button>
                    <Button href="/leaderboard" variant="outline-success">
                      View Leaderboard
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </Col>
        </Row>

        {/* Information Cards */}
        <Row className="justify-content-center g-4">
          <Col xs={12} md={5} lg={4}>
            <Card className="p-4 rounded-4 home-card">
              <h4 className="fw-bold mb-2">How the Game Works</h4>
              <p>
                You’ll be given a random image of a location on campus.
                Take a guess on where the image is on campus. The closer you are, the more points you earn!
              </p>
            </Card>
          </Col>

          <Col xs={12} md={5} lg={4}>
            <Card className="p-4 rounded-4 home-card">
              <h4 className="fw-bold mb-2">Become a Campus Explorer</h4>
              <p>
                Earn points and climb the leaderboard by correctly identifying locations.
                The more you explore, the more you score!
              </p>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default Home;
