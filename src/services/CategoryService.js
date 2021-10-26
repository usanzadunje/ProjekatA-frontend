import * as API from "@/services/API";

export default {
    index() {
        return API.apiClient.get(`/owner/menu/category/place`);
    },
    show(id) {
        return API.apiClient.get(`/owner/menu/category/${id}`);
    },
    create(payload) {
        return API.apiClient.post(`/owner/menu/category`, payload);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/menu/category/${id}`, payload);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/menu/category/${id}`);
    },
};