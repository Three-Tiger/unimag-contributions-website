import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FullLayout from "../components/layouts/Full";

const AllFaculty = () => {
  const course = [
    {
      id: 1,
      thumbnail: [
        "image/home/course1.1.png",
        "image/home/course1.2.png",
        "image/home/course1.3.png",
      ],
      name: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    },
    {
      id: 2,
      thumbnail: [
        "image/home/course1.1.png",
        "image/home/course1.2.png",
        "image/home/course1.3.png",
      ],
      name: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    },
    {
      id: 3,
      thumbnail: [
        "image/home/course1.1.png",
        "image/home/course1.2.png",
        "image/home/course1.3.png",
      ],
      name: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    },
    {
      id: 4,
      thumbnail: [
        "image/home/course1.1.png",
        "image/home/course1.2.png",
        "image/home/course1.3.png",
      ],
      name: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    },
    {
      id: 5,
      thumbnail: [
        "image/home/course1.1.png",
        "image/home/course1.2.png",
        "image/home/course1.3.png",
      ],
      name: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    },
    {
      id: 6,
      thumbnail: [
        "image/home/course1.1.png",
        "image/home/course1.2.png",
        "image/home/course1.3.png",
      ],
      name: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    },
  ];
  const courseYears = [
    {
      id: 1,
      phase: "2020-2021",
    },
    {
      id: 2,
      phase: "2021-2022",
    },
    {
      id: 3,
      phase: "2022-2023",
    },
    {
      id: 4,
      phase: "2023-2024",
    },
  ];
  return (
    <FullLayout>
      <Container>
        <Row className="align-items-end mb-5 py-5 ">
          <Col>
            <h2 className="fw-bold px-3">Students’ Articles </h2>
          </Col>
          <Col>
            <p className="">
              Welcome to our online course page, where you can enhance your
              skills in design and development. Choose from our carefully
              curated selection of 10 courses designed to provide you with
              comprehensive knowledge and practical experience. Explore the
              courses below and find the perfect fit for your learning journey.
            </p>
          </Col>
        </Row>

        <Row>
          {course.map((course) => (
            <Col md={12}>
              <Card className="mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Row>
                      <Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="fw-bold">Years</h5>
                        </div>
                      </Card.Text>
                    </Row>
                    <Row>
                      <Link to="/#">
                        <Button variant="outline-warning">View All</Button>
                      </Link>
                    </Row>
                  </div>
                  <Card className="mb-4 mt-4">
                    <Card.Body>
                      <Row className="mt-2">
                        {courseYears.map((courseYear) => (
                          <Col md={3} className="mt-4">
                            <h5 className="fw-bold text-center">
                              <Link to="/#">
                                <Button variant="outline-warning ">
                                  <span>{courseYear.phase}</span>
                                </Button>
                              </Link>
                            </h5>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                  <Card.Title className="mb-2">
                    <h5 className="fw-bold">{course.name}</h5>
                  </Card.Title>
                  <Card.Text>
                    <p className="description">{course.description}</p>
                  </Card.Text>
                  <Row>
                    {course.thumbnail.map((img) => (
                      <Col md={4}>
                        <Card.Img
                          variant="middle"
                          src={img}
                          className="img-fluid"
                        />
                      </Col>
                    ))}
                  </Row>
                  <Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 mt-4">
                        By <span className="text-warning">{course.author}</span>
                      </h6>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </FullLayout>
  );
};

export default AllFaculty;
