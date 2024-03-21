import { Navigate } from "react-router-dom";
import authService from "../../services/AuthService";

const Protected = ({ children }) => {
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
    if (!isStudent() && !isGuest()) {
      return <Navigate to="/admin/dashboard" />;
    }
    return children;
  }

  return <Navigate to="/login" />;
};

export default Protected;
