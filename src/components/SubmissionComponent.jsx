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
import TextToHtmlConverter from "./TextToHtmlConverter";
import emailApi from "../api/emailApi";

const SubmissionComponent = ({ annualMagazine }) => {
  const isClosed = new Date(annualMagazine.closureDate) < new Date();
  const isFinalClosed = new Date(annualMagazine.finalClosureDate) < new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [contribution, setContribution] = useState({});
  const [modelTitle, setModelTitle] = useState("Add new Contribution");
  const [show, setShow] = useState(false);
  const [formContribution, setFormContribution] = useState({
    contributionId: "",
    title: "",
    fileDetails: [],
    imageDetails: [],
  });
  const [errorContribution, setErrorContribution] = useState({});

  const handleClose = () => {
    setShow(false);
    setErrorContribution({});
    setFormContribution({
      contributionId: "",
      title: "",
      fileDetails: [],
      imageDetails: [],
    });
  };

  const handleShow = () => {
    setShow(true);
    setModelTitle("Add new Contribution");
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
    });
    setShow(true);
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
        const response =
          await contributionApi.getContributionsByAnnualMagazineIdAndUserId(
            annualMagazine.annualMagazineId,
            user.userId
          );
        setContribution(response);
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error);
        // handleError.showError(error);
      }
    };

    fetchData();
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
            <form onSubmit={handleSubmit}>
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
                    className="form-control"
                    id="contributionTitle"
                    name="title"
                    value={formContribution.title}
                    onChange={handleContributionChange}
                  />
                  <div className="invalid-feedback">
                    {errorContribution.title ? errorContribution.title : ""}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="formFileMultiple" className="form-label">
                    Choose your files
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFileMultiple"
                    multiple
                    name="fileDetails"
                    onChange={handleFileChange}
                  />
                  <div className="invalid-feedback">
                    {errorContribution.fileDetails
                      ? errorContribution.fileDetails
                      : ""}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="formImageMultiple" className="form-label">
                    Choose your images
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formImageMultiple"
                    multiple
                    name="imageDetails"
                    onChange={handleImageChange}
                  />
                  <div className="invalid-feedback">
                    {errorContribution.imageDetails
                      ? errorContribution.imageDetails
                      : ""}
                  </div>
                </div>
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
                  <tr>
                    <td className="fw-bold col-3">Feedback comment</td>
                    <td>
                      {/* <TextToHtmlConverter
                        text={contribution.feedbacks[0].content}
                      /> */}
                      <pre>{contribution.feedbacks[0].content}</pre>
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
