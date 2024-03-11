import axiosClient from "./axiosClient";

class FileDetail {
    downloadFile(fileId) {
        const url = `/api/file-details/${fileId}/download`;
        return axiosClient.get(url);
    }

    downloadMultipleFile(contributionId) {
        const url = `/api/file-details/${contributionId}/download-multiple`;
        return axiosClient.get(url);
    }
}

const fileDetailApi = new FileDetail();
export default fileDetailApi;