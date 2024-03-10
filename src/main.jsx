import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage.jsx";
import FacultyPage from "./pages/FacultyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnnualMagazinePage from "./pages/AnnualMagazine.jsx";
import ContributionPage2 from "./pages/ContributionPage2.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/faculty",
    element: <FacultyPage />,
  },
  {
    path: "/annual-magazine",
    element: <AnnualMagazinePage />,
  },
  {
    path: "/contribution",
    element: <ContributionPage2 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>
  <RouterProvider router={router} />
);
