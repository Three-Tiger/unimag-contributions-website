import { Link } from "react-router-dom";
import authService from "../../services/AuthService";
import { useEffect, useState } from "react";

const SideBar = () => {
  const [pages, setPages] = useState([
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "bi bi-grid",
      isActive: false,
      roles: ["Coordinator", "Manager", "Administrator"],
    },
    {
      name: "Faculty",
      path: "/admin/faculty",
      icon: "bi bi-person-workspace",
      isActive: false,
      role: "Administrator",
    },
    {
      name: "Annual Magazine",
      path: "/admin/annual-magazine",
      icon: "bi bi-calendar",
      isActive: false,
      role: "Administrator",
    },
    {
      name: "Student Submission",
      path: "/admin/contribution",
      icon: "bi bi-book",
      isActive: false,
      roles: ["Coordinator", "Manager"],
    },
    {
      name: "User",
      path: "/admin/user",
      icon: "bi bi-person",
      isActive: false,
      role: "Administrator",
    },
  ]);

  useEffect(() => {
    const path = window.location.pathname;
    const newPages = pages.map((page) => {
      if (path.includes(page.path)) {
        page.isActive = true;
      } else {
        page.isActive = false;
      }
      return page;
    });
    setPages(newPages);
  }, []);

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {pages.map(
          (page) =>
            // Check if the user has the required role to view the page
            ((page.role &&
              authService.getUserData().role.name === "Administrator") ||
              (page.roles &&
                page.roles.includes(authService.getUserData().role.name))) && (
              <li className="nav-item" key={page.name}>
                <Link
                  className={`nav-link ${!page.isActive ? "collapsed" : ""}`}
                  to={page.path}
                >
                  <i className={page.icon}></i>
                  <span>{page.name}</span>
                </Link>
              </li>
            )
        )}
      </ul>
    </aside>
  );
};

export default SideBar;
