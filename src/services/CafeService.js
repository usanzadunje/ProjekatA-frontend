import * as API       from "@/services/API";
import { authClient } from '@/services/AuthService';

export default {
    index() {
        return API.apiClient.get(`/cafes`);
    },
    getCafeCardsChunkInfo(
        start = 0,
        numberOfCafes = 20,
        filter = '',
        sortBy = '',
        getAllColumns = false,
    ) {
        // Only fetching columns needed to show in cafe card component
        // Search and Home screen have it
        return API.apiClient.get(
            `/cafes/chunked/start/number-of-cafes/${start}/${numberOfCafes}`,
            {
                params: {
                    filter,
                    sortBy,
                    getAllColumns,
                },
            },
        );
    },
    show(id) {
        // Only getting
        return API.apiClient.get(
            `/cafes/${id}`,
            {
                params: {
                    getAllColumns: true,
                },
            },
        );
    },
    async subscribe(cafeId, notificationTime = null) {
        await authClient.get("/sanctum/csrf-cookie");
        if(notificationTime) {
            return API.apiClient.post(`/users/subscribe/cafe/${cafeId}/notify-in-next/${notificationTime}`);
        }else {
            return API.apiClient.post(`/users/subscribe/cafe/${cafeId}/notify-in-next/`);
        }
    },
    isUserSubscribed(cafeId) {
        return API.apiClient.post(`/users/subscribed/cafe/${cafeId}`);
    },
    getAllCafesUserSubscribedTo(sortBy = '') {
        return API.apiClient.get(
            `/users/cafes/subscriptions`,
            {
                params: {
                    sortBy,
                },
            },
        );
    },
};