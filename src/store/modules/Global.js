export const namespaced = true;

export const state = {
    position: null,
    width: null,
};

export const mutations = {
    SET_POSITION(state, value) {
        state.position = value;
    },

    SET_WIDTH(state, value) {
        state.width = value;
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
};