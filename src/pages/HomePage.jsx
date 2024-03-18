import { useEffect, useState } from "react";
import Lightning from "/image/home/lightning.png";
import FullLayout from "../components/layouts/Full";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import facultyApi from "../api/facultyApi";
import handleError from "../services/HandleErrors";
import authService from "../services/AuthService";

function HomePage() {
  const [faculties, setFaculties] = useState([]);

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  if (isAuthenticated() && !isStudent()) {
    return <Navigate to="/admin/dashboard" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await facultyApi.getAll();
        setFaculties(response);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  const studentArticles = [
    {
      id: 1,
      thumbnail: "image/home/article1.png",
      submissionDate: "2024-09-01",
      author: "John Doe",
      title: "The Future of Technology",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
    {
      id: 2,
      thumbnail: "image/home/article2.png",
      submissionDate: "2024-09-05",
      author: "Jane Smith",
      title: "Exploring Artificial Intelligence",
      description:
        "An in-depth analysis of the current state and potential future of artificial intelligence.",
    },
    {
      id: 3,
      thumbnail: "image/home/article3.png",
      submissionDate: "2024-09-10",
      author: "Alice Johnson",
      title: "The Impact of Climate Change on Global Economy",
      description:
        "Examining the economic consequences of climate change and possible solutions.",
    },
    {
      id: 4,
      thumbnail: "image/home/article4.png",
      submissionDate: "2024-09-15",
      author: "Bob Williams",
      title: "Space Exploration: Past, Present, and Future",
      description:
        "A comprehensive overview of humanity's journey into space and what lies ahead. Examining the economic consequences of climate change and possible solutions.",
    },
    {
      id: 5,
      thumbnail: "image/home/article5.png",
      submissionDate: "2024-09-20",
      author: "Eva Brown",
      title: "The Role of Blockchain in Modern Finance",
      description:
        "Analyzing the applications and potential disruptions of blockchain technology in the financial sector.",
    },
    {
      id: 6,
      thumbnail: "image/home/article6.png",
      submissionDate: "2024-09-25",
      author: "Michael Johnson",
      title: "Understanding Quantum Computing",
      description:
        "An exploration of the principles and implications of quantum computing. Analyzing the applications and potential disruptions of blockchain technology in the financial sector.",
    },
  ];

  return (
    <>
      <FullLayout>
        {/* Hero Section */}
        <section className="">
          <div className="px-4 py-5 my-5 text-center">
            <div className="d-flex justify-content-center align-items-center gap-3 mb-4 mt-5">
              <img src={Lightning} alt="Lightning" />
              <h1 className="display-5 fw-bold mb-0">
                <span className="text-warning">Unimag</span> Contributions
              </h1>
            </div>
            <Container className="col-lg-6 mx-auto">
              <h2 className="fw-bold">
                University Magazine Contribution Management System
              </h2>
              <p className="lead mb-4">
                Fostering creativity, expression, and pride in the diverse
                talents of its students.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                <Button variant="warning" size="lg" className="px-4 gap-3">
                  Submit
                </Button>
                <Button variant="outline-warning" size="lg" className="px-4">
                  Learn More
                </Button>
              </div>
            </Container>
          </div>
        </section>
        {/* Video */}
        <section className="py-5">
          <Container>
            <div className="video-container">
              <video
                src="video/introduction.mp4"
                controls
                autoPlay
                muted
              ></video>
            </div>
          </Container>
        </section>
        {/* Faculty */}
        <section className="py-5 faculty">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h2 className="fw-bold mb-0">Faculty</h2>
              <Link to="/faculty">
                <Button variant="outline-warning">View All</Button>
              </Link>
            </div>
            <Row>
              {faculties.map((course, index) => (
                <Col md={6} lg={4} key={index}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title className="mb-4">
                        <h3>{course.name}</h3>
                      </Card.Title>
                      <Card.Text>
                        <h6 className="fw-bold">
                          Description about this course
                        </h6>
                        <p className="description">{course.description}</p>
                      </Card.Text>
                      <div className="text-end">
                        <Link to="/submition">
                          <Button variant="outline-warning">
                            <i className="bi bi-arrow-up-right"></i>
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        {/* Student Article */}
        <section className="py-5 article">
          <Container>
            <Row className="align-items-end mb-5">
              <Col md={10}>
                <h2 className="fw-bold">Students’ Articles </h2>
                <p className="mb-0">
                  Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam
                  eget elit id imperdiet et. Cras eu sit dignissim lorem nibh
                  et. Ac cum eget habitasse in velit fringilla feugiat senectus
                  in.
                </p>
              </Col>
              <Col md={2} className="text-end">
                <Link to="/faculty">
                  <Button variant="outline-warning">View All</Button>
                </Link>
              </Col>
            </Row>

            <Row>
              {studentArticles.map((article, index) => (
                <Col md={6} key={index}>
                  <Card className="mb-4">
                    <Card.Img variant="top" src={article.thumbnail} />
                    <Card.Body>
                      <Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="light" text="dark">
                            <p className="p-2 mb-0">{article.submissionDate}</p>
                          </Badge>
                          <h6 className="mb-0">
                            By{" "}
                            <span className="text-warning">
                              {article.author}
                            </span>
                          </h6>
                        </div>
                      </Card.Text>
                      <Card.Title className="mb-2">
                        <h5 className="fw-bold">{article.title}</h5>
                      </Card.Title>
                      <Card.Text>
                        <p className="description">{article.description}</p>
                      </Card.Text>
                      <div className="text-end">
                        <Button variant="outline-warning">
                          <i className="bi bi-arrow-up-right"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </FullLayout>
    </>
  );
}

export default HomePage;
