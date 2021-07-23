export const namespaced = true;

export const state = {
    location: false,
};

export const mutations = {
    SET_LOCATION_PERMISSIONS(state, permission) {
        state.location = permission;
    },
};

export const actions = {

};

export const getters = {
    location: (state) => {
        return state.location;
    },
};