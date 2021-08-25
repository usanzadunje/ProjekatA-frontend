import * as API from "../services/API";

export default {
    tableAvailability() {
        return API.apiClient.get(`/staff/table/availability`);
    },
    toggleAvailability(available) {
        return API.apiClient.post(`/staff/table/toggle/${available}`);
    },
    // toggleAvailability(tableId) {
    //     return API.apiClient.post(`/staff/table/${tableId}/toggle`);
    // },
};