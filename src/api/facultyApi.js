import axiosClient from "./axiosClient";

class FacultyApi {
    getAll = (limit) => {
        const url = "/api/faculties";
        if (limit === undefined) return axiosClient.get(url);
        return axiosClient.get(url, { params: { limit } });
    }

    GetOne = (id) => {
        const url = `/api/faculties/${id}`;
        return axiosClient.get(url);
    }

    AddNew = (faculty) => {
        const url = "/api/faculties";
        return axiosClient.post(url, faculty);
    }

    Update = (faculty) => {
        const url = `/api/faculties/${faculty.facultyId}`;
        return axiosClient.put(url, faculty);
    }

    Remove = (id) => {
        const url = `/api/faculties/${id}`;
        return axiosClient.delete(url);
    }
}

const facultyApi = new FacultyApi();
export default facultyApi;
