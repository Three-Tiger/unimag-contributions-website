import axiosClient from "./axiosClient";

class RoleApi {
    getAll() {
        const url = "/api/roles";
        return axiosClient.get(url);
    }
}

const roleApi = new RoleApi();
export default roleApi;
