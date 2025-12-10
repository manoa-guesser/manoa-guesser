import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

const Footer = () => (
  <footer className="footer mt-auto">
    <Container>
      <Row className="text-center text-md-start align-items-start">
        {/* LEFT COLUMN — Project Name w/ Logo */}
        <Col xs={12} md={4} className="mb-4 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
          <div className="d-flex align-items-center mb-2">
            <Image src="/favicon.ico" alt="Manoa Guesser Logo" width={48} height={48} style={{ marginRight: '10px' }} />
            <h3 className="fw-bold m-0" style={{ fontSize: '1.75rem' }}>
              Manoa Guesser
            </h3>
          </div>
        </Col>

        {/* CENTER COLUMN — Created By */}
        <Col xs={12} md={4} className="mb-4 d-flex flex-column justify-content-start">
          <h6 className="fw-bold mb-2">Created By:</h6>

          <a href="https://jiajunli526.github.io/" style={{ color: '#a8e6cf', textDecoration: 'underline' }}>
            Jia Jun Li
          </a>
          <a href="https://zhouweijosh.github.io/" style={{ color: '#a8e6cf', textDecoration: 'underline' }}>
            Joshua Chow
          </a>
          <a href="https://colbren.github.io/" style={{ color: '#a8e6cf', textDecoration: 'underline' }}>
            Colbren Fujimoto
          </a>
          <a href="https://lawrencezheng5.github.io/" style={{ color: '#a8e6cf', textDecoration: 'underline' }}>
            Lawrence Zheng
          </a>
        </Col>

        {/* RIGHT COLUMN — Resources */}
        <Col xs={12} md={4} className="d-flex flex-column justify-content-start">
          <h6 className="fw-bold mb-2">Resources</h6>

          <a href="https://manoa-guesser.github.io/" style={{ color: '#a8e6cf', textDecoration: 'underline' }}>
            GitHub Pages Documentation
          </a>

          <div className="mt-1" style={{ opacity: 0.85 }}>
            All images are user-submitted.
            <br />
            Report inappropriate content.
          </div>
        </Col>
      </Row>

      <div className="text-center mt-4" style={{ fontSize: '0.9rem', opacity: 0.85 }}>
        © 2025 Manoa Guesser — University of Hawaiʻi at Mānoa
      </div>
    </Container>
  </footer>
);

export default Footer;
