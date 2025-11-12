import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => (
  <Container className="text-center">

    {/* Hero Text */}
    <Row className="mb-4">
      <Col>
        <h1
          className="display-3 fw-bold"
          style={{
            color: 'white',
            fontWeight: 900,
            letterSpacing: '2px',
            WebkitTextStroke: '2px red',
            textShadow: '0px 6px 14px rgba(0,0,0,0.75)',
          }}
        >
          EXPLORE UH MANOA
        </h1>

        <p
          className="fs-3 text-white"
          style={{
            fontWeight: 700,
            letterSpacing: '1.5px',
            WebkitTextStroke: '1px red',
            textShadow: '0px 4px 10px rgba(0,0,0,0.8)',
          }}
        >
          Discover the Manoa campus like never before!
        </p>
      </Col>
    </Row>

    {/* Sign Up Box */}
    <Row className="justify-content-center mb-5">
      <Col xs={12} md={6} lg={4}>
        <Card
          className="p-4 shadow rounded-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <h3 className="fw-bold mb-3">Sign Up</h3>
        </Card>
      </Col>
    </Row>

    {/* Information Cards */}
    <Row className="justify-content-center g-4">
      <Col xs={12} md={5} lg={4}>
        <Card className="p-4 shadow rounded-4">
          <h4 className="fw-bold mb-2">How the Game Works</h4>
          <p>
            You’ll be given a random image of a location on campus.
            Take a guess on where the image is on campus.
          </p>
        </Card>
      </Col>

      <Col xs={12} md={5} lg={4}>
        <Card className="p-4 shadow rounded-4">
          <h4 className="fw-bold mb-2">Become a Campus Explorer</h4>
          <p>
            Earn points and climb the leaderboard by correctly identifying locations.
            The more you explore, the more you score!
          </p>
        </Card>
      </Col>
    </Row>

  </Container>
);

export default Home;
