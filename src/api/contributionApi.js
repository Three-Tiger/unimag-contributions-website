import axiosClient from "./axiosClient";

class ContributionApi {
    getContributionsByAnnualMagazineIdAndFacultyId(annualMagazineId, facultyId) {
        const url = `/api/contributions/annual-magazine/${annualMagazineId}/faculty/${facultyId}`;
        return axiosClient.get(url);
    }

    getContributionsByFilter(filter) {
        const url = `/api/contributions/filter`;
        return axiosClient.get(url, { params: filter });
    }

    getById(contributionId) {
        const url = `/api/contributions/${contributionId}`;
        return axiosClient.get(url);
    }

    getContributionsByAnnualMagazineIdAndUserId(annualMagazineId, userId) {
        const url = `/api/contributions/annual-magazine/${annualMagazineId}/user/${userId}`;
        return axiosClient.get(url);
    }

    getContributionsByUserId(userId) {
        const url = `/api/contributions/user/${userId}`;
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

    getPublished(limit) {
        const url = "/api/contributions/published";
        if (limit === undefined) return axiosClient.get(url);
        return axiosClient.get(url, { params: { limit } });
    }
}

const contributionApi = new ContributionApi();
export default contributionApi;