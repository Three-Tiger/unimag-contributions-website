import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage.jsx";
import FacultyPage from "./pages/FacultyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnnualMagazinePage from "./pages/AnnualMagazine.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AllFacultyPage from "./pages/AllFaculty.jsx";
import SubmitionPage from "./pages/SubmitionPage.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import ContributionPage from "./pages/ContributionPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const router = createBrowserRouter([
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
    path: "/submition",
    element: <SubmitionPage />,
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

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>
  <RouterProvider router={router} />
);
