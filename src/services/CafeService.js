import * as API       from "@/services/API";
import { authClient } from '@/services/AuthService';

export default {
    index() {
        return API.apiClient.get(`/cafes`);
    },
    getCafeCardsChunkInfo(start = 0, numberOfCafes = 20) {
        // Only fetching columns needed to show in cafe card component
        // Search and Home screen have it
        return API.apiClient.get(`/cafes/chunked/start/number-of-cafes/${start}/${numberOfCafes}`);
    },
    show(id) {
        // Only getting
        return API.apiClient.get(`/cafes/${id}?columns=cafeShowInfo`);
    },
    async subscribe(cafeId) {
        await authClient.get("/sanctum/csrf-cookie");
        return API.apiClient.post(`/users/subscribe/cafe/${cafeId}`);
    },
};