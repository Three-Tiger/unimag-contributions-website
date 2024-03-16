import { Link, useNavigate } from "react-router-dom";
import swalService from "../../services/SwalService";
import authService from "../../services/AuthService";

const SideBar = () => {
  const navigate = useNavigate();

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
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link " to="/admin/dashboard">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/admin/faculty">
            <i className="bi bi-person-workspace"></i>
            <span>Faculty</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/admin/annual-magazine">
            <i className="bi bi-calendar"></i>
            <span>Annual Magazine</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" to="/admin/contribution">
            <i className="bi bi-book"></i>
            <span>Contribution</span>
          </Link>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="pages-contact.html">
            <i className="bi bi-person"></i>
            <span>User</span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
