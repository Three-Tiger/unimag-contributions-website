import axiosClient from "./axiosClient";

class StatisticApi {
    acceptanceRejectionRate() {
        const url = '/api/statistics/acceptance-rejection-rate';
        return axiosClient.get(url);
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
        const url = "/api/contributions/top-6";
        return axiosClient.get(url);
    }
}

const statisticApi = new StatisticApi();
export default statisticApi;
