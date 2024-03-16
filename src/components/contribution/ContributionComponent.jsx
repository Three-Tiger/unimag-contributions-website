import { useEffect, useState } from "react";
import contributionApi from "../../api/contributionApi";
import handleError from "../../services/HandleErrors";
import { Button, Modal, Table } from "react-bootstrap";
import formatDateTime from "../../services/FormatDateTime";

const ContributionComponent = ({ annualMagazine }) => {
  const isClosed = new Date(annualMagazine.closureDate) < new Date();
  const isFinalClosed = new Date(annualMagazine.finalClosureDate) < new Date();
  const row = [
    "#",
    "Title",
    "Submission Date",
    "Status",
    "Email",
    "Full name",
    "Avatar",
    "Faculty",
    "Action",
  ];
  const [show, setShow] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [contribution, setContribution] = useState({});

  const handleClose = () => {
    setShow(false);
    // setError({});
    // setFormData({
    //   facultyId: "",
    //   name: "",
    //   description: "",
    // });
  };

  const handleShow = () => {
    setShow(true);
    // setModelTitle("Add new Faculty");
  };

  const handleGiveFeedback = (id) => async () => {
    const response = await contributionApi.getById(id);
    setContribution(response);
    handleShow();
  };

  const timeRemainingClosureDate = () => {
    if (!isClosed) {
      return formatDateTime.subtractDateTime(annualMagazine.closureDate);
    }

    return "The submission is closed";
  };

  const timeRemainingFinalClosureDate = () => {
    if (!isFinalClosed) {
      return formatDateTime.subtractDateTime(annualMagazine.finalClosureDate);
    }

    return "The submission is closed";
  };

  const isGraded = () => {
    return contribution.feedbacks?.length > 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await contributionApi.getContributionsByAnnualMagazineId(
            annualMagazine.annualMagazineId
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
          <table class="table table-striped">
            <tbody>
              <tr>
                <td className="fw-bold col-3">Grading status</td>
                <td>
                  {isGraded() ? (
                    <p className="text-success fw-bold mb-0">Graded</p>
                  ) : (
                    <p className="text-danger fw-bold mb-0">Not graded</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="fw-bold col-3">Closure Date</td>
                <td>
                  {formatDateTime.toDateTimeString(annualMagazine.closureDate)}
                </td>
              </tr>
              <tr>
                <td className="fw-bold col-3">Final Closure Date</td>
                <td>
                  {formatDateTime.toDateTimeString(
                    annualMagazine.finalClosureDate
                  )}
                </td>
              </tr>
              <tr>
                <td className="fw-bold col-3">Time remaining</td>
                <td>
                  <div>
                    <span className="fw-bold">Closure Date</span>:{" "}
                    {timeRemainingClosureDate()}
                  </div>
                  <div>
                    <span className="fw-bold">Final Closure Date</span>:{" "}
                    {timeRemainingFinalClosureDate()}
                  </div>
                </td>
              </tr>
              {Object.keys(contribution).length > 0 && (
                <>
                  <tr>
                    <td className="fw-bold col-3">Title</td>
                    <td>{contribution.title}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold col-3">File submissions</td>
                    <td>
                      {contribution.fileDetails.map((file, index) => (
                        <div className="d-flex align-items-center gap-2 mb-3">
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
                </>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning">Submit</Button>
        </Modal.Footer>
      </Modal>
      {contributions.length > 0 && (
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
                  {formatDateTime.toDateTimeString(contribution.submissionDate)}
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
                <td>{contribution.user.email}</td>
                <td>
                  {contribution.user.firstName} {contribution.user.lastName}
                </td>
                <td>
                  <img
                    src={
                      contribution.user.profilePicture
                        ? `/api/users/${contribution.user.userId}/image`
                        : "/image/default-avatar.png"
                    }
                    alt={contribution.user.firstName}
                    width="50"
                    height="50"
                    className="rounded-circle"
                  />
                </td>
                <td>{contribution.user.faculty.name}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    onClick={handleGiveFeedback(contribution.contributionId)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ContributionComponent;
