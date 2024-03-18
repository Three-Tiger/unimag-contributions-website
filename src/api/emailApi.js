import axiosClient from "./axiosClient";

class EmailApi {
    sendMail(email) {
        const url = "/api/emails";
        return axiosClient.post(url, email);
    }

    sendMailAsync(email) {
        const url = "/api/emails/async";
        return axiosClient.post(url, email);
    };
}

const emailApi = new EmailApi();
export default emailApi;
