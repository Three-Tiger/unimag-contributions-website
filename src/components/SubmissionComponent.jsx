import { Button, Card, Modal, Spinner, Table } from "react-bootstrap";
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
import CountdownTimer from "./CountdownTimer";
import { Link } from "react-router-dom";

const SubmissionComponent = ({ annualMagazine }) => {
  const row = [
    "#",
    "Title",
    "Submission Date",
    "Status",
    "Is Published",
    "Action",
  ];
  const isClosed = new Date(annualMagazine.closureDate) < new Date();
  const isFinalClosed = new Date(annualMagazine.finalClosureDate) < new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [contributions, setContributions] = useState([]);
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

  const isDisplaySubmitButton = () => {
    return !isClosed;
  };

  const isDisplayRemoveButton = () => {
    return (
      (!isClosed || !isFinalClosed) && Object.keys(contributions).length > 0
    );
  };

  const isDisplayUpdateButton = () => {
    return (
      (!isClosed || !isFinalClosed) && Object.keys(contributions).length > 0
    );
  };

  const isGraded = () => {
    return contributions.feedbacks?.length > 0;
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
        const newContributions = contributions.filter(
          (contribution) => contribution.contributionId !== id
        );
        setContributions(newContributions);
      } catch (error) {
        handleError.showError(error);
      }
    });
  };

  const showUpdate = () => {
    setModelTitle("Update Contribution");
    setFormContribution({
      contributionId: contributions.contributionId,
      title: contributions.title,
      termAndCondition: true,
    });
    setShow(true);
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
          for (let file of formContribution.fileDetails) {
            if (!checkFileTypeByExtension(file.name)) {
              return handleError.showError({
                response: {
                  status: 400,
                  data: {
                    message: "File type is not supported",
                  },
                },
              });
            }
          }

          const contributionData = {
            contributionId: formContribution.contributionId,
            title: formContribution.title,
            submissionDate: new Date(),
            status: contributions.status,
            isPublished: false,
            userId: userData.userId,
            annualMagazineId: annualMagazine.annualMagazineId,
          };

          // Update contributions
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
      } else {
        try {
          for (let file of formContribution.fileDetails) {
            if (!checkFileTypeByExtension(file.name)) {
              return handleError.showError({
                response: {
                  status: 400,
                  data: {
                    message: "File type is not supported",
                  },
                },
              });
            }
          }

          const contributionData = {
            title: formContribution.title,
            submissionDate: new Date(),
            status: "Waiting",
            userId: userData.userId,
            annualMagazineId: annualMagazine.annualMagazineId,
          };

          // Save contributions
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
              facultyId: userData.faculty.facultyId,
              studentName: userData.firstName + " " + userData.lastName,
              contributionTitle: contributionData.title,
              submissionDate: formatDateTime.toDateTimeString(
                contributionData.submissionDate
              ),
            },
          };
          await emailApi.sendMailAsync(email);

          handleClose();
        } catch (error) {
          handleError.showError(error);
        } finally {
          setIsLoading(false);
        }
      }

      const fetchContribution =
        await contributionApi.getContributionsByAnnualMagazineIdAndUserId(
          annualMagazine.annualMagazineId,
          userData.userId
        );
      setContributions(fetchContribution);
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
        const response =
          await contributionApi.getContributionsByAnnualMagazineIdAndUserId(
            annualMagazine.annualMagazineId,
            user.userId
          );
        console.log(response);
        setContributions(response || {});
      } catch (error) {
        handleError.showError(error);
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
            </tbody>
          </Table>
          <div className="mt-3 text-center">
            {isDisplaySubmitButton() && (
              <Button variant="warning" className="me-2" onClick={handleShow}>
                Submit
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
          <div className="my-5"></div>
          {contributions.length > 0 && (
            <table class="table table-striped">
              <thead>
                <tr>
                  {row.map((item, index) => (
                    <th key={index}>{item}</th>
                  ))}
                </tr>
              </thead>
              {contributions.map((contribution, index) => (
                <tbody>
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
                    <td>
                      <span
                        className={
                          contribution.isPublished
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {contribution.isPublished ? "Published" : "Unreleased"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Link to={`/submission/${contribution.contributionId}`}>
                          <Button
                            variant="outline-warning"
                            // onClick={handleGiveFeedback(
                            //   contribution.contributionId
                            // )}
                          >
                            View
                          </Button>
                        </Link>
                        {isDisplayRemoveButton() && (
                          <Button
                            variant="danger"
                            className="me-2"
                            onClick={handeRemove(contribution.contributionId)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default SubmissionComponent;
