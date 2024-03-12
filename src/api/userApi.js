import axiosClient from "./axiosClient";

class UserApi {
    register(user) {
        const url = "/api/auth/register";
        return axiosClient.post(url, user);
    }

    login(credentials) {
        const url = "/api/auth/login";
        return axiosClient.post(url, credentials);
    }

    getById(userId) {
        const url = `/api/users/${userId}`;
        return axiosClient.get(url);
    }

    updateProfile(userId, data) {
        const url = `/api/users/${userId}`;
        return axiosClient.put(url, data);
    }
}

const userApi = new UserApi();
export default userApi;