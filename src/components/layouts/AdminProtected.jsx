import { Navigate, useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import swalService from "../../services/SwalService";

const AdminProtected = ({ children }) => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  const isGuest = () => {
    return authService.getUserRole() === "Guest";
  };

  if (isAuthenticated()) {
    if (isStudent() || isGuest()) {
      // swalService.showMessageToHandle(
      //   "Warning",
      //   "You are not authorized to access this page",
      //   "warning",
      //   () => navigate("/")
      // );
      return <Navigate to="/" />;
    }
    return children;
  }

  return <Navigate to="/login" />;
};

export default AdminProtected;
