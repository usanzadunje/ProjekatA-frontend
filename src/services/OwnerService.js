import * as API from "../services/API";

export default {
    allStaff() {
        return API.apiClient.get(`/owner/staff`);
    },
    updatePlace(payload) {
        return API.apiClient.put(`/owner/place-information`, payload);
    },
};