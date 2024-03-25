import { Button, Image, Modal, Spinner, Table } from "react-bootstrap";
import AdminLayout from "../components/layouts/Admin";
import { useEffect, useState } from "react";
import * as yup from "yup";
import facultyApi from "../api/facultyApi";
import swalService from "../services/SwalService";
import handleError from "../services/HandleErrors";
import NoData from "/gif/no_data.gif";

const FacultyPage = () => {
  const row = ["#", "Name", "Description", "Action"];
  const [isLoading, setIsLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState([]);
  const [modelTitle, setModelTitle] = useState("Add new Faculty");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    facultyId: "",
    name: "",
    description: "",
  });
  const [error, setError] = useState({});

  const handleClose = () => {
    setShow(false);
    setError({});
    setFormData({
      facultyId: "",
      name: "",
      description: "",
    });
  };

  const handleShow = () => {
    setShow(true);
    setModelTitle("Add new Faculty");
  };

  // Edit
  const showEdit = (id) => {
    const faculty = faculties.find((faculty) => {
      return faculty.facultyId === id;
    });

    setFormData((previousState) => {
      return {
        ...previousState,
        facultyId: faculty.facultyId,
        name: faculty.name,
        description: faculty.description,
      };
    });

    setShow(true);
    setModelTitle("View/Edit Faculty");
  };

  // Remove
  const handleRemove = (id) => {
    swalService.confirmDelete(async () => {
      try {
        await facultyApi.Remove(id);
        setFaculties((previousState) => {
          return previousState.filter((faculty) => faculty.facultyId !== id);
        });
      } catch (error) {
        handleError.showError(error);
      }
    });
  };

  // Yup validation
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
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
    const filter = faculties.filter((faculty) => {
      return faculty.name.toLowerCase().includes(value.toLowerCase());
    });
    setSearch(filter);
  };

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      setIsLoading(true);
      if (formData.facultyId) {
        try {
          const response = await facultyApi.Update(formData);
          setFaculties((previousState) => {
            return previousState.map((faculty) => {
              if (faculty.facultyId === formData.facultyId) {
                return response;
              }
              return faculty;
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
          const response = await facultyApi.AddNew(formData);
          setFaculties((previousState) => {
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
        const response = await facultyApi.getAll();
        setFaculties(response);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AdminLayout>
        <h3 className="text-center fw-bold">Faculty Management</h3>
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
                  <label htmlFor="facultyName" className="form-label">
                    Name of Faculty
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.name ? "is-invalid" : ""}`}
                    id="facultyName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.name}</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="facultyDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    type="text"
                    className={`form-control ${
                      error.description ? "is-invalid" : ""
                    }`}
                    id="facultyDescription"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.description}</div>
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
            {faculties.length === 0 && (
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
              ? search.map((faculty, index) => (
                  <tr key={index}>
                    <td className="col">{index + 1}</td>
                    <td className="col-2">{faculty.name}</td>
                    <td className="col-8">{faculty.description}</td>
                    <td className="col">
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-warning"
                          onClick={() => showEdit(faculty.facultyId)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(faculty.facultyId)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              : faculties.map((faculty, index) => (
                  <tr key={index}>
                    <td className="col">{index + 1}</td>
                    <td className="col-2">{faculty.name}</td>
                    <td className="col-8">{faculty.description}</td>
                    <td className="col">
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-warning"
                          onClick={() => showEdit(faculty.facultyId)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(faculty.facultyId)}
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

export default FacultyPage;
