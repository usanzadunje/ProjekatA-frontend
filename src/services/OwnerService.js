import * as API from "../services/API";

export default {
    allStaff() {
        return API.apiClient.get(`/owner/staff`);
    },
};