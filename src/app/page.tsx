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
            textShadow: `
              -2px -2px 0 red,
              2px -2px 0 red,
              -2px  2px 0 red,
              2px  2px 0 red
            `,
          }}
        >
          EXPLORE UH MANOA!
        </h1>

        <p
          className="fs-3 text-white"
          style={{
            color: 'white',
            textShadow: `
              -1px -1px 0 red,
              1px -1px 0 red,
              -1px  1px 0 red,
              1px  1px 0 red
            `,
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
          <h3 className="fw-bold mb-3">Sign Up to Begin Playing!</h3>
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
