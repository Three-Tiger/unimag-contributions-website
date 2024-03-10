import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import FullLayout from "../components/layouts/Full";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <>
      <FullLayout>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card bg="light" className="mt-4">
                <Card.Body>
                  <Card.Title className="text-center">
                    <h2 className="fw-bold">Login</h2>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-center text-muted">
                    Welcome back! Please log in to access your account.
                  </Card.Subtitle>
                  <Card.Text>
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="fullName"
                          placeholder="Enter your full name"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="confirmpassword"
                          placeholder="Enter your password again"
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        <Form.Check
                          type="checkbox"
                          label="I agree to the conditions and regulations of UniMagContributions"
                        />
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="warning" type="submit">
                          Sign up
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3 text-center">
                      <div className="border-1">
                        Don’t have an account? <Link to="#">Sign Up</Link>
                      </div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </FullLayout>
    </>
  );
}

export default RegisterPage;
