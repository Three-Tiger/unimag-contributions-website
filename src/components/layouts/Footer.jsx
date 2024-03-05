import { Container, Nav, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container fluid>
        <Navbar expand="lg" variant="light" bg="light" className="py-3 my-4">
          <Nav className="mx-auto">
            <Nav.Link href="#" className="text-body-secondary px-2">
              Home
            </Nav.Link>
            <Nav.Link href="#" className="text-body-secondary px-2">
              Features
            </Nav.Link>
            <Nav.Link href="#" className="text-body-secondary px-2">
              Pricing
            </Nav.Link>
            <Nav.Link href="#" className="text-body-secondary px-2">
              FAQs
            </Nav.Link>
            <Nav.Link href="#" className="text-body-secondary px-2">
              About
            </Nav.Link>
          </Nav>
        </Navbar>
        <p className="text-center text-body-secondary">
          © 2024 Unimang Contributions, Inc
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
