import * as API from "@/services/API";

// Creating axios instance for routes that are not api protected
export const authClient = API.apiClient;

export default {
    login(payload) {
        return authClient.post("/login", payload);
    },
    authenticateSocial(payload) {
        return authClient.post("/callback", payload);
    },
    logout() {
        return authClient.post("/logout");
    },
    /* Responsible for sending password reset email to user (e-mail is provided in form) */
    forgotPassword(payload) {
        return authClient.post("/forgot-password", payload);
    },
    getAuthUser() {
        return authClient.get("/auth/user");
    },
    /* Responsible for actually resetting password to values given in form */
    resetPassword(payload) {
        return authClient.post("/reset-password", payload);
    },
    updatePassword(payload) {
        return authClient.put("/user/password", payload);
    },
    register(payload) {
        return authClient.post("/register", payload);
    },
    resendVerificationEmail() {
        return authClient.post("/email/verification-notification");
    },
    updateUser(payload) {
        return authClient.put("/user/profile-information", payload);
    },
    setFcmToken(payload) {
        return authClient.post("/fcm-token", payload);
    },
    removeFcmToken() {
        return authClient.delete("/fcm-token");
    },
};