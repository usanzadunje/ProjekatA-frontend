import * as API       from "@/services/API";
import { authClient } from '@/services/AuthService';

export default {
    index() {
        return API.apiClient.get(`/cafes`);
    },
    show(id) {
        return API.apiClient.get(`/cafes/${id}`);
    },
    async subscribe(cafeId) {
        await authClient.get("/sanctum/csrf-cookie");
        return API.apiClient.post(`/users/subscribe/cafe/${cafeId}`);
    },
};