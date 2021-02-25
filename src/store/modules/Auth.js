import router      from "@/router";
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
    logout({ commit }) {
        return AuthService.logout()
                          .then(() => {
                              commit("SET_USER", null);
                              if(router.currentRoute.name !== "login")
                                  router.push({ path: "/login" });
                          });
    },
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
    authUser: (state) => {
        return state.user;
    },
    loading: (state) => {
        return state.loading;
    },
    loggedIn: (state) => {
        return !!state.user;
    },
    emailVerified: (state) => {
        return !!state.user.email_verified;
    },
};