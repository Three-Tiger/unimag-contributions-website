import { Link } from "react-router-dom";
import authService from "../../services/AuthService";

const SideBar = () => {
  const isAdministrator = () => {
    return authService.getUserData().role.name === "Administrator";
  };

  const isCoordinator = () => {
    return authService.getUserData().role.name === "Coordinator";
  };

  const isManager = () => {
    return authService.getUserData().role.name === "Manager";
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

        {isAdministrator() && (
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/admin/faculty">
              <i className="bi bi-person-workspace"></i>
              <span>Faculty</span>
            </Link>
          </li>
        )}

        {isAdministrator() && (
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/admin/annual-magazine">
              <i className="bi bi-calendar"></i>
              <span>Annual Magazine</span>
            </Link>
          </li>
        )}

        {(isCoordinator() || isManager()) && (
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/admin/contribution">
              <i className="bi bi-book"></i>
              <span>
                {isCoordinator() ? "Student Submission" : "Contribution List"}
              </span>
            </Link>
          </li>
        )}

        {isAdministrator() && (
          <li className="nav-item">
            <Link className="nav-link collapsed" to="/admin/user">
              <i className="bi bi-person"></i>
              <span>User</span>
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
