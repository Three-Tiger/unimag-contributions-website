import axiosClient from "./axiosClient";

class FeedbackApi {
    save(feedbackData) {
        const url = "/api/feedbacks";
        return axiosClient.post(url, feedbackData);
    }

    update(feedbackData) {
        const url = `/api/feedbacks/${feedbackData.feedBackId}`;
        return axiosClient.put(url, feedbackData);
    }
}

const feedbackApi = new FeedbackApi();
export default feedbackApi;