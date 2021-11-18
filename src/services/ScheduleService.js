import * as API from "@/services/API";

export default {
    index() {
        return API.apiClient.get(`/staff/schedule`);
    },
    indexByPlace() {
        return API.apiClient.get(`/owner/schedule`);
    },
    store(payload) {
        return API.apiClient.post(`/owner/schedule`, payload);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/schedule/${id}`, payload);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/schedule/${id}`);
    },
};
