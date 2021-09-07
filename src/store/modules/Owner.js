export const namespaced = true;

export const state = {
    staff: [],
};

export const mutations = {
    SET_STAFF_MEMBERS(state, value) {
        state.staff = value;
    },
};

export const getters = {
    staff: (state) => {
        return state.staff;
    },
};