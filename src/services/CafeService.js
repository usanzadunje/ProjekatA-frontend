import * as API from "@/services/API";

import store from "@/store";

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
        latitude = 0,
        longitude = 0,
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
                    latitude,
                    longitude,
                },
            },
        );
    },
    // Getting only one specific cafe
    show(id) {
        // Only getting
        return API.apiClient.get(
            `/cafes/${id}`,
        );
    },
    images(id) {
        return API.apiClient.get(`/cafes/${id}/images`);
    },
    workingHours(id) {
        return API.apiClient.get(`/cafes/${id}/working-hours`);
    },
    // Subscribing users to specific cafe
    subscribe(cafeId, notificationTime = null) {
        return API.apiClient.post(`/user/subscribe/cafe/${cafeId}/notify-in-next/${notificationTime || ''}`);
    },
    // Unsubscribing users to specific cafe
    unsubscribe(cafeId) {
        return API.apiClient.post(`/user/unsubscribe/cafe/${cafeId}`);
    },
    // Checking whether users is subscribed to specific cafe
    isUserSubscribed(cafeId) {
        return API.apiClient.post(`/user/subscribed/cafe/${cafeId}`);
    },
    // Listing all cafes users is subscribed to
    getAllCafesUserSubscribedTo(sortBy = 'default', latitude = 0, longitude = 0) {
        return API.apiClient.get(
            `/user/cafes/subscriptions`,
            {
                params: {
                    sortBy,
                    latitude,
                    longitude,
                },
            },
        );
    },
    getDistance(placeLatitude = 0, placeLongitude = 0) {
        const latitude = store.getters['global/position'].latitude;
        const longitude = store.getters['global/position'].longitude;

        const R = 6371e3; // metres
        const f1 = latitude * Math.PI / 180; // φ, λ in radians
        const f2 = placeLatitude * Math.PI / 180;
        const df = (placeLatitude - latitude) * Math.PI / 180;
        const dl = (placeLongitude - longitude) * Math.PI / 180;

        const a = Math.sin(df / 2) * Math.sin(df / 2) +
            Math.cos(f1) * Math.cos(f2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


        // in metres
        return R * c;
    },
};