import { useRoutes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import FacultyPage from "./pages/FacultyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnnualMagazinePage from "./pages/AnnualMagazine.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AllFacultyPage from "./pages/AllFaculty.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import SubmissionPage from "./pages/SubmissionPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import ContributionPage from "./pages/ContributionPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Protected from "./components/layouts/Protected.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UserPage from "./pages/UserPage.jsx";
import AdminProtected from "./components/layouts/AdminProtected.jsx";
import StudentProtected from "./components/layouts/StudentProtected.jsx";

function App() {
  const router = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/profile",
      element: (
        <Protected>
          <ProfilePage />
        </Protected>
      ),
    },
    {
      path: "/faculty",
      element: (
        <Protected>
          <AllFacultyPage />
        </Protected>
      ),
    },
    {
      path: "/submission",
      element: (
        <StudentProtected>
          <SubmissionPage />
        </StudentProtected>
      ),
    },
    {
      path: "/article",
      element: (
        <Protected>
          <ArticlePage />
        </Protected>
      ),
    },
    {
      path: "/my-contribution",
      element: (
        <StudentProtected>
          <ContributionPage />
        </StudentProtected>
      ),
    },
    {
      path: "/admin",
      children: [
        {
          path: "dashboard",
          element: (
            <AdminProtected>
              <DashboardPage />
            </AdminProtected>
          ),
        },
        {
          path: "faculty",
          element: (
            <AdminProtected>
              <FacultyPage />
            </AdminProtected>
          ),
        },
        {
          path: "annual-magazine",
          element: (
            <AdminProtected>
              <AnnualMagazinePage />
            </AdminProtected>
          ),
        },
        {
          path: "contribution",
          element: (
            <AdminProtected>
              <ContributionPage />
            </AdminProtected>
          ),
        },
        {
          path: "user",
          element: (
            <AdminProtected>
              <UserPage />
            </AdminProtected>
          ),
        },
      ],
    },
  ]);

  return router;
}

export default App;
