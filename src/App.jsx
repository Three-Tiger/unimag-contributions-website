import {
  Route,
  RouterProvider,
  createBrowserRouter,
  useRoutes,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import FacultyPage from "./pages/FacultyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnnualMagazinePage from "./pages/AnnualMagazine.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AllFacultyPage from "./pages/AllFaculty.jsx";
import SubmissionPage from "./pages/SubmissionPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import ContributionPage from "./pages/ContributionPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Protected from "./components/layouts/Protected.jsx";

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
      path: "/faculty",
      element: <AllFacultyPage />,
    },
    {
      path: "/submission",
      element: (
        <Protected>
          <SubmissionPage />
        </Protected>
      ),
    },
    {
      path: "/article",
      element: <ArticlePage />,
    },
    {
      path: "/admin",
      children: [
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        {
          path: "faculty",
          element: <FacultyPage />,
        },
        {
          path: "annual-magazine",
          element: <AnnualMagazinePage />,
        },
        {
          path: "contribution",
          element: <ContributionPage />,
        },
      ],
    },
  ]);

  return router;
}

export default App;
