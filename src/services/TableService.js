import * as API from "@/services/API";

export default {
    index(placeId) {
        return API.apiClient.get(`/places/${placeId}/tables`);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/place/tables/${id}`, payload);
    },
    updateMany(tables) {
        return API.apiClient.post(`/owner/place/tables`, tables);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/place/tables/${id}`);
    },
};