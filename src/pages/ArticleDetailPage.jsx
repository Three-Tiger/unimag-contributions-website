import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Form,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import FullLayout from "../components/layouts/Full";
import contributionApi from "../api/contributionApi";
import handleError from "../services/HandleErrors";
import formatDateTime from "../services/FormatDateTime";
import ReadFileComponent from "../components/ReadFileComponent";

const ArticleDetailPage = () => {
  let { id } = useParams();
  const [contribution, setContribution] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await contributionApi.getById(id);
        console.log("🚀 ~ fetchData ~ response:", response);
        setContribution(response);
        setKey(response.fileDetails[0].fileId);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <FullLayout>
      <Container>
        {Object.keys(contribution).length > 0 && (
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            {contribution.fileDetails.map((fileDetail, index) => (
              <Tab
                key={index}
                eventKey={fileDetail.fileId}
                title={fileDetail.fileName}
              >
                {key === fileDetail.fileId && (
                  <ReadFileComponent fileDetail={fileDetail} />
                )}
              </Tab>
            ))}
          </Tabs>
        )}
      </Container>
    </FullLayout>
  );
};

export default ArticleDetailPage;
