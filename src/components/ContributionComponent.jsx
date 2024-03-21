import { useEffect, useRef, useState } from "react";
import contributionApi from "../api/contributionApi";
import handleError from "../services/HandleErrors";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import formatDateTime from "../services/FormatDateTime";
import feedbackApi from "../api/feedbackApi";
import authService from "../services/AuthService";
import fileDetailApi from "../api/fileDetailApi";
import swalService from "../services/SwalService";

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
  const [formData, setFormData] = useState({
    status: "",
    content: "",
  });
  const [userData, setUserData] = useState(null);
  const bottomOfChatRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    setFormData({
      status: "",
      content: "",
    });
  };

  const handleShow = () => {
    setShow(true);
    scrollToBottom();
  };

  const handleGiveFeedback = (id) => async () => {
    const response = await contributionApi.getById(id);
    setContribution(response);
    setFormData({
      status: response.status,
      content: "",
    });
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

  const isManager = () => {
    return authService.getUserData().role.name === "Manager";
  };

  const downloadAll = async () => {
    const listContributions = contributions.map((contribution) => {
      return contribution.contributionId;
    });
    const response = await fileDetailApi.downloadFileByListContributionId(
      listContributions
    );
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `all-contributions-${annualMagazine.academicYear}.zip`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (contribution.status != formData.status) {
      const contributionData = {
        contributionId: contribution.contributionId,
        title: contribution.title,
        submissionDate: contribution.submissionDate,
        status: formData.status,
        userId: contribution.user.userId,
        annualMagazineId: annualMagazine.annualMagazineId,
      };
      // Update contribution
      await contributionApi.update(contributionData);

      // Update status in the state
      setContribution({ ...contribution, status: formData.status });

      // Update status in the contributions state
      setContributions((previousState) => {
        return previousState.map((c) => {
          if (c.contributionId === contribution.contributionId) {
            return {
              ...c,
              status: formData.status,
            };
          }
          return c;
        });
      });

      swalService.showMessage(
        "Success",
        `You have set the status to ${formData.status}`,
        "success"
      );
    }

    if (formData.content) {
      const feedbackData = {
        content: formData.content,
        feedbackDate: new Date(),
        userId: userData.userId,
        contributionId: contribution.contributionId,
      };

      const response = await feedbackApi.save(feedbackData);

      const newContribution = { ...contribution };
      newContribution.feedbacks.push(response);
      setContribution(newContribution);

      // Clear content
      setFormData({ ...formData, content: "" });
      document.querySelector(".message-input textarea").value = "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await contributionApi.getContributionsByAnnualMagazineId(
            annualMagazine.annualMagazineId
          );
        setContributions(response);
        const user = authService.getUserData();
        setUserData(user);
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
          <table className="table table-striped">
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
                </>
              )}
            </tbody>
          </table>
          <div className="my-5 py-5"></div>
          {isManager() ? (
            <div>
              {contribution.feedbacks?.length > 0 && (
                <Table striped>
                  <tbody>
                    <tr>
                      <td className="fw-bold col-3">Status</td>
                      <td>
                        {contribution.status == "Approved" ? (
                          <Badge bg="success">{contribution.status}</Badge>
                        ) : (
                          <Badge bg="danger">{contribution.status}</Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold col-3">Feedback on</td>
                      <td>
                        {formatDateTime.toDateTimeString(
                          contribution.feedbacks[0].feedbackDate
                        )}
                      </td>
                    </tr>
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
                    {/* <tr>
                      <td className="fw-bold col-3">Feedback comment</td>
                      <td className="col-9">
                        <pre>{contribution.feedbacks[0].content}</pre>
                      </td>
                    </tr> */}
                  </tbody>
                </Table>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="message-list">
                {Object.keys(contribution).length > 0 &&
                  contribution.feedbacks.map((feedback, index) => (
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
                <div ref={bottomOfChatRef}></div>
              </div>
              <div className="mb-3">
                <label htmlFor="facultyName" className="form-label">
                  Your decision (choose one option)
                </label>
                <div>
                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="warning-outlined"
                    value="Waiting"
                    autoComplete="off"
                    checked={formData.status === "Waiting"}
                    onChange={handleChange}
                  />
                  <label
                    className="btn btn-outline-warning me-2"
                    htmlFor="warning-outlined"
                  >
                    Waiting
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="success-outlined"
                    value="Approved"
                    autoComplete="off"
                    checked={formData.status === "Approved"}
                    onChange={handleChange}
                  />
                  <label
                    className="btn btn-outline-success me-2"
                    htmlFor="success-outlined"
                  >
                    Approve
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="status"
                    id="danger-outlined"
                    value="Rejected"
                    autoComplete="off"
                    checked={formData.status === "Rejected"}
                    onChange={handleChange}
                  />
                  <label
                    className="btn btn-outline-danger"
                    htmlFor="danger-outlined"
                  >
                    Reject
                  </label>
                </div>
              </div>
              <div className="input-group message-input">
                <textarea
                  className="form-control"
                  placeholder="Type your message..."
                  name="content"
                  rows={3}
                  onChange={handleChange}
                />
                <div className="ms-2">
                  <button className="btn btn-warning" type="submit">
                    Send
                  </button>
                </div>
              </div>
            </form>
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
          {isManager() && (
            <div className="mb-2 text-end">
              <Button variant="outline-warning" onClick={() => downloadAll()}>
                Download All
              </Button>
            </div>
          )}
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
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant="outline-warning"
                        onClick={handleGiveFeedback(
                          contribution.contributionId
                        )}
                      >
                        View
                      </Button>
                      <Button variant="outline-success">Publish</Button>
                      <Button variant="outline-danger">Unreleased</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default ContributionComponent;
