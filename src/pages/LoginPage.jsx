import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import FullLayout from "../components/layouts/Full";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import userApi from "../api/userApi";
import * as yup from "yup";
import swalService from "../services/SwalService";
import authService from "../services/AuthService";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});

  // Yup validation
  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      try {
        const response = await userApi.login(formData);
        authService.saveUser(response);
        navigate("/");
      } catch (error) {
        handleErrors(error);
      }
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setError(newError);
    }
  };

  const handleErrors = (error) => {
    if (error.response.status >= 400 && error.response.status < 500) {
      swalService.showMessage(
        "Warning",
        error.response.data.message,
        "warning"
      );
    } else {
      swalService.showMessage(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

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
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.email ? error.email : ""}
                        </div>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.password ? error.password : ""}
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3 text-end">
                        <Form.Text className="text-muted">
                          <Link to="#">Forgot password?</Link>
                        </Form.Text>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        <Form.Check type="checkbox" label="Rememeber me" />
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="warning" type="submit">
                          Login
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

export default LoginPage;
