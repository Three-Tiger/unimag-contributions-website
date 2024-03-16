import { Button, Container } from "react-bootstrap";
import FullLayout from "../components/layouts/Full";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import handleError from "../services/HandleErrors";
import authService from "../services/AuthService";
import formatDateTime from "../services/FormatDateTime";
import facultyApi from "../api/facultyApi";
import * as yup from "yup";
import swalService from "../services/SwalService";
import storageService from "../services/StorageService";

const ProfilePage = () => {
  const [faculties, setFaculties] = useState([]);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    profilePicture: "",
    newProfilePicture: null,
    facultyId: "",
  });
  const [formChangePassword, setFormChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    reNewPassword: "",
  });
  const [error, setError] = useState({});
  const [errorChangePassword, setErrorChangePassword] = useState({});
  const [previewImage, setPreviewImage] = useState("/image/default-avatar.png");

  // Yup validation update profile
  const schema = yup.object().shape({
    email: yup.string(),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    dateOfBirth: yup.string().required("Date of Birth is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    address: yup.string().required("Address is required"),
    facultyId: yup.string().required("Faculty is required"),
  });

  // Yup validation change password
  const schemaChangePassword = yup.object().shape({
    currentPassword: yup.string().required("Current Password is required"),
    newPassword: yup.string().required("New Password is required"),
    reNewPassword: yup
      .string()
      .required("Re-enter New Password is required")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  // Handle change update profile
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle change change password
  const handleChangeChangePassword = (event) => {
    const { name, value } = event.target;
    setFormChangePassword({
      ...formChangePassword,
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
      newProfilePicture: file,
    });
  };

  // Form update profile
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      try {
        const formDataSubmit = new FormData();
        formDataSubmit.append("email", formData.email);
        formDataSubmit.append("firstName", formData.firstName);
        formDataSubmit.append("lastName", formData.lastName);
        formDataSubmit.append("dateOfBirth", formData.dateOfBirth);
        formDataSubmit.append("phoneNumber", formData.phoneNumber);
        formDataSubmit.append("address", formData.address);
        formDataSubmit.append("profilePicture", formData.profilePicture);
        formDataSubmit.append("facultyId", formData.facultyId);
        formDataSubmit.append("newProfilePicture", formData.newProfilePicture);

        const userId = authService.getUserData().userId;
        const response = await userApi.updateProfile(userId, formDataSubmit);
        storageService.save("USER_DATA", response);
        swalService.showMessage(
          "Success",
          "Profile updated successfully",
          "success"
        );
      } catch (error) {
        handleError.showError(error);
      }
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setError(newError);
    }
  };

  // Form change password
  const handleSubmitChangePassword = async (event) => {
    event.preventDefault();
    try {
      await schemaChangePassword.validate(formChangePassword, {
        abortEarly: false,
      });

      try {
        const userId = authService.getUserData().userId;
        const response = await userApi.changePassword(
          userId,
          formChangePassword
        );
        setErrorChangePassword({});
        setFormChangePassword({
          currentPassword: "",
          newPassword: "",
          reNewPassword: "",
        });
        swalService.showMessage("Success", response.message, "success");
      } catch (error) {
        handleError.showError(error);
      }
    } catch (error) {
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setErrorChangePassword(newError);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getUserData();
        const userData = await userApi.getById(user.userId);
        const faculties = await facultyApi.getAll();
        setUser(userData);
        setFaculties(faculties);
        setFormData({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: formatDateTime.toBirthdayString(userData.dateOfBirth),
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          profilePicture: userData.profilePicture,
          facultyId: userData.faculty.facultyId,
        });
        if (userData.profilePicture) {
          setPreviewImage(`/api/users/${userData.userId}/image`);
        }
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <FullLayout>
        <Container>
          <section className="section profile">
            <div className="row">
              <div className="col-xl-4">
                <div className="card">
                  <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                    <img
                      src={
                        user?.profilePicture
                          ? `/api/users/${user?.userId}/image`
                          : "/image/default-avatar.png"
                      }
                      alt="Profile"
                      className="rounded-circle"
                    />
                    <h2>
                      {user.firstName} {user.lastName}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-xl-8">
                <div className="card">
                  <div className="card-body pt-3">
                    <ul className="nav nav-tabs nav-tabs-bordered">
                      <li className="nav-item">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-overview"
                        >
                          Overview
                        </button>
                      </li>

                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-edit"
                        >
                          Edit Profile
                        </button>
                      </li>

                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-change-password"
                        >
                          Change Password
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content pt-2">
                      <div
                        className="tab-pane fade show active profile-overview"
                        id="profile-overview"
                      >
                        <h5 className="card-title">Profile Details</h5>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">Email</div>
                          <div className="col-lg-9 col-md-8">{user.email}</div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label ">
                            First Name
                          </div>
                          <div className="col-lg-9 col-md-8">
                            {user.firstName}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label ">
                            Last Name
                          </div>
                          <div className="col-lg-9 col-md-8">
                            {user.lastName}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label ">
                            Faculty
                          </div>
                          <div className="col-lg-9 col-md-8">
                            {user.faculty?.name}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">DoB</div>
                          <div className="col-lg-9 col-md-8">
                            {formatDateTime.toDateString(user.dateOfBirth)}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">
                            Telephone
                          </div>
                          <div className="col-lg-9 col-md-8">
                            {user.phoneNumber}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg-3 col-md-4 label">Address</div>
                          <div className="col-lg-9 col-md-8">
                            {user.address}
                          </div>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade profile-edit pt-3"
                        id="profile-edit"
                      >
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <label
                              htmlFor="profileImage"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Profile Image
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <img src={previewImage} alt="Profile" />
                              <div className="pt-2 d-flex gap-2">
                                <input
                                  className="form-control"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                                <Button variant="danger">
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="firstName"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              First Name
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="firstName"
                                type="text"
                                className="form-control"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                              />
                              <div className="invalid-feedback">
                                {error.firstName ? error.firstName : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="lastName"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Last Name
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="lastName"
                                type="text"
                                className="form-control"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                              />
                              <div className="invalid-feedback">
                                {error.lastName ? error.lastName : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="faculty"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Faculty
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <select
                                class="form-select"
                                aria-label="Default select example"
                                name="facultyId"
                                onChange={handleChange}
                              >
                                <option value="">
                                  Please choose your faculty
                                </option>
                                {faculties.map((faculty, index) => (
                                  <option
                                    key={index}
                                    value={faculty.facultyId}
                                    selected={
                                      faculty.facultyId == formData.facultyId
                                    }
                                  >
                                    {faculty.name}
                                  </option>
                                ))}
                              </select>
                              <div className="invalid-feedback">
                                {error.facultyId ? error.facultyId : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="company"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              DoB
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="company"
                                type="date"
                                className="form-control"
                                id="company"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                              />
                              <div className="invalid-feedback">
                                {error.dateOfBirth ? error.dateOfBirth : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="phoneNumber"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Telephone
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="phoneNumber"
                                type="text"
                                className="form-control"
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                              />
                              <div className="invalid-feedback">
                                {error.phoneNumber ? error.phoneNumber : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="Address"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Address
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="address"
                                type="text"
                                className="form-control"
                                id="Address"
                                value={formData.address}
                                onChange={handleChange}
                              />
                              <div className="invalid-feedback">
                                {error.address ? error.address : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="Email"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Email
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="email"
                                type="email"
                                readOnly
                                className="form-control"
                                id="Email"
                                value={formData.email}
                              />
                            </div>
                          </div>

                          <div className="text-center">
                            <Button type="submit" variant="warning">
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div
                        className="tab-pane fade pt-3"
                        id="profile-change-password"
                      >
                        <form onSubmit={handleSubmitChangePassword}>
                          <div className="row mb-3">
                            <label
                              htmlFor="currentPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Current Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="currentPassword"
                                type="password"
                                className="form-control"
                                id="currentPassword"
                                onChange={handleChangeChangePassword}
                              />
                              <div className="invalid-feedback">
                                {errorChangePassword.currentPassword
                                  ? errorChangePassword.currentPassword
                                  : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="newPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              New Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="newPassword"
                                type="password"
                                className="form-control"
                                id="newPassword"
                                onChange={handleChangeChangePassword}
                              />
                              <div className="invalid-feedback">
                                {errorChangePassword.newPassword
                                  ? errorChangePassword.newPassword
                                  : ""}
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="renewPassword"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Re-enter New Password
                            </label>
                            <div className="col-md-8 col-lg-9">
                              <input
                                name="reNewPassword"
                                type="password"
                                className="form-control"
                                id="reNewPassword"
                                onChange={handleChangeChangePassword}
                              />
                              <div className="invalid-feedback">
                                {errorChangePassword.reNewPassword
                                  ? errorChangePassword.reNewPassword
                                  : ""}
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">
                              Change Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </FullLayout>
    </>
  );
};

export default ProfilePage;
