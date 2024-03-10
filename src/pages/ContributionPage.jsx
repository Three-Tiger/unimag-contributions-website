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
            <h2 className="py-5 fw-bold">Contribution Submitted Article</h2>
          </Col>
          <Row>
            <p className="">
              All articles you have submitted will be archived on this page. You
              can view and filter your posts here.
            </p>
          </Row>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Form style={{ width: "100%", height: "100%" }}>
                    <Form.Group className="mb-3 mt-4" controlId="#">
                      <Form.Label>File Upload</Form.Label>
                      <Form.Control placeholder="File status" />
                    </Form.Group>
                    <div className="d-flex justify-content-center mt-4">
                      <Button variant="outline-warning" className="me-4">
                        Back
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
