import axios from "axios";

import store from "@/store";

// Creating axios instance for routes that are not api protected
export const authClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    withCredentials: true, // required to handle the CSRF token
});

/*
    Add a response interceptor to hanndle errors
*/
authClient.interceptors.response.use(
    (response) => {
        return response;
    },
    function(error) {
        if(
            error.response &&
            [401, 419].includes(error.response.status) &&
            store.getters["auth/authUser"]
        ) {
            store.dispatch("auth/logout");
        }
        return Promise.reject(error);
    },
);

export default {
    async login(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/login", payload);
    },
    logout() {
        return authClient.post("/logout");
    },
    /* Responsible for sending password reset email to user (e-mail is provided in form) */
    async forgotPassword(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/forgot-password", payload);
    },
    getAuthUser() {
        return authClient.get("/api/users/auth");
    },
    /* Responsible for actually resetting password to values given in form */
    async resetPassword(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/reset-password", payload);
    },
    updatePassword(payload) {
        return authClient.put("/user/password", payload);
    },
    async register(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/register", payload);
    },
    async resendVerificationEmail() {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/email/verification-notification");
    },
    async updateUser(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.put("/user/profile-information", payload);
    },
    async setFcmToken(payload) {
        await authClient.get("/sanctum/csrf-cookie");
        return authClient.post("/api/users/fcm-token", payload);
    },
    removeFcmToken() {
        return authClient.post("/api/users/fcm-token/remove");
    },
};