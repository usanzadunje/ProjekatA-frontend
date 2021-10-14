import * as API from "@/services/API";

export default {
    index(cafeId) {
        return API.apiClient.get(`/places/${cafeId}/tables`);
    },
};