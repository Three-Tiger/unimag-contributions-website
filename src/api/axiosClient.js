import axios from "axios";
import { noAuthList } from "./noAuthList";
import authService from "../services/AuthService";
import storageService from "../services/StorageService";
import swalService from "../services/SwalService";

const axiosClient = axios.create();

function logout() {
    authService.logout();
}

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
    function (config) {
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else if (config.url.includes('download') || config.url.includes('download-multiple')) {
            config.responseType = 'blob';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        const token = authService.getAccessToken();
        if (!noAuthList.includes(config.url) && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        /// Logout if the token has expired
        if (error.response && error.response.status === 401) {
            if (authService.isLogin()) {
                storageService.clear();
                swalService.showMessageToHandle(
                    'Session Expired',
                    'Your session has expired. Please login again.',
                    'error',
                    logout.bind(this)
                );
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;