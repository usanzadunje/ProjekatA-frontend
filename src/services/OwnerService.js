import * as API from "@/services/API";

export default {
    allStaff(offset = null, limit = null) {
        return API.apiClient.get(
            `/owner/staff`,
            {
                params: {
                    offset,
                    limit,
                },
            },
        );
    },
    activeStaff() {
        return API.apiClient.get(`/owner/staff/active`);
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
};