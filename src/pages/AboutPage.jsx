import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullLayout from "../components/layouts/Full";
import myImage from "/image/home/abt.png";

const AboutPage = () => {
  const descrip = [
    {
      id: 1,
      description: "Our Platform",
      content:
        "UniMagContributions is a comprehensive web-based system designed with the unique needs of our university community in mind. Our platform offers a secure and role-based environment tailored to the university's organizational structure, with distinct user roles such as Admin, University Marketing Manager, Marketing Coordinator, Student, and Guest.",
    },
    {
      id: 2,
      description: "Our Mission",
      content:
        "Our mission at UniMagContributions is to streamline the process of collecting, reviewing, and publishing student contributions for the annual university magazine. We strive to provide a secure, intuitive, and efficient platform that empowers students to showcase their talents and perspectives while ensuring the highest standards of quality and diversity in our publication.",
    },
    {
      id: 3,
      description: "Our Vision",
      content:
        "Our vision at UniMagContributions is to foster a collaborative environment where the university community can come together to curate an engaging and representative annual magazine. By providing a platform that values creativity, expression, and pride in the diverse talents of our students, we aim to inspire and celebrate the richness of our university's academic and cultural landscape.  ",
    },
    {
      id: 4,
      description: "Join Us",
      content:
        "Join us at UniMagContributions and be a part of our journey to create a magazine that truly reflects the creativity, diversity, and excellence of our university community. Whether you're a student looking to share your voice or a stakeholder interested in supporting our mission, we invite you to explore our platform and contribute to the vibrant tapestry of our university magazine. Together, let's showcase the brilliance and ingenuity of our students for years to come.",
    },
  ];
  return (
    <FullLayout>
      <Container>
        <Row className="align-items-center justify-content-center mb-3 py-3">
          <Col className="text-center">
            <h2 className="fw-bold px-3">About Us</h2>
          </Col>
        </Row>

        <Col>
          <Row>
            <img
              style={{ width: "1380px", height: "800px" }}
              src={myImage}
              alt="Description of the image"
            />
          </Row>

          <Row className="mb-5 py-5">
            {descrip.map((description) => (
              <Row>
                <Card.Body>
                  <Row className="justify-content-center">
                    <h4>{description.description}</h4>
                    <p>{description.content}</p>
                  </Row>
                </Card.Body>
              </Row>
            ))}
          </Row>

          <Row className="justify-content-center">
            <Col xs="auto" className="">
              <Link to="/#">
                <Button variant="outline-warning" size="lg">
                  Get Started
                </Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Container>
    </FullLayout>
  );
};

export default AboutPage;
