export const namespaced = true;

export const state = {
    isMenuVisible: false,
};

export const mutations = {
    SET_MENU_VISIBILITY(state, value) {
        state.isMenuVisible = value;
    },
};

export const getters = {
    isMenuVisible: (state) => {
        return state.isMenuVisible;
    },

};