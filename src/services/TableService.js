import * as API       from "../services/API";
import { authClient } from '@/services/AuthService';

export default {
    index(cafeId) {
        return API.apiClient.get(`/cafe/${ cafeId }/tables`);
    },
    show(cafeId, tableSerialNumber) {
        return API.apiClient.get(`/cafe/${ cafeId }/tables/${ tableSerialNumber }`);
    },
    async toggle(tableId) {
        await authClient.get("/sanctum/csrf-cookie");
        return API.apiClient.post(`/staff/tables/${tableId}/toggle`);
    },
};