import React from "react";
import UniLogo from "/image/logo.png";
import { Button, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
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
                <Nav className="justify-content-start flex-grow-1 pe-3 text-center">
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="#action2">Faculty</Nav.Link>
                  <Nav.Link href="#action3">About</Nav.Link>
                  <Nav.Link href="#action4">Contact</Nav.Link>
                </Nav>
                <div className="text-center">
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

                  <Link to="/contribution">
                    <Button variant="outline-warning" className="me-2">
                      Contribution
                    </Button>
                  </Link>
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
