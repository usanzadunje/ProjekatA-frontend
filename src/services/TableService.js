import * as API from "@/services/API";

export default {
    index(placeId) {
        return API.apiClient.get(`/places/${placeId}/tables`);
    },
};