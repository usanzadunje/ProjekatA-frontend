/* Initializing axios and base url for API */

import axios from "axios";
import store from "@/store";

export const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL + "/api",
    withCredentials: true, // required to handle the CSRF token
});

/*
 * Add a response interceptor
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        if (
            error.response &&
            [401, 419].includes(error.response.status) &&
            store.getters["auth/authUser"]
        ) {
            store.dispatch("auth/logout");
        }
        return Promise.reject(error);
    }
);