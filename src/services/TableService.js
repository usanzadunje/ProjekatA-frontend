import * as API       from "../services/API";

export default {
    index(cafeId) {
        return API.apiClient.get(`/cafe/${ cafeId }/tables`);
    },
    show(cafeId, tableSerialNumber) {
        return API.apiClient.get(`/cafe/${ cafeId }/tables/${ tableSerialNumber }`);
    },
    toggle() {
        return API.apiClient.post(`/staff/table/toggle`);
    },
};