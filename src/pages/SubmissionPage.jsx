import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Form,
  Nav,
  Tab,
} from "react-bootstrap";
import FullLayout from "../components/layouts/Full";
import annualMagazineApi from "../api/annualMagazine";
import SubmissionComponent from "../components/SubmissionComponent";
import ContributionComponent from "../components/ContributionComponent";

const SubmissionPage = () => {
  const [annualMagazines, setAnnualMagazines] = useState([]);
  const [eventKey, setEventKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await annualMagazineApi.getAll();

        setAnnualMagazines(response);
        if (response.length > 0) {
          setEventKey(response[0].academicYear);
        }
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <FullLayout>
      <Container>
        <Row className="align-items-center mb-5 py-5">
          <Col>
            <h2 className="fw-bold px-3 mb-0">Submit your contribution</h2>
          </Col>
          <Col>
            <p className="m-0">
              You will submit articles on this page. You can view and filter
              your posts here.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {annualMagazines.length > 0 && (
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey={annualMagazines[0].academicYear}
                onSelect={(k) => setEventKey(k)}
              >
                <Row>
                  <Col sm={2}>
                    <Nav variant="pills" className="flex-column">
                      {annualMagazines.map((annualMagazine, index) => (
                        <Nav.Item key={index}>
                          <Nav.Link eventKey={annualMagazine.academicYear}>
                            {annualMagazine.academicYear}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </Col>
                  <Col sm={10}>
                    <Tab.Content>
                      {annualMagazines.map((annualMagazine, index) => (
                        <Tab.Pane
                          key={index}
                          eventKey={annualMagazine.academicYear}
                        >
                          {eventKey === annualMagazine.academicYear && (
                            <SubmissionComponent
                              annualMagazine={annualMagazine}
                            />
                            // <Card>
                            //   <Card.Body>
                            //     <ContributionComponent
                            //       annualMagazine={annualMagazine}
                            //     />
                            //   </Card.Body>
                            // </Card>
                          )}
                        </Tab.Pane>
                      ))}
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            )}
          </Col>
        </Row>
      </Container>
    </FullLayout>
  );
};

export default SubmissionPage;
