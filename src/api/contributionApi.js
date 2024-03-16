import axiosClient from "./axiosClient";

class ContributionApi {
    getContributionsByAnnualMagazineId(annualMagazineId) {
        const url = `/api/contributions/annual-magazine/${annualMagazineId}`;
        return axiosClient.get(url);
    }

    getContributionsByAnnualMagazineIdAndUserId(annualMagazineId, userId) {
        const url = `/api/contributions/annual-magazine/${annualMagazineId}/user/${userId}`;
        return axiosClient.get(url);
    }

    save(contributionData) {
        const url = "/api/contributions";
        return axiosClient.post(url, contributionData);
    }

    update(contributionData) {
        const url = `/api/contributions/${contributionData.contributionId}`;
        return axiosClient.put(url, contributionData);
    }

    remove(contributionId) {
        const url = `/api/contributions/${contributionId}`;
        return axiosClient.delete(url);
    }
}

const contributionApi = new ContributionApi();
export default contributionApi;