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
        // Only fetching columns needed to show in place card component
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
    // Getting only one specific place
    show(id, categories = null, showScreen = null) {
        // Only getting
        return API.apiClient.get(
            `/places/${id}`,
            {
                params: {
                    categories,
                    showScreen,
                },
            },
        );
    },
    images(id) {
        return API.apiClient.get(`/places/${id}/images`);
    },
    workingHours(id) {
        return API.apiClient.get(`/places/${id}/working-hours`);
    },
    // Listing all places users is subscribed to
    userSubscriptions(sortBy = 'default', latitude = 0, longitude = 0) {
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
    userSubscriptionIds() {
        return API.apiClient.get(`/user/subscriptions/place/ids`);
    },
    subscribe(placeId, notificationTime = null) {
        return API.apiClient.post(`/user/subscriptions/place/${placeId}/notify-in-next/${notificationTime || ''}`);
    },
    unsubscribe(placeId) {
        return API.apiClient.delete(`/user/subscriptions/place/${placeId}`);
    },
    userFavoritePlaceIds() {
        return API.apiClient.get(`/user/favorites/place/ids`);
    },
    favorite(placeId) {
        return API.apiClient.post(`/user/favorites/place/${placeId}`);
    },
    unfavorite(placeId) {
        return API.apiClient.delete(`/user/favorites/place/${placeId}`);
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
