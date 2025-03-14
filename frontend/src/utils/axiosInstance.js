import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `beaer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
); 

//Response interceptors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //handle common error globally
        if (error.response) {
            if (error.response.status === 401) {
                //Redirect to Login Page
                window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.log("Server Error !!! Please try again later");
            }
        } else if (error.code === "ENCONNABORTED") {
            console.error("Request Timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;