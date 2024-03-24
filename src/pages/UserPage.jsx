import { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/Admin";
import * as yup from "yup";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import facultyApi from "../api/facultyApi";
import swalService from "../services/SwalService";
import handleError from "../services/HandleErrors";
import userApi from "../api/userApi";
import roleApi from "../api/roleApi";
import formatDateTime from "../services/FormatDateTime";

const UserPage = () => {
  const row = [
    "#",
    "Email",
    "First Name",
    "Last Name",
    "Profile",
    "Role",
    "Faculty",
    "Action",
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modelTitle, setModelTitle] = useState("Add new User");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    profilePicture: "",
    newProfilePicture: null,
    facultyId: "",
    roleId: "",
  });
  const [error, setError] = useState({});
  const [previewImage, setPreviewImage] = useState("/image/default-avatar.png");

  const handleClose = () => {
    setShow(false);
    setError({});
    setPreviewImage("/image/default-avatar.png");
    setFormData({
      userId: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
      profilePicture: "",
      newProfilePicture: null,
      facultyId: "",
      roleId: "",
    });
  };

  const handleShow = () => {
    setShow(true);
    setModelTitle("Add new User");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setFormData({
      ...formData,
      newProfilePicture: file,
    });
  };

  // Edit
  const showEdit = (id) => {
    const user = users.find((user) => {
      return user.userId === id;
    });

    if (user.profilePicture) {
      setPreviewImage(`/api/users/${user.userId}/image`);
    } else {
      setPreviewImage("/image/default-avatar.png");
    }

    setFormData((previousState) => {
      return {
        ...previousState,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: formatDateTime.toBirthdayString(user.dateOfBirth),
        phoneNumber: user.phoneNumber,
        address: user.address,
        profilePicture: user.profilePicture,
        facultyId: user.faculty.facultyId,
        roleId: user.role.roleId,
      };
    });

    setShow(true);
    setModelTitle("View/Edit user");
  };

  // Remove
  const handleRemove = (id) => {
    swalService.confirmDelete(async () => {
      try {
        await userApi.delete(id);
        setUsers((previousState) => {
          return previousState.filter((user) => user.userId !== id);
        });
      } catch (error) {
        handleError.showError(error);
      }
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    const filter = users.filter((user) => {
      return user.email.toLowerCase().includes(value.toLowerCase());
    });
    setSearch(filter);
  };

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let modifiedSchema = yup.object().shape({
        email: yup.string().email().required("Email is required"),
        firstName: yup.string().required("First Name is required"),
        lastName: yup.string().required("Last Name is required"),
        dateOfBirth: yup.string().required("Date of Birth is required"),
        phoneNumber: yup
          .string()
          .required("Phone Number is required")
          .matches(/^[0-9]{10}$/, "Phone number is not valid"),
        address: yup.string().required("Address is required"),
        facultyId: yup.string().required("Faculty is required"),
        roleId: yup.string().required("Role is required"),
      });

      // Add password and confirm password validation if they are not empty
      if (formData.userId === "" || formData.password !== "") {
        modifiedSchema = modifiedSchema.concat(
          yup.object().shape({
            password: yup.string().required("Password is required"),
            confirmPassword: yup
              .string()
              .required("Confirm Password is required")
              .oneOf([yup.ref("password"), null], "Passwords must match"),
          })
        );
      }
      await modifiedSchema.validate(formData, { abortEarly: false });

      setIsLoading(true);
      if (formData.userId) {
        try {
          const formDataSubmit = new FormData();
          formDataSubmit.append("userId", formData.userId);
          formDataSubmit.append("email", formData.email);
          formDataSubmit.append("password", formData.password);
          formDataSubmit.append("firstName", formData.firstName);
          formDataSubmit.append("lastName", formData.lastName);
          formDataSubmit.append("dateOfBirth", formData.dateOfBirth);
          formDataSubmit.append("phoneNumber", formData.phoneNumber);
          formDataSubmit.append("address", formData.address);
          formDataSubmit.append("facultyId", formData.facultyId);
          formDataSubmit.append("roleId", formData.roleId);
          formDataSubmit.append("profilePicture", formData.profilePicture);
          formDataSubmit.append(
            "newProfilePicture",
            formData.newProfilePicture
          );

          const response = await userApi.update(formDataSubmit);
          setUsers((previousState) => {
            return previousState.map((user) => {
              if (user.userId === formData.userId) {
                return response;
              }
              return user;
            });
          });
          handleClose();
        } catch (error) {
          console.log("🚀 ~ handleSubmit ~ error:", error);
          handleError.showError(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const formDataSubmit = new FormData();
          formDataSubmit.append("email", formData.email);
          formDataSubmit.append("password", formData.password);
          formDataSubmit.append("firstName", formData.firstName);
          formDataSubmit.append("lastName", formData.lastName);
          formDataSubmit.append("dateOfBirth", formData.dateOfBirth);
          formDataSubmit.append("phoneNumber", formData.phoneNumber);
          formDataSubmit.append("address", formData.address);
          formDataSubmit.append("facultyId", formData.facultyId);
          formDataSubmit.append("roleId", formData.roleId);
          formDataSubmit.append(
            "newProfilePicture",
            formData.newProfilePicture
          );

          const response = await userApi.create(formDataSubmit);
          setUsers((previousState) => {
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
      console.log("🚀 ~ handleSubmit ~ error:", error.inner);
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
        const response = await userApi.getAll();
        setUsers(response);
        const faculties = await facultyApi.getAll();
        setFaculties(faculties);
        const roles = await roleApi.getAll();
        setRoles(roles);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <AdminLayout>
        <h3 className="text-center fw-bold">User Management</h3>
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
            size="lg"
          >
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>{modelTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3 text-center">
                  <label>
                    <img
                      src={previewImage}
                      width={100}
                      height={100}
                      className="rounded-circle mb-2"
                      alt="Preview"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="newProfilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      error.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.email}</div>
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      error.password ? "is-invalid" : ""
                    }`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.password}</div>
                </div>

                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      error.confirmPassword ? "is-invalid" : ""
                    }`}
                    name="confirmPassword"
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">
                    {error.confirmPassword}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Select Role</label>
                  <select
                    className={`form-select ${
                      error.roleId ? "is-invalid" : ""
                    }`}
                    aria-label="Default select example"
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                  >
                    <option value="">Please choose role</option>
                    {roles.map((role, index) => (
                      <option key={index} value={role.roleId}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{error.roleId}</div>
                </div>

                <div className="mb-3">
                  <label>Select Faculty</label>
                  <select
                    className={`form-select ${
                      error.facultyId ? "is-invalid" : ""
                    }`}
                    aria-label="Default select example"
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleChange}
                  >
                    <option value="">Please choose faculty</option>
                    {faculties.map((faculty, index) => (
                      <option key={index} value={faculty.facultyId}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{error.facultyId}</div>
                </div>

                <div className="mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      error.firstName ? "is-invalid" : ""
                    }`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.firstName}</div>
                </div>

                <div className="mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      error.lastName ? "is-invalid" : ""
                    }`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.lastName}</div>
                </div>

                <div className="mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className={`form-control ${
                      error.dateOfBirth ? "is-invalid" : ""
                    }`}
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.dateOfBirth}</div>
                </div>

                <div className="mb-3">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className={`form-control ${
                      error.phoneNumber ? "is-invalid" : ""
                    }`}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.phoneNumber}</div>
                </div>

                <div className="mb-3">
                  <label>Address</label>
                  <textarea
                    className={`form-control ${
                      error.address ? "is-invalid" : ""
                    }`}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{error.address}</div>
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
            {search.length > 0
              ? search.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      <img
                        src={
                          user.profilePicture
                            ? `/api/users/${user.userId}/image`
                            : "/image/default-avatar.png"
                        }
                        alt={user.firstName}
                        width="50"
                        height="50"
                        className="rounded-circle"
                      />
                    </td>
                    <td>{user.role.name}</td>
                    <td>{user.faculty.name}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-warning"
                          onClick={() => showEdit(user.userId)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(user.userId)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              : users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      <img
                        src={
                          user.profilePicture
                            ? `/api/users/${user.userId}/image`
                            : "/image/default-avatar.png"
                        }
                        alt={user.firstName}
                        width="50"
                        height="50"
                        className="rounded-circle"
                      />
                    </td>
                    <td>{user.role.name}</td>
                    <td>{user.faculty.name}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-warning"
                          onClick={() => showEdit(user.userId)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(user.userId)}
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

export default UserPage;
