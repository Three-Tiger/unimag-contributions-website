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

    downloadFile(fileId) {
        const url = `/api/file-details/${fileId}/download`;
        return axiosClient.get(url);
    }

    readFile(fileId) {
        const url = `/api/file-details/${fileId}/read`;
        return axiosClient.get(url);
    }

    downloadMultipleFile(contributionId) {
        const url = `/api/file-details/${contributionId}/download-multiple`;
        return axiosClient.get(url);
    }

    downloadFileByListContributionId(listContribution) {
        const url = `/api/file-details/contribution/download-multiple`;
        return axiosClient.post(url, listContribution);
    }
}

const fileDetailApi = new FileDetailApi();
export default fileDetailApi;