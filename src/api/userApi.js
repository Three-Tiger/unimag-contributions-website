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
}

const userApi = new UserApi();
export default userApi;