import * as API from "../services/API";

export default {
    allStaff() {
        return API.apiClient.get(`/owner/staff`);
    },
    createStaff(payload) {
        return API.apiClient.post(`/owner/staff`, payload);
    },
    updateStaff(staffId, payload) {
        return API.apiClient.put(`/owner/staff/${staffId}`, payload);
    },
    deleteStaff(staffId) {
        return API.apiClient.delete(`/owner/staff/${staffId}`);
    },
    updatePlace(payload) {
        return API.apiClient.put(`/owner/place-information`, payload);
    },
    uploadPlaceImages(payload) {
        return API.apiClient.post(`/owner/place/images/upload`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    removePlaceImage(id) {
        return API.apiClient.post(`/owner/place/images/remove/${id}`);
    },
};