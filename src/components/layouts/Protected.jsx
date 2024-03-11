import { Navigate } from "react-router-dom";
import authService from "../../services/AuthService";

const Protected = ({ children }) => {
  const isAuthenticated = () => {
    return authService.isLogin();
  };

  if (isAuthenticated()) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default Protected;
