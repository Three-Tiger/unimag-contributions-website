import { Button, Image, Modal, Spinner, Table } from "react-bootstrap";
import AdminLayout from "../components/layouts/Admin";
import { useEffect, useState } from "react";
import * as yup from "yup";
import swalService from "../services/SwalService";
import annualMagazineApi from "../api/annualMagazine";
import formatDateTime from "../services/FormatDateTime";
import handleError from "../services/HandleErrors";
import NoData from "/gif/no_data.gif";

const AnnualMagazinePage = () => {
  const row = [
    "#",
    "Academic Year",
    "Title",
    "Description",
    "ClosureDate",
    "FinalClosureDate",
    "Action",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [annualMagazines, setAnnualMagazine] = useState([]);
  const [search, setSearch] = useState([]);
  const [modelTitle, setModelTitle] = useState("Add new Annual Magazine");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    annualMagazineId: "",
    academicYear: "",
    title: "",
    description: "",
    closureDate: "",
    finalClosureDate: "",
  });
  const [error, setError] = useState({});

  const handleClose = () => {
    setShow(false);
    setError({});
    setFormData({
      annualMagazineId: "",
      academicYear: "",
      title: "",
      description: "",
      closureDate: "",
      finalClosureDate: "",
    });
  };

  const handleShow = () => {
    setShow(true);
    setModelTitle("Add new Annual Magazine");
  };

  // Edit
  const showEdit = (id) => {
    const annualMagazine = annualMagazines.find((annualMagazine) => {
      return annualMagazine.annualMagazineId === id;
    });

    setFormData((previousState) => {
      return {
        ...previousState,
        annualMagazineId: annualMagazine.annualMagazineId,
        academicYear: annualMagazine.academicYear,
        title: annualMagazine.title,
        description: annualMagazine.description,
        closureDate: annualMagazine.closureDate,
        finalClosureDate: annualMagazine.finalClosureDate,
      };
    });

    setShow(true);
    setModelTitle("View/Edit Annual Magazine");
  };

  // Remove
  const handleRemove = (id) => {
    swalService.confirmDelete(async () => {
      try {
        await annualMagazineApi.Remove(id);
        setAnnualMagazine((previousState) => {
          return previousState.filter(
            (annualMagazine) => annualMagazine.annualMagazineId !== id
          );
        });
      } catch (error) {
        handleError.showError(error);
      }
    });
  };

  // Yup validation
  const schema = yup.object().shape({
    academicYear: yup.string().required("Academic Year is required"),
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    closureDate: yup.string().required("Closure Date is required"),
    finalClosureDate: yup.string().required("Final Closure Date is required"),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    const filter = annualMagazines.filter((annualMagazine) => {
      return annualMagazine.academicYear
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    setSearch(filter);
  };

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      setIsLoading(true);
      if (formData.annualMagazineId) {
        try {
          const response = await annualMagazineApi.Update(formData);
          setAnnualMagazine((previousState) => {
            return previousState.map((annualMagazine) => {
              if (
                annualMagazine.annualMagazineId === formData.annualMagazineId
              ) {
                return response;
              }
              return annualMagazine;
            });
          });
          handleClose();
        } catch (error) {
          handleError.showError(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const response = await annualMagazineApi.AddNew(formData);
          setAnnualMagazine((previousState) => {
            return [response, ...previousState];
          });
          handleClose();
        } catch (error) {
          handleError.showError(error);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setError(newError);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await annualMagazineApi.getAll();
        setAnnualMagazine(response);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AdminLayout>
        <h3 className="text-center fw-bold">Annual Magazine Management</h3>
        <nav className="navbar navbar-light bg-light mb-2">
          <div>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={handleSearch}
            />
          </div>
          <Button variant="warning" onClick={handleShow}>
            <i className="bi bi-plus-circle"></i> Add
          </Button>

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
                  <label htmlFor="academicYear" className="form-label">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      error.academicYear ? "is-invalid" : ""
                    }`}
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.academicYear}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      error.title ? "is-invalid" : ""
                    }`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.title}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    type="text"
                    className={`form-control ${
                      error.description ? "is-invalid" : ""
                    }`}
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.description}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="closureDate" className="form-label">
                    Closure Date
                  </label>
                  <input
                    type="datetime-local"
                    className={`form-control ${
                      error.closureDate ? "is-invalid" : ""
                    }`}
                    id="closureDate"
                    name="closureDate"
                    value={formData.closureDate}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.closureDate}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="finalClosureDate" className="form-label">
                    Final Closure Date
                  </label>
                  <input
                    type="datetime-local"
                    className={`form-control ${
                      error.finalClosureDate ? "is-invalid" : ""
                    }`}
                    id="finalClosureDate"
                    name="finalClosureDate"
                    value={formData.finalClosureDate}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">
                    {error.finalClosureDate}
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
        </nav>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {row.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {annualMagazines.length === 0 && (
              <tr>
                <td colSpan={row.length} className="text-center py-4">
                  <Image
                    src={NoData}
                    alt="No data"
                    width={300}
                    className="my-5 py-5"
                  />
                </td>
              </tr>
            )}
            {search.length > 0
              ? search.map((annualMagazine, index) => (
                  <tr key={index}>
                    <td className="col">{index + 1}</td>
                    <td className="col-1">{annualMagazine.academicYear}</td>
                    <td className="col-2">{annualMagazine.title}</td>
                    <td className="col-4">{annualMagazine.description}</td>
                    <td className="col">
                      {formatDateTime.toDateTimeString(
                        annualMagazine.closureDate
                      )}
                    </td>
                    <td className="col">
                      {formatDateTime.toDateTimeString(
                        annualMagazine.finalClosureDate
                      )}
                    </td>
                    <td className="col">
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-warning"
                          onClick={() =>
                            showEdit(annualMagazine.annualMagazineId)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleRemove(annualMagazine.annualMagazineId)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              : annualMagazines.map((annualMagazine, index) => (
                  <tr key={index}>
                    <td className="col">{index + 1}</td>
                    <td className="col-1">{annualMagazine.academicYear}</td>
                    <td className="col-2">{annualMagazine.title}</td>
                    <td className="col-4">{annualMagazine.description}</td>
                    <td className="col">
                      {formatDateTime.toDateTimeString(
                        annualMagazine.closureDate
                      )}
                    </td>
                    <td className="col">
                      {formatDateTime.toDateTimeString(
                        annualMagazine.finalClosureDate
                      )}
                    </td>
                    <td className="col">
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-warning"
                          onClick={() =>
                            showEdit(annualMagazine.annualMagazineId)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleRemove(annualMagazine.annualMagazineId)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </AdminLayout>
    </>
  );
};

export default AnnualMagazinePage;
