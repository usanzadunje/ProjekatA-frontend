import * as API from "@/services/API";

export default {
    // Listing all cafes
    index() {
        return API.apiClient.get(`/cafes`);
    },
    // Getting cafes in chunks
    getCafeCardsChunkInfo(
        start = 0,
        numberOfCafes = 20,
        filter = '',
        sortBy = 'name',
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
    // Getting only one specific cafe
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
    // Subscribing user to specific cafe
    subscribe(cafeId, notificationTime = null) {
        if(notificationTime) {
            return API.apiClient.post(`/users/subscribe/cafe/${cafeId}/notify-in-next/${notificationTime}`);
        }else {
            return API.apiClient.post(`/users/subscribe/cafe/${cafeId}/notify-in-next/`);
        }
    },
    // Unsubscribing user to specific cafe
    unsubscribe(cafeId) {
        return API.apiClient.post(`/users/unsubscribe/cafe/${cafeId}`);
    },
    // Checking whether user is subscribed to specific cafe
    isUserSubscribed(cafeId) {
        return API.apiClient.post(`/users/subscribed/cafe/${cafeId}`);
    },
    // Listing all cafes user is subscribed to
    getAllCafesUserSubscribedTo(sortBy = 'name') {
        return API.apiClient.get(
            `/users/cafes/subscriptions`,
            {
                params: {
                    sortBy,
                    getAllColumns: true,
                },
            },
        );
    },
};