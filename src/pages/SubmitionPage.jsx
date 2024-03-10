import React from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullLayout from "../components/layouts/Full";

const Submition = () => {
  return (
    <FullLayout>
      <Container>
        <Row className="align-items-end mb-5 py-5 ">
          <Col>
            <h2 className="py-5 fw-bold px-3">UI/UX Design Course Submit</h2>
          </Col>
          <Col>
            <p className="">
              Welcome to our UI/UX Design course! This comprehensive program
              will equip you with the knowledge and skills to create exceptional
              user interfaces (UI) and enhance user experiences (UX). Dive into
              the world of design thinking, wireframing, prototyping, and
              usability testing. Below is an overview of the curriculum
            </p>
          </Col>
          <Row className="justify-content-center">
            <Col md={10}>
              <div className="img-fluid mt-4 py-4 text-center">
                {" "}
                <img src="image/home/article5.png" />
              </div>
            </Col>
          </Row>
        </Row>

        <Card.Title className="text-center">
          <h2 className="fw-bold">Requirements</h2>
        </Card.Title>
        <Row>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Form style={{ width: "100%", height: "100%" }}>
                    <Form.Group className="mb-3 mt-4" controlId="#">
                      <Form.Label>File Upload</Form.Label>
                      <Form.Control type="email" placeholder="File status" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check
                        type="checkbox"
                        label="Are you sure to submit?"
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-center mt-4">
                      <Button variant="outline-warning" className="me-4">
                        Update
                      </Button>
                      <Button variant="warning" type="submit">
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>{" "}
        </Row>
      </Container>
    </FullLayout>
  );
};

export default Submition;
