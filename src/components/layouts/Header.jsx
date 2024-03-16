import React, { useEffect, useState } from "react";
import UniLogo from "/image/logo.png";
import {
  Button,
  Container,
  Dropdown,
  Image,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import swalService from "../../services/SwalService";

const Header = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getUserData();
    setUserData(user);
  }, []);

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const handleLogout = () => {
    swalService.confirmToHandle(
      "Are you sure you want to logout?",
      "warning",
      () => {
        authService.logout();
        navigate("/");
      }
    );
  };

  return (
    <header>
      <Container fluid>
        <Navbar bg="warning" className="p-4"></Navbar>
      </Container>
      <Container fluid>
        <Navbar expand="md" className="bg-body-tertiary mb-3">
          <Container>
            <Navbar.Brand href="#">
              <Link to="/">
                <img
                  src={UniLogo}
                  width="65"
                  height="65"
                  className="d-inline-block align-top"
                  alt="Uni logo"
                />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-md"
              aria-labelledby="offcanvasNavbarLabel-expand-md"
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-md">
                  Unimang Contributions
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-start flex-grow-1 text-center">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                  <Link className="nav-link" to="/article">
                    Article
                  </Link>
                  <Link className="nav-link" to="/submission">
                    Submission
                  </Link>
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                  <Link className="nav-link" to="/contact">
                    Contact
                  </Link>
                </Nav>
                <div className="text-center">
                  {isAuthenticated() ? (
                    <>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-light dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <Image
                            src={
                              userData?.profilePicture
                                ? `/api/users/${userData?.userId}/image`
                                : "/image/default-avatar.png"
                            }
                            width={30}
                            height={30}
                            roundedCircle
                          />
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" href="#">
                              Hi {userData?.firstName}
                            </a>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <Link className="dropdown-item" to="/profile">
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="my-contribution"
                            >
                              My Contribution
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={handleLogout}
                            >
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button variant="outline-warning" className="me-2">
                          Sign Up
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="warning" className="me-4">
                          Login
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
