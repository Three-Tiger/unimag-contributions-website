import { Button, Container } from "react-bootstrap";
import FullLayout from "../components/layouts/Full";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import handleError from "../services/HandleErrors";
import authService from "../services/AuthService";
import formatDateTime from "../services/FormatDateTime";
import facultyApi from "../api/facultyApi";
import * as yup from "yup";
import swalService from "../services/SwalService";
import storageService from "../services/StorageService";
import ProfileComponent from "../components/ProfileComponent";
import AdminLayout from "../components/layouts/Admin";

const ProfilePage = () => {
  const isStudent = () => {
    return authService.getUserRole() === "Student";
  };

  return (
    <>
      {!isStudent() ? (
        <AdminLayout>
          <ProfileComponent />
        </AdminLayout>
      ) : (
        <FullLayout>
          <ProfileComponent />
        </FullLayout>
      )}
    </>
  );
};

export default ProfilePage;
