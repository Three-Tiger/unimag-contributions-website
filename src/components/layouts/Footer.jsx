import { Link } from "react-router-dom";
import UniLogo from "/image/logo.png";
import { Button, Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-light">
      <Container>
        <Row
          xs={1}
          sm={2}
          md={5}
          className="row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-bottom"
        >
          <Col className="mb-3">
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
                  <i class="bi bi-envelope-fill"></i> threetiger@gmail.com
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <i class="bi bi-telephone-fill"></i> +84 123 456 789
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <i class="bi bi-geo-alt-fill"></i> Ninh Kieu, Can Tho, Vietnam
                </Link>
              </li>
            </ul>
          </Col>

          <Col className="mb-3"></Col>

          <Col className="mb-3">
            <h5 className="fw-bold">Home</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Benefits
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Our Faculties
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Our Testimonials
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  FAQs
                </Link>
              </li>
            </ul>
          </Col>

          <Col className="mb-3">
            <h5 className="fw-bold">About Us</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  School
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Achievements
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  Our Goals
                </Link>
              </li>
            </ul>
          </Col>

          <Col className="mb-3">
            <h5 className="fw-bold">Social Profiles</h5>
            <ul className="nav flex-row">
              <li className="nav-item me-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <Button variant="light">
                    <i class="bi bi-facebook"></i>
                  </Button>
                </Link>
              </li>
              <li className="nav-item me-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <Button variant="light">
                    <i class="bi bi-google"></i>
                  </Button>
                </Link>
              </li>
              <li className="nav-item me-2">
                <Link to="#" className="nav-link p-0 text-muted">
                  <Button variant="light">
                    <i class="bi bi-linkedin"></i>
                  </Button>
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <p className="text-center text-body-secondary">
          © 2024 Unimang Contributions, Inc
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
