import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import swalService from "../../services/SwalService";

const AdminProtected = ({ children }) => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const isAdmin = () => {
    return authService.getUserRole() === "Administrator";
  };

  const isCoordinator = () => {
    return authService.getUserRole() === "Coordinator";
  };

  const isManager = () => {
    return authService.getUserRole() === "Manager";
  };

  if (isAuthenticated() && (isAdmin() || isCoordinator() || isManager())) {
    return children;
  }

  swalService.showMessageToHandle(
    "Warning",
    "You are not authorized to access this page",
    "warning",
    () => navigate("/")
  );
};

export default AdminProtected;
