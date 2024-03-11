import axios from "axios";

const axiosClient = axios.create();

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

        const token = localStorage.getItem('token');
        if (token) {
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
        // Any status code that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default axiosClient;