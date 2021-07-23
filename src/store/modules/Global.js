export const namespaced = true;

export const state = {
    position: null,
};

export const mutations = {
    SET_POSITION(state, position) {
        state.position = position;
    },
};

export const actions = {};

export const getters = {
    position: (state) => {
        return state.position ?? {
            latitude: 0,
            longitude: 0,
        };
    },
};