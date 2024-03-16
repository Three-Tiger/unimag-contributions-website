import axiosClient from "./axiosClient";

class ImageDetailApi {
    save(formData) {
        const url = "/api/image-details/multiple-image";
        return axiosClient.post(url, formData);
    }

    removeImageByContributionId(contributionId) {
        const url = `/api/image-details/contribution/${contributionId}`;
        return axiosClient.delete(url);
    }
}

const imageDetailApi = new ImageDetailApi();
export default imageDetailApi;