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

    getAll() {
        const url = "/api/users";
        return axiosClient.get(url);
    }

    updateProfile(userId, data) {
        const url = `/api/users/${userId}/profile`;
        return axiosClient.put(url, data);
    }

    changePassword(userId, data) {
        const url = `/api/users/${userId}/change-password`;
        return axiosClient.put(url, data);
    }

    create(user) {
        const url = "/api/users";
        return axiosClient.post(url, user);
    }

    update(user) {
        const url = `/api/users/${user.get('userId')}`;
        return axiosClient.put(url, user);
    }

    delete(userId) {
        const url = `/api/users/${userId}`;
        return axiosClient.delete(url);
    }
}

const userApi = new UserApi();
export default userApi;