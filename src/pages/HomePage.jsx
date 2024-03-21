import { useEffect, useState } from "react";
import Lightning from "/image/home/lightning.png";
import FullLayout from "../components/layouts/Full";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import facultyApi from "../api/facultyApi";
import handleError from "../services/HandleErrors";
import authService from "../services/AuthService";
import contributionApi from "../api/contributionApi";
import formatDateTime from "../services/FormatDateTime";

function HomePage() {
  const [top6Contributions, setTop6Contributions] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  const isGuest = () => {
    return authService.getUserRole() === "Guest";
  };

  if (isAuthenticated()) {
    if (!isStudent() && !isGuest()) {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await facultyApi.getAll();
        setFaculties(response);
        const top6Contributions = await contributionApi.getTop6();
        setTop6Contributions(top6Contributions);
        console.log("🚀 ~ fetchData ~ top6Contributions:", top6Contributions);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

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
                <Link to="/submission">
                  <Button variant="warning" size="lg" className="px-4 gap-3">
                    Submit
                  </Button>
                </Link>
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
              {top6Contributions.map((contribution, index) => (
                <Col md={6} key={index}>
                  <Card className="mb-4">
                    <Card.Img
                      variant="top"
                      src={`/api/contributions/${contribution.contributionId}/image`}
                      style={{
                        height: "300px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    <Card.Body>
                      <Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="light" text="dark">
                            <p className="p-2 mb-0">
                              {formatDateTime.toDateString(
                                contribution.submissionDate
                              )}
                            </p>
                          </Badge>
                          <h6 className="mb-0">
                            By{" "}
                            <span className="text-warning">
                              {contribution.user.firstName}{" "}
                              {contribution.user.lastName}
                            </span>
                          </h6>
                        </div>
                      </Card.Text>
                      <Card.Title className="mb-2">
                        <h5 className="fw-bold">{contribution.title}</h5>
                      </Card.Title>
                      {/* <Card.Text>
                        <p className="description">{article.description}</p>
                      </Card.Text> */}
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
