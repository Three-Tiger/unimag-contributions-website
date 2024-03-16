import axiosClient from "./axiosClient";

class FileDetailApi {
    save(formData) {
        const url = "/api/file-details/multiple-file";
        return axiosClient.post(url, formData);
    }

    removeFileByContributionId(contributionId) {
        const url = `/api/file-details/contribution/${contributionId}`;
        return axiosClient.delete(url);
    }
}

const fileDetailApi = new FileDetailApi();
export default fileDetailApi;