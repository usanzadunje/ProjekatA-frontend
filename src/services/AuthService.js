import * as API from "@/services/API";

// Creating axios instance for routes that are not api protected
export const authClient = API.apiClient;

export default {
    async login(payload) {
        return authClient.post("/login", payload);
    },
    async authenticateSocial(payload) {
        return authClient.post("/callback", payload);
    },
    logout() {
        return authClient.post("/logout");
    },
    /* Responsible for sending password reset email to user (e-mail is provided in form) */
    async forgotPassword(payload) {
        return authClient.post("/forgot-password", payload);
    },
    getAuthUser() {
        return authClient.get("/auth/user");
    },
    /* Responsible for actually resetting password to values given in form */
    async resetPassword(payload) {
        return authClient.post("/reset-password", payload);
    },
    updatePassword(payload) {
        return authClient.put("/user/password", payload);
    },
    async register(payload) {
        return authClient.post("/register", payload);
    },
    async resendVerificationEmail() {
        return authClient.post("/email/verification-notification");
    },
    async updateUser(payload) {
        return authClient.put("/user/profile-information", payload);
    },
    async setFcmToken(payload) {
        return authClient.post("/fcm-token", payload);
    },
    removeFcmToken() {
        return authClient.post("/fcm-token/remove");
    },
};