import { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/Admin";
import { Button, Container, Modal, Tab, Table, Tabs } from "react-bootstrap";
import swalService from "../services/SwalService";
import ContributionComponent from "../components/ContributionComponent";
import handleError from "../services/HandleErrors";
import FullLayout from "../components/layouts/Full";
import contributionApi from "../api/contributionApi";
import authService from "../services/AuthService";
import formatDateTime from "../services/FormatDateTime";

const MyContributionPage = () => {
  const row = [
    "#",
    "Title",
    "Submission Date",
    "Status",
    "Annual Magazine",
    "Is Published",
    "Action",
  ];
  const [show, setShow] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [contribution, setContribution] = useState({});
  const [userData, setUserData] = useState(null);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleGiveFeedback = (id) => async () => {
    const response = await contributionApi.getById(id);
    console.log("🚀 ~ handleGiveFeedback ~ response:", response);
    setContribution(response);
    handleShow();
  };

  const isGraded = () => {
    return contribution.feedbacks?.length > 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getUserData();
        setUserData(user);
        const response = await contributionApi.getContributionsByUserId(
          user.userId
        );
        setContributions(response);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <FullLayout>
        <Container>
          <h2 className="text-center fw-bold mb-4">My Contribution</h2>
          <Modal
            size="lg"
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Give feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <table className="table table-striped">
                <tbody>
                  {Object.keys(contribution).length > 0 && (
                    <>
                      <tr>
                        <td className="fw-bold col-3">Grading status</td>
                        <td>
                          {isGraded() ? (
                            <p className="text-success fw-bold mb-0">Graded</p>
                          ) : (
                            <p className="text-danger fw-bold mb-0">
                              Not graded
                            </p>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold col-3">Closure Date</td>
                        <td>
                          {formatDateTime.toDateTimeString(
                            contribution.annualMagazine.closureDate
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold col-3">Final Closure Date</td>
                        <td>
                          {formatDateTime.toDateTimeString(
                            contribution.annualMagazine.finalClosureDate
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold col-3">Title</td>
                        <td>{contribution.title}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold col-3">File submissions</td>
                        <td>
                          {contribution.fileDetails.map((file, index) => (
                            <div
                              className="d-flex align-items-center gap-2 mb-3"
                              key={index}
                            >
                              <h2 className="mb-0">
                                {file.fileType == "DOCX" ? (
                                  <i className="bi bi-filetype-docx"></i>
                                ) : (
                                  <i className="bi bi-filetype-pdf"></i>
                                )}
                              </h2>
                              <div>
                                <a
                                  href={`/api/file-details/${file.fileId}/download`}
                                  key={index}
                                >
                                  {file.fileName}
                                </a>
                                <div>
                                  {formatDateTime.toDateTimeString(
                                    contribution.submissionDate
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <a
                            href={`/api/file-details/${contribution.contributionId}/download-multiple`}
                            className="btn btn-outline-warning"
                          >
                            Download all
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold col-3">Image submissions</td>
                        <td>
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            {contribution.imageDetails.map((image, index) => (
                              <img
                                src={`/api/image-details/${image.imageId}`}
                                alt={image.imageName}
                                key={index}
                                className="img-thumbnail w-25 h-25"
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                      {contribution.feedbacks.length > 0 && (
                        <tr>
                          <td className="fw-bold col-3">Feedback by</td>
                          <td>
                            <div className="d-flex gap-2">
                              <img
                                src={
                                  contribution.feedbacks[0].user.profilePicture
                                    ? `/api/users/${contribution.feedbacks[0].user.userId}/image`
                                    : "/image/default-avatar.png"
                                }
                                width={25}
                                height={25}
                                roundedCircle
                              />
                              <p className="mb-0">
                                {contribution.feedbacks[0].user.firstName}{" "}
                                {contribution.feedbacks[0].user.lastName}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
              {Object.keys(contribution).length > 0 &&
                contribution.feedbacks.length > 0 && (
                  <>
                    <div className="my-5 py-5"></div>
                    <div className="message-list">
                      {contribution.feedbacks.map((feedback, index) => (
                        <div className="chat-box" key={index}>
                          <div
                            className={
                              feedback.user.userId == userData.userId
                                ? "user-message"
                                : "other-message"
                            }
                          >
                            {feedback.user?.userId == userData.userId && (
                              <div className="message">
                                <pre>{feedback.content}</pre>
                              </div>
                            )}
                            <img
                              src={
                                feedback.user?.profilePicture
                                  ? `/api/users/${feedback.user?.userId}/image`
                                  : "/image/default-avatar.png"
                              }
                              alt="Avatar"
                              className="avatar"
                            />
                            {feedback.user?.userId != userData.userId && (
                              <div className="message">
                                <pre>{feedback.content}</pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {contributions.length > 0 && (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {row.map((item, index) => (
                      <th key={index}>{item}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((contribution, index) => (
                    <tr key={index} className="align-middle">
                      <td>{index + 1}</td>
                      <td>{contribution.title}</td>
                      <td>
                        {formatDateTime.toDateTimeString(
                          contribution.submissionDate
                        )}
                      </td>
                      <td>
                        <span
                          className={
                            contribution.status === "Waiting"
                              ? "badge bg-warning"
                              : contribution.status === "Approved"
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {contribution.status}
                        </span>
                      </td>
                      <td>{contribution.annualMagazine.academicYear}</td>
                      <td>
                        <span
                          className={
                            contribution.isPublished
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {contribution.isPublished
                            ? "Published"
                            : "Unreleased"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <Button
                            variant="outline-warning"
                            onClick={handleGiveFeedback(
                              contribution.contributionId
                            )}
                          >
                            View
                          </Button>
                          {/* <Button variant="outline-success">Publish</Button>
                      <Button variant="outline-danger">Unreleased</Button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Container>
      </FullLayout>
    </>
  );
};

export default MyContributionPage;
