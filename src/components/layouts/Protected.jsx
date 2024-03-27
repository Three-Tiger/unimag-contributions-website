import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import swalService from "../../services/SwalService";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  if (isAuthenticated()) {
    return children;
  }

  swalService.showMessageToHandle(
    "Warning",
    "Please login to continue.",
    "warning",
    () => navigate("/")
  );
};

export default Protected;
