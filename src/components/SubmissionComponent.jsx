import { Badge, Button, Card, Modal, Spinner, Table } from "react-bootstrap";
import formatDateTime from "../services/FormatDateTime";
import { useEffect, useState } from "react";
import contributionApi from "../api/contributionApi";
import authService from "../services/AuthService";
import handleError from "../services/HandleErrors";
import * as yup from "yup";
import fileDetailApi from "../api/fileDetailApi";
import imageDetailApi from "../api/imageDetailApi";
import swalService from "../services/SwalService";
import emailApi from "../api/emailApi";
import feedbackApi from "../api/feedbackApi";
import Pusher from "pusher-js";
import CountdownTimer from "./CountdownTimer";

const SubmissionComponent = ({ annualMagazine }) => {
  const isClosed = new Date(annualMagazine.closureDate) < new Date();
  const isFinalClosed = new Date(annualMagazine.finalClosureDate) < new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [contribution, setContribution] = useState({});
  const [modelTitle, setModelTitle] = useState("Add new Contribution");
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

  const handleShow = () => {
    setShow(true);
    setModelTitle("Add new Contribution");
  };

  const handleCloseChildModal = () => setShowChildModal(false);
  const handleOpenChildModal = () => setShowChildModal(true);

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

  const isDisplaySubmitButton = () => {
    return !isClosed && Object.keys(contribution).length === 0;
  };

  const isDisplayRemoveButton = () => {
    return (
      (!isClosed || !isFinalClosed) && Object.keys(contribution).length > 0
    );
  };

  const isDisplayUpdateButton = () => {
    return (
      (!isClosed || !isFinalClosed) && Object.keys(contribution).length > 0
    );
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

  const handeRemove = (id) => () => {
    swalService.confirmDelete(async () => {
      try {
        await contributionApi.remove(id);
        setContribution({});
      } catch (error) {
        handleError.showError(error);
      }
    });
  };

  const showUpdate = () => {
    setModelTitle("Update Contribution");
    setFormContribution({
      contributionId: contribution.contributionId,
      title: contribution.title,
      termAndCondition: true,
    });
    setShow(true);
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
      if (formContribution.contributionId) {
        try {
          const contributionData = {
            contributionId: formContribution.contributionId,
            title: formContribution.title,
            submissionDate: new Date(),
            status: contribution.status,
            isPublished: false,
            userId: authService.getUserData().userId,
            annualMagazineId: annualMagazine.annualMagazineId,
          };

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
        } catch (error) {
          handleError.showError(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const contributionData = {
            title: formContribution.title,
            submissionDate: new Date(),
            status: "Waiting",
            userId: authService.getUserData().userId,
            annualMagazineId: annualMagazine.annualMagazineId,
          };

          // Save contribution
          const response = await contributionApi.save(contributionData);
          const contributionId = response.contributionId;

          const formFileData = new FormData();

          formContribution.fileDetails.forEach((file, index) => {
            formFileData.append(
              `fileDetails[${index}].contributionId`,
              contributionId
            );
            formFileData.append(`fileDetails[${index}].fileUpload`, file);
          });

          // Save file details
          await fileDetailApi.save(formFileData);

          const formImageData = new FormData();
          formContribution.imageDetails.forEach((image, index) => {
            formImageData.append(
              `imageDetails[${index}].contributionId`,
              contributionId
            );
            formImageData.append(`imageDetails[${index}].fileUpload`, image);
          });

          // Save image details
          await imageDetailApi.save(formImageData);

          // Send email to coordinator
          const email = {
            to: "",
            subject: "Notification of Student Contribution Submission",
            content: {
              facultyId: authService.getUserData().faculty.facultyId,
              studentName:
                authService.getUserData().firstName +
                " " +
                authService.getUserData().lastName,
              contributionTitle: contributionData.title,
              submissionDate: formatDateTime.toDateTimeString(
                contributionData.submissionDate
              ),
            },
          };
          await emailApi.sendMailAsync(email);
        } catch (error) {
          console.log("🚀 ~ handleSubmit ~ error:", error);
          handleError.showError(error);
        } finally {
          setIsLoading(false);
        }
      }

      const user = authService.getUserData();
      const fetchContribution =
        await contributionApi.getContributionsByAnnualMagazineIdAndUserId(
          annualMagazine.annualMagazineId,
          user.userId
        );
      setContribution(fetchContribution);
      handleClose();
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
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
        const response =
          await contributionApi.getContributionsByAnnualMagazineIdAndUserId(
            annualMagazine.annualMagazineId,
            user.userId
          );
        setContribution(response || {});
      } catch (error) {
        handleError.showError(error);
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
    <>
      <Card>
        <Card.Body>
          <Card.Title className="text-center">
            <h3 className="fw-bold">{annualMagazine.title}</h3>
          </Card.Title>
          <Card.Subtitle className="mb-4">
            <p className="lh-base">
              <span className="fw-bold">Description: </span>
              {annualMagazine.description}
            </p>
          </Card.Subtitle>

          <Table striped>
            <tbody>
              <tr>
                <td className="fw-bold col-3">Submission Status</td>
                <td>
                  {Object.keys(contribution).length > 0 ? (
                    <p className="text-success fw-bold mb-0">
                      Submitted for grading
                    </p>
                  ) : (
                    <p className="text-danger fw-bold mb-0">No attempt</p>
                  )}
                </td>
              </tr>
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
                    {/* <span className="fw-bold">Closure Date</span>:{" "}
                    {timeRemainingClosureDate()} */}
                    <span className="fw-bold">Closure Date</span>:{" "}
                    <CountdownTimer targetDate={annualMagazine.closureDate} />
                  </div>
                  <div>
                    {/* <span className="fw-bold">Final Closure Date</span>:{" "}
                    {timeRemainingFinalClosureDate()} */}
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
            {isDisplaySubmitButton() && (
              <Button variant="warning" className="me-2" onClick={handleShow}>
                Submit
              </Button>
            )}
            {isDisplayRemoveButton() && (
              <Button
                variant="danger"
                className="me-2"
                onClick={handeRemove(contribution.contributionId)}
              >
                Remove
              </Button>
            )}
            {isDisplayUpdateButton() && (
              <Button variant="outline-warning" onClick={showUpdate}>
                Update
              </Button>
            )}
          </div>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
          >
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
            >
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
                <div class="form-check">
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
                  <label class="form-check-label" for="flexCheckDefault">
                    I confirm that my article adheres to the submission
                    guidelines provided by the website, including specifications
                    on length, formatting, and content.{" "}
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
                      Originality of Content: You confirm that the article you
                      are submitting is your original work and does not infringe
                      upon the intellectual property rights of any third party.
                      Plagiarism will not be tolerated, and any content found to
                      be plagiarized will be rejected.
                    </p>
                    <p>
                      Copyright Ownership: You acknowledge that by submitting an
                      article, you retain the copyright to your work. However,
                      you grant the website a non-exclusive license to publish,
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
          <div className="my-5 py-5"></div>
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
                      <div class="container">
                        {contribution.feedbacks.map((feedback, index) => (
                          <div class="chat-box" key={index}>
                            <div
                              class={
                                feedback.user.userId == userData.userId
                                  ? "user-message"
                                  : "other-message"
                              }
                            >
                              {feedback.user?.userId == userData.userId && (
                                <div class="message">
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
                                class="avatar"
                              />
                              {feedback.user?.userId != userData.userId && (
                                <div class="message">
                                  <pre>{feedback.content}</pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <form onSubmit={handleSendFeedback}>
                          <div class="input-group message-input">
                            <textarea
                              class="form-control"
                              placeholder="Type your message..."
                              rows={3}
                            />
                            <div className="ms-2">
                              <button class="btn btn-warning" type="submit">
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
        </Card.Body>
      </Card>
    </>
  );
};

export default SubmissionComponent;
