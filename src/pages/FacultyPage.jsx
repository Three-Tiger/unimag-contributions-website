import { Button, Modal, Table } from "react-bootstrap";
import AdminLayout from "../components/layouts/Admin";
import { useState } from "react";
import { Form } from "react-router-dom";
import * as yup from "yup";
import Swal from "sweetalert2";

function FacultyPage() {
  // Modal
  const [modelTitle, setModelTitle] = useState("Add new Faculty");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setError({});
    setFormData({
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
    const faculty = faculties.find((faculty) => faculty.id === id);

    setFormData({
      name: faculty.name,
      description: faculty.description,
    });

    setShow(true);
    setModelTitle("View/Edit Faculty");
  };

  // Remove
  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this faculty!",
      icon: "warning",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  };

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Error
  const [error, setError] = useState({});

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

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      console.log(formData);

      handleClose();
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setError(newError);
    }
  };

  const row = ["#", "Name", "Description", "Action"];

  const faculties = [
    {
      id: "a1",
      name: "Information Technology",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
    {
      id: "a2",
      name: "Computer Science",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
    {
      id: "a3",
      name: "Artificial intelligence",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
    {
      id: "a4",
      name: "Business administration",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
    {
      id: "a5",
      name: "Event management",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
    {
      id: "a6",
      name: "Graphic design",
      description:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    },
  ];

  return (
    <>
      <AdminLayout>
        <h3 className="text-center fw-bold">Faculty Management</h3>
        <nav className="navbar navbar-light bg-light mb-2">
          <div className="container-fluid">
            <Form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <Button variant="outline-warning" type="submit">
                Search
              </Button>
            </Form>
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
                    <label htmlFor="facultyName" className="form-label">
                      Name of Faculty
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="facultyName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      {error.name ? error.name : ""}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="facultyDescription" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="facultyDescription"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      {error.description ? error.description : ""}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    Add
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
          </div>
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
            {faculties.map((faculty, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{faculty.name}</td>
                <td>{faculty.description}</td>
                <td className="d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-warning"
                    onClick={() => showEdit(faculty.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemove(faculty.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </AdminLayout>
    </>
  );
}

export default FacultyPage;
