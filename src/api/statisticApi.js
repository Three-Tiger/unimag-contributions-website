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

    numberOfContributions() {
        const url = '/api/statistics/number-of-contributions';
        return axiosClient.get(url);
    }

    percentageOfContributions() {
        const url = '/api/statistics/percentage-of-contributions';
        return axiosClient.get(url);
    }

    getRecentContribution() {
        const url = "/api/statistics/top-6";
        return axiosClient.get(url);
    }
}

const statisticApi = new StatisticApi();
export default statisticApi;
