import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import FullLayout from "../components/layouts/Full";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import swalService from "../services/SwalService";
import facultyApi from "../api/facultyApi";
import * as yup from "yup";
import userApi from "../api/userApi";

function RegisterPage() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    profilePicture: null,
    facultyId: "",
  });
  const [error, setError] = useState({});
  const [previewImage, setPreviewImage] = useState("/image/default-avatar.png");

  // Yup validation
  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    dateOfBirth: yup.string().required("Date of Birth is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    address: yup.string().required("Address is required"),
    facultyId: yup.string().required("Faculty is required"),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      profilePicture: file,
    });
  };

  // Form
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

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
        formDataSubmit.append("profilePicture", formData.profilePicture);

        await userApi.register(formDataSubmit);
        swalService.showMessageToHandle(
          "Success",
          "Your account has been created successfully.",
          "success",
          () => navigate("/login")
        );
      } catch (error) {
        handleErrors(error);
      }
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setError(newError);
    }
  };

  const handleErrors = (error) => {
    if (error.response.status >= 400 && error.response.status < 500) {
      swalService.showMessage(
        "Warning",
        error.response.data.message,
        "warning"
      );
    } else {
      swalService.showMessage(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await facultyApi.getAll();
        setFaculties(response);
      } catch (error) {
        handleErrors(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <FullLayout>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card bg="light" className="mt-4">
                <Card.Body>
                  <Card.Title className="text-center">
                    <h2 className="fw-bold">Register</h2>
                  </Card.Title>
                  <Card.Text>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3 text-center">
                        <Form.Label>
                          <Image
                            src={previewImage}
                            width={100}
                            height={100}
                            roundedCircle
                          />
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="profilePicture"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.email ? error.email : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.password ? error.password : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.confirmPassword ? error.confirmPassword : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Select Faculty</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="facultyId"
                          onChange={handleChange}
                        >
                          <option>Please choose your faculty</option>
                          {faculties.map((faculty, index) => (
                            <option key={index} value={faculty.facultyId}>
                              {faculty.name}
                            </option>
                          ))}
                        </Form.Select>
                        <div className="invalid-feedback">
                          {error.facultyId ? error.facultyId : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.firstName ? error.firstName : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.lastName ? error.lastName : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.dateOfBirth ? error.dateOfBirth : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.phoneNumber ? error.phoneNumber : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">
                          {error.address ? error.address : ""}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="I agree to the conditions and regulations of UniMagContributions"
                        />
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="warning" type="submit">
                          Sign up
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3 text-center">
                      <div className="border-1">
                        Don’t have an account? <Link to="/login">Login</Link>
                      </div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </FullLayout>
    </>
  );
}

export default RegisterPage;
