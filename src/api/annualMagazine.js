import axiosClient from "./axiosClient";

class AnnualMagazine {
    getAll = () => {
        const url = "/api/annual-magazines";
        return axiosClient.get(url);
    }

    GetOne = (id) => {
        const url = `/api/annual-magazines/${id}`;
        return axiosClient.get(url);
    }

    AddNew = (annualMagazine) => {
        const url = "/api/annual-magazines";
        return axiosClient.post(url, annualMagazine);
    }

    Update = (annualMagazine) => {
        const url = `/api/annual-magazines/${annualMagazine.annualMagazineId}`;
        return axiosClient.put(url, annualMagazine);
    }

    Remove = (id) => {
        const url = `/api/annual-magazines/${id}`;
        return axiosClient.delete(url);
    }
}

const annualMagazineApi = new AnnualMagazine();
export default annualMagazineApi;
