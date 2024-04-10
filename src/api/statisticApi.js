import axiosClient from "./axiosClient";

class StatisticApi {
    acceptanceRejectionRate(params) {
        const url = '/api/statistics/acceptance-rejection-rate';
        return axiosClient.get(url, { params });
    }

    numberOfAccountsCreated() {
        const url = '/api/statistics/number-of-accounts-created';
        return axiosClient.get(url);
    }

    numberOfContributionByFacultyId(facultyId) {
        const url = `/api/statistics/"number-of-contributions-faculty/${facultyId}`;
        return axiosClient.get(url);
    }

    numberOfContributions(params) {
        const url = '/api/statistics/number-of-contributions';
        return axiosClient.get(url, { params });
    }

    percentageOfContributions() {
        const url = '/api/statistics/percentage-of-contributions';
        return axiosClient.get(url);
    }

    getRecentContribution() {
        const url = "/api/statistics/top-6";
        return axiosClient.get(url);
    }

    getContributionWithoutComment(params) {
        const url = "/api/statistics/contribution-without-feedback";
        return axiosClient.get(url, { params });
    }

    getPercentageContributionFeedbackAfter14Days(params) {
        const url = "/api/statistics/percentage-contribution-feedback-after-14days";
        return axiosClient.get(url, { params });
    }
}

const statisticApi = new StatisticApi();
export default statisticApi;
