import * as API from "@/services/API";

export default {
    index() {
        return API.apiClient.get(`/owner/place/menu/category/place`);
    },
    show(id) {
        return API.apiClient.get(`/owner/place/menu/category/${id}`);
    },
    create(payload) {
        return API.apiClient.post(`/owner/place/menu/category`, payload);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/place/menu/category/${id}`, payload);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/place/menu/category/${id}`);
    },
};