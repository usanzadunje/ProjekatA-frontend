export const namespaced = true;

export const state = {
    position: null,
    width: null,
    height: null,
    placeInfoCacheExpirationDate: null,
};

export const mutations = {
    SET_POSITION(state, payload) {
        state.position = payload;
    },

    SET_WIDTH(state, payload) {
        state.width = payload;
    },
    SET_HEIGHT(state, payload) {
        state.height = payload;
    },

    SET_PLACE_INFO_CACHE_EXPIRATION_DATE(state, payload) {
        state.placeInfoCacheExpirationDate = payload;
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
    width: (state) => {
        return state.width;
    },
    height: (state) => {
        return state.height;
    },

    placeInfoCacheExpirationDate: (state) => {
        return state.placeInfoCacheExpirationDate;
    },
};