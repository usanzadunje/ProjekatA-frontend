import * as API from "../services/API";

export default {
    index() {
        return API.apiClient.get(`/cafes`);
    },
};