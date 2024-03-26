import { Link } from "react-router-dom";
import UniLogo from "/image/logo.png";
import { Button, Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-warning mx-3">
      <Container>
        <Row className="py-5 my-5 border-bottom">
          <Col md={12} lg={6} className="mb-3">
            <Link
              to="/"
              className="d-flex align-items-center mb-3 link-dark text-decoration-none"
            >
              <img
                src={UniLogo}
                width="65"
                height="65"
                className="d-inline-block align-top"
                alt="Uni logo"
              />
            </Link>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <i className="bi bi-envelope-fill"></i> nq2508h@gre.ac.uk
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <i className="bi bi-telephone-fill"></i> +84 916 843 367
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <i className="bi bi-geo-alt-fill"></i> Ninh Kieu, Can Tho,
                  Vietnam
                </Link>
              </li>
            </ul>
          </Col>

          <Col sm={12} md={4} lg={2} className="mb-3">
            <h5 className="fw-bold">Home</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/article" className="nav-link p-0 text-muted">
                  Article
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/submission" className="nav-link p-0 text-muted">
                  Submission
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  About
                </Link>
              </li>
            </ul>
          </Col>

          <Col sm={12} md={4} lg={2} className="mb-3">
            <h5 className="fw-bold">About Us</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Our Platform
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Our Mission
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Our Vision
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Join Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col sm={12} md={4} lg={2} className="mb-3">
            <h5 className="fw-bold">Social Profiles</h5>
            <ul className="nav flex-row">
              <li className="nav-item me-2">
                <Link
                  target="_blank"
                  to="https://www.facebook.com/ndquang093/"
                  className="nav-link p-0 text-muted"
                >
                  <Button variant="light">
                    <i className="bi bi-facebook"></i>
                  </Button>
                </Link>
              </li>
              <li className="nav-item me-2">
                <Link
                  target="_blank"
                  to="https://github.com/Three-Tiger"
                  className="nav-link p-0 text-muted"
                >
                  <Button variant="light">
                    <i className="bi bi-github"></i>
                  </Button>
                </Link>
              </li>
              <li className="nav-item me-2">
                <Link
                  target="_blank"
                  to="https://www.linkedin.com/in/nguyen-duy-quang/"
                  className="nav-link p-0 text-muted"
                >
                  <Button variant="light">
                    <i className="bi bi-linkedin"></i>
                  </Button>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <p className="text-center text-body-secondary mb-0 pb-4">
          © 2024 Unimang Contributions, Inc
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
