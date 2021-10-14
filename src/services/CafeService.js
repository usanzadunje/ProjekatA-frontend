import * as API from "@/services/API";

import store from "@/store";

export default {
    index(
        getAllColumns = false,
        sortBy = null,
        filter = null,
        offset = null,
        limit = null,
        latitude = null,
        longitude = null,
    ) {
        // Only fetching columns needed to show in cafe card component
        // Search and Home screen have it
        return API.apiClient.get(
            `/places`,
            {
                params: {
                    getAllColumns,
                    sortBy,
                    offset,
                    limit,
                    filter,
                    latitude,
                    longitude,
                },
            },
        );
    },
    // Getting only one specific cafe
    show(id, query = '') {
        // Only getting
        return API.apiClient.get(
            `/places/${id}${query}`,
        );
    },
    images(id) {
        return API.apiClient.get(`/places/${id}/images`);
    },
    workingHours(id) {
        return API.apiClient.get(`/places/${id}/working-hours`);
    },
    // Listing all cafes users is subscribed to
    getAllCafesUserSubscribedTo(sortBy = 'default', latitude = 0, longitude = 0) {
        return API.apiClient.get(
            `/user/subscriptions/place`,
            {
                params: {
                    sortBy,
                    latitude,
                    longitude,
                },
            },
        );
    },
    // Subscribing users to specific place
    // Checking whether users is subscribed to specific cafe
    isUserSubscribed(cafeId) {
        return API.apiClient.post(`/user/subscriptions/place/${cafeId}`);
    },
    subscribe(cafeId, notificationTime = null) {
        return API.apiClient.post(`/user/subscriptions/place/${cafeId}/notify-in-next/${notificationTime || ''}`);
    },
    // Unsubscribing users to specific cafe
    unsubscribe(cafeId) {
        return API.apiClient.delete(`/user/subscriptions/place/${cafeId}`);
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