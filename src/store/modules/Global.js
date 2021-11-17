export const namespaced = true;

export const state = {
    position: null,
    placeInfoCacheExpirationDate: null,
};

export const mutations = {
    SET_POSITION(state, payload) {
        state.position = payload;
    },

    SET_PLACE_INFO_CACHE_EXPIRATION_DATE(state, payload) {
        state.placeInfoCacheExpirationDate = payload;
    },

    NOTIFICATION_DATA_RECEIVED(payload) {
        return payload;
    },
};

export const actions = {};

export const getters = {
    position: (state) => {
        return state.position || {
            latitude: 0,
            longitude: 0,
        };
    },

    placeInfoCacheExpirationDate: (state) => {
        return state.placeInfoCacheExpirationDate;
    },
};