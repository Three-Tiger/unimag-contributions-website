import { useEffect, useState } from "react";
import FullLayout from "../components/layouts/Full";
import {
  Button,
  Badge,
  Col,
  Container,
  Row,
  Spinner,
  Modal,
  Table,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import contributionApi from "../api/contributionApi";
import formatDateTime from "../services/FormatDateTime";
import * as yup from "yup";
import CountdownTimer from "../components/CountdownTimer";
import handleError from "../services/HandleErrors";
import authService from "../services/AuthService";
import fileDetailApi from "../api/fileDetailApi";
import imageDetailApi from "../api/imageDetailApi";
import Pusher from "pusher-js";
import feedbackApi from "../api/feedbackApi";

const SubmissionDetailPage = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [contribution, setContribution] = useState({});
  const [annualMagazine, setAnnualMagazine] = useState({});
  const [isClosed, setIsClosed] = useState(new Date());
  const [isFinalClosed, setIsFinalClosed] = useState(new Date());
  const [modelTitle, setModelTitle] = useState("");
  const [show, setShow] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [formContribution, setFormContribution] = useState({
    contributionId: "",
    title: "",
    fileDetails: [],
    imageDetails: [],
    termAndCondition: false,
  });
  const [errorContribution, setErrorContribution] = useState({});
  const [userData, setUserData] = useState(null);

  const handleClose = () => {
    setShow(false);
    setErrorContribution({});
    setFormContribution({
      contributionId: "",
      title: "",
      fileDetails: [],
      imageDetails: [],
      termAndCondition: false,
    });
  };

  const showUpdate = () => {
    setModelTitle("Update Contribution");
    setFormContribution({
      contributionId: contribution.contributionId,
      title: contribution.title,
      termAndCondition: false,
    });
    setShow(true);
  };

  const handleCloseChildModal = () => setShowChildModal(false);
  const handleOpenChildModal = () => setShowChildModal(true);

  const isDisplayUpdateButton = () => {
    return (
      (!isClosed || !isFinalClosed) && Object.keys(contribution).length > 0
    );
  };

  const downloadFile = async (fileId, fileName) => {
    const response = await fileDetailApi.downloadFile(fileId);
    generateDownloadLink(response, fileName);
  };

  const generateDownloadLink = async (file, fileName) => {
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const feedbackRemainingDate = () => {
    console.log(contribution);
    const submissionDate = new Date(contribution.submissionDate);
    const after14Days = new Date(
      submissionDate.setDate(submissionDate.getDate() + 14)
    );
    return after14Days;
  };

  const isFeedbackExpired = () => {
    return feedbackRemainingDate() < new Date();
  };

  const isGraded = () => {
    return contribution.feedbacks?.length > 0;
  };

  // yup validation
  const schemaContribution = yup.object().shape({
    title: yup.string().required("Title is required"),
    imageDetails: yup.array().min(1, "Image is required"),
    fileDetails: yup.array().min(1, "File is required"),
    termAndCondition: yup.boolean().oneOf([true], "You must accept the terms"),
  });

  const handleContributionChange = (event) => {
    const { name, value } = event.target;
    setFormContribution({
      ...formContribution,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    var fileDetails = [];
    Object.keys(event.target.files).forEach((key) => {
      fileDetails.push(event.target.files[key]);
    });
    setFormContribution({
      ...formContribution,
      fileDetails: fileDetails,
    });
  };

  const handleImageChange = (event) => {
    var imageDetails = [];
    Object.keys(event.target.files).forEach((key) => {
      imageDetails.push(event.target.files[key]);
    });
    setFormContribution({
      ...formContribution,
      imageDetails: imageDetails,
    });
  };

  const handleCheckboxChange = (event) => {
    setFormContribution({
      ...formContribution,
      termAndCondition: event.target.checked,
    });
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const checkFileTypeByExtension = (filename) => {
    const extension = getFileExtension(filename).toLowerCase();
    const docExtensions = ["doc", "docx"];

    if (docExtensions.includes(extension)) {
      return true;
    }

    return false;
  };

  const checkImageTypeByExtension = (filename) => {
    const extension = getFileExtension(filename).toLowerCase();
    const docExtensions = ["jpg", "jpeg", "png"];

    if (docExtensions.includes(extension)) {
      return true;
    }

    return false;
  };

  const handleSendFeedback = async (event) => {
    event.preventDefault();
    const content = event.target[0].value;
    if (!content) {
      return;
    }
    const feedbackData = {
      content: content,
      feedbackDate: new Date(),
      userId: userData.userId,
      contributionId: contribution.contributionId,
    };

    await feedbackApi.save(feedbackData);

    event.target[0].value = "";
  };

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schemaContribution.validate(formContribution, {
        abortEarly: false,
      });

      setIsLoading(true);
      try {
        if (
          formContribution.fileDetails &&
          formContribution.fileDetails.length > 0
        ) {
          for (let file of formContribution.fileDetails) {
            if (!checkFileTypeByExtension(file.name)) {
              return handleError.showError({
                response: {
                  status: 400,
                  data: {
                    message: "Only .docx file is supported",
                  },
                },
              });
            }
          }
        }

        if (
          formContribution.imageDetails &&
          formContribution.imageDetails.length > 0
        ) {
          for (let image of formContribution.imageDetails) {
            if (!checkImageTypeByExtension(image.name)) {
              return handleError.showError({
                response: {
                  status: 400,
                  data: {
                    message: "Only .jpg, .jpeg, .png file is supported",
                  },
                },
              });
            }
          }
        }

        const contributionData = {
          contributionId: formContribution.contributionId,
          title: formContribution.title,
          submissionDate: new Date(),
          status: contribution.status,
          isPublished: false,
          userId: userData.userId,
          annualMagazineId: annualMagazine.annualMagazineId,
        };
        console.log("🚀 ~ handleSubmit ~ contributionData:", contributionData);

        // Update contribution
        await contributionApi.update(contributionData);

        // Save file details
        if (formContribution.fileDetails) {
          // Delete old file details
          await fileDetailApi.removeFileByContributionId(
            formContribution.contributionId
          );

          const formFileData = new FormData();

          formContribution.fileDetails.forEach((file, index) => {
            formFileData.append(
              `fileDetails[${index}].contributionId`,
              formContribution.contributionId
            );
            formFileData.append(`fileDetails[${index}].fileUpload`, file);
          });

          // Save file details
          await fileDetailApi.save(formFileData);
        }

        // Save image details
        if (formContribution.imageDetails) {
          // Delete old image details
          await imageDetailApi.removeImageByContributionId(
            formContribution.contributionId
          );

          const formImageData = new FormData();
          formContribution.imageDetails.forEach((image, index) => {
            formImageData.append(
              `imageDetails[${index}].contributionId`,
              formContribution.contributionId
            );
            formImageData.append(`imageDetails[${index}].fileUpload`, image);
          });

          // Save image details
          await imageDetailApi.save(formImageData);
        }

        handleClose();
      } catch (error) {
        handleError.showError(error);
      } finally {
        setIsLoading(false);
      }

      const fetchContribution = await contributionApi.getById(
        formContribution.contributionId
      );
      setContribution(fetchContribution);
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setErrorContribution(newError);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getUserData();
        setUserData(user);

        const response = await contributionApi.getById(id);
        setContribution(response);
        setAnnualMagazine(response.annualMagazine);

        setIsClosed(new Date(annualMagazine.closureDate) < new Date());
        setIsFinalClosed(
          new Date(annualMagazine.finalClosureDate) < new Date()
        );
      } catch (error) {
        // Handle error here
      }
    };

    const initializePusher = () => {
      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      const pusher = new Pusher("225d52aa0ca3ec6aaebe", {
        cluster: "ap1",
      });

      const channel = pusher.subscribe("unimag-chat");
      channel.bind("message", async function (data) {
        await fetchData();
      });
    };

    const fetchDataAndInitializePusher = async () => {
      await fetchData();
      initializePusher();
    };

    fetchDataAndInitializePusher();
  }, []);

  return (
    <FullLayout>
      <Container>
        <Button
          className="mb-3"
          variant="outline-warning"
          onClick={() => navigate(-1)}
        >
          <i class="bi bi-arrow-left"></i>
        </Button>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{modelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="contributionTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errorContribution.title ? "is-invalid" : ""
                  }`}
                  id="contributionTitle"
                  name="title"
                  value={formContribution.title}
                  onChange={handleContributionChange}
                />
                <div className="invalid-feedback">
                  {errorContribution.title}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formFileMultiple" className="form-label">
                  Choose your files
                </label>
                <input
                  className={`form-control ${
                    errorContribution.fileDetails ? "is-invalid" : ""
                  }`}
                  type="file"
                  id="formFileMultiple"
                  accept=".docx"
                  multiple
                  name="fileDetails"
                  onChange={handleFileChange}
                />
                <div className="invalid-feedback">
                  {errorContribution.fileDetails}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formImageMultiple" className="form-label">
                  Choose your images
                </label>
                <input
                  className={`form-control ${
                    errorContribution.imageDetails ? "is-invalid" : ""
                  }`}
                  type="file"
                  id="formImageMultiple"
                  accept=".jpg, .jpeg, .png"
                  multiple
                  name="imageDetails"
                  onChange={handleImageChange}
                />
                <div className="invalid-feedback">
                  {errorContribution.imageDetails}
                </div>
              </div>
              <div className="form-check">
                <input
                  className={`form-check-input ${
                    errorContribution.termAndCondition ? "is-invalid" : ""
                  }`}
                  type="checkbox"
                  id="flexCheckDefault"
                  name="termAndCondition"
                  value=""
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" for="flexCheckDefault">
                  I confirm that my article adheres to the submission guidelines
                  provided by the website, including specifications on length,
                  formatting, and content.{" "}
                  <span>
                    <a href="#" onClick={handleOpenChildModal}>
                      Term and Condition
                    </a>
                  </span>
                </label>
                <div className="invalid-feedback">
                  {errorContribution.termAndCondition}
                </div>
              </div>
              {/* Child Modal */}
              <Modal
                show={showChildModal}
                onHide={handleCloseChildModal}
                backdrop="static"
                keyboard={false}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Term and Condition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Submission Guidelines: By submitting an article, you agree
                    to adhere to the submission guidelines provided by the
                    website. These guidelines may include specifications
                    regarding article length, formatting, citation style (if
                    applicable), and content requirements.
                  </p>
                  <p>
                    Originality of Content: You confirm that the article you are
                    submitting is your original work and does not infringe upon
                    the intellectual property rights of any third party.
                    Plagiarism will not be tolerated, and any content found to
                    be plagiarized will be rejected.
                  </p>
                  <p>
                    Copyright Ownership: You acknowledge that by submitting an
                    article, you retain the copyright to your work. However, you
                    grant the website a non-exclusive license to publish,
                    reproduce, distribute, and display your article on the
                    website and its affiliated platforms.
                  </p>
                  <p>
                    ccuracy and Legality: You certify that the information
                    presented in your article is accurate to the best of your
                    knowledge and does not violate
                  </p>
                  <p>
                    ccuracy and Legality: You certify that the information
                    presented in your article is accurate to the best of your
                    knowledge and does not violate
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="warning" onClick={handleCloseChildModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="warning" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" variant="dark" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <Table striped>
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
                  <CountdownTimer targetDate={annualMagazine.closureDate} />
                </div>
                <div>
                  <span className="fw-bold">Final Closure Date</span>:{" "}
                  <CountdownTimer
                    targetDate={annualMagazine.finalClosureDate}
                  />
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
                            href="#"
                            key={index}
                            onClick={() =>
                              downloadFile(file.fileId, file.fileName)
                            }
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
        </Table>
        <div className="mt-3 text-center">
          {isDisplayUpdateButton() && (
            <Button variant="outline-warning" onClick={showUpdate}>
              Update
            </Button>
          )}
        </div>
        <div className="my-5 py-2"></div>
        {Object.keys(contribution).length > 0 &&
          contribution.feedbacks.length > 0 && (
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
                      <p className="mb-0">
                        {contribution.feedbacks[0].user.firstName}{" "}
                        {contribution.feedbacks[0].user.lastName}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold col-3">Feedback comment</td>
                  <td>
                    <div className="container">
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
                      <form
                        onSubmit={handleSendFeedback}
                        className={`${isFeedbackExpired() && "d-none"}`}
                      >
                        <div className="input-group message-input">
                          <textarea
                            className="form-control"
                            placeholder="Type your message..."
                            rows={3}
                          />
                          <div className="ms-2">
                            <button className="btn btn-warning" type="submit">
                              Send
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
      </Container>
    </FullLayout>
  );
};

export default SubmissionDetailPage;
