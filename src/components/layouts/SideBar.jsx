import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <a class="nav-link " href="index.html">
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <li class="nav-item">
          <Link class="nav-link collapsed" to="users-profile.html">
            <i class="bi bi-person-workspace"></i>
            <span>Faculty</span>
          </Link>
        </li>

        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-faq.html">
            <i class="bi bi-calendar"></i>
            <span>Annual Magazine</span>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-register.html">
            <i class="bi bi-book"></i>
            <span>Contribution</span>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-contact.html">
            <i class="bi bi-person"></i>
            <span>User</span>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link collapsed" href="pages-register.html">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
