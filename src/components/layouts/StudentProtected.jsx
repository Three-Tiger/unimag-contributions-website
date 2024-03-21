import { Navigate } from "react-router-dom";
import authService from "../../services/AuthService";
import swalService from "../../services/SwalService";

const StudentProtected = ({ children }) => {
  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  if (isAuthenticated() && isStudent()) {
    return children;
  }

  return <Navigate to="/" />;
};

export default StudentProtected;
