import FullLayout from "../components/layouts/Full";
import authService from "../services/AuthService";
import ProfileComponent from "../components/ProfileComponent";
import AdminLayout from "../components/layouts/Admin";

const ProfilePage = () => {
  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  const isGuest = () => {
    return authService.getUserRole() === "Guest";
  };

  return (
    <>
      {isStudent() || isGuest() ? (
        <FullLayout>
          <ProfileComponent />
        </FullLayout>
      ) : (
        <AdminLayout>
          <ProfileComponent />
        </AdminLayout>
      )}
    </>
  );
};

export default ProfilePage;
