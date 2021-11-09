import * as API from "@/services/API";

export default {
    // index() {
    //     return API.apiClient.get(``);
    // },
    store(payload) {
        return API.apiClient.post(`/owner/place/tables/sections`, payload);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/place/tables/sections/${id}`, payload);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/place/tables/sections/${id}`);
    },
};