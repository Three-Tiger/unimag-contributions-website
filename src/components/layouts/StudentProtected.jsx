import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import swalService from "../../services/SwalService";

const StudentProtected = ({ children }) => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return authService.isLogin();
  };

  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  if (isAuthenticated() && isStudent()) {
    return children;
  }

  swalService.showMessageToHandle(
    "Warning",
    "Please login as a student to access this page.",
    "warning",
    () => navigate("/")
  );
};

export default StudentProtected;
