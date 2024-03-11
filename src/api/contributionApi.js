import axiosClient from "./axiosClient";

class ContributionApi {
    getContributionsByAnnualMagazineId(annualMagazineId) {
        const url = `/api/contributions/annual-magazine/${annualMagazineId}`;
        return axiosClient.get(url);
    }
}

const contributionApi = new ContributionApi();
export default contributionApi;