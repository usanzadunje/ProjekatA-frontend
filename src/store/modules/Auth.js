import router from "@/router";

import AuthService from "@/services/AuthService";

export const namespaced = true;

export const state = {
    user: null,
    loading: false,
};

export const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
};

export const actions = {
    //Logging out user and redirecting to login page
    logout({ commit }) {
        return AuthService.logout()
                          .then(() => {
                              commit("SET_USER", null);
                              if(router.currentRoute.name !== "login")
                                  router.push({ name: 'login' });
                          });
    },
    // Getting authenticated user info and saving it to store
    async getAuthUser({ commit }) {
        commit("SET_LOADING", true);
        try {
            const response = await AuthService.getAuthUser();
            commit("SET_USER", response.data);
            commit("SET_LOADING", false);
            return response.data;
        }catch(error) {
            commit("SET_LOADING", false);
            commit("SET_USER", null);
        }
    },
};

export const getters = {
    // Auth user info
    authUser: (state) => {
        return state.user;
    },
    // Property true when something is loading
    loading: (state) => {
        return state.loading;
    },
    // Auth user state logged in or not
    loggedIn: (state) => {
        return !!state.user;
    },
    // Auth user is email verified
    emailVerified: (state) => {
        return !!state.user.email_verified;
    },
    // Checking if auth user is staff member
    isStaff: (state) => {
        return !!state.user.cafe_id;
    },
};