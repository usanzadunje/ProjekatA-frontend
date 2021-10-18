import * as API from "@/services/API";

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
        return API.apiClient.put(`/owner/place`, payload);
    },
    uploadPlaceImages(payload) {
        return API.apiClient.post(`/owner/place/images`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    removePlaceImage(id) {
        return API.apiClient.delete(`/owner/place/images/${id}`);
    },
    setImageAsMain(id) {
        return API.apiClient.post(`/owner/place/images/main/${id}`);
    },
    setImageAsLogo(id) {
        return API.apiClient.post(`/owner/place/images/logo/${id}`);
    },
    allTables() {
        return API.apiClient.get(`/staff/place/tables`);
    },
    updateTables(tables) {
        return API.apiClient.post(`/owner/place/tables`, tables);
    },
};