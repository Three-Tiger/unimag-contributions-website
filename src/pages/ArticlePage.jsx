import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Form,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import FullLayout from "../components/layouts/Full";
import contributionApi from "../api/contributionApi";
import handleError from "../services/HandleErrors";
import formatDateTime from "../services/FormatDateTime";
import fileDetailApi from "../api/fileDetailApi";

const ArticlePage = () => {
  const [contributionsPublished, setContributionsPublished] = useState([]);

  const downloadArticle = (contributionId, title) => async () => {
    try {
      const response = await fileDetailApi.downloadMultipleFile(contributionId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title + ".zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      handleError.showError(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getPublished = await contributionApi.getPublished();
        setContributionsPublished(getPublished);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <FullLayout>
      <Container>
        <Row className="align-items-center mb-5 py-5 ">
          <Col>
            <h2 className="fw-bold">Contribution Submitted Article</h2>
          </Col>
          <Col>
            <p className="">
              All articles you have submitted will be archived on this page. You
              can view and filter your posts here.
            </p>
          </Col>
        </Row>

        <Row>
          {contributionsPublished.map((contribution, index) => (
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
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
                  <Card.Title className="mb-2">
                    <h5 className="fw-bold">{contribution.title}</h5>
                  </Card.Title>
                  <div className="text-end">
                    {/* <Link to={`/article/${contribution.contributionId}`}>
                      <Button variant="outline-warning" >
                        <i className="bi bi-arrow-up-right"></i>
                      </Button>
                    </Link> */}
                    <Button
                      variant="outline-warning"
                      onClick={downloadArticle(
                        contribution.contributionId,
                        contribution.title
                      )}
                    >
                      <i className="bi bi-download"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </FullLayout>
  );
};

export default ArticlePage;
