import router                                 from "@/router";
import { i18n }                               from "@/i18n";
import { loadingController, toastController } from '@ionic/vue';

import AuthService        from "@/services/AuthService";
import { StorageService } from '@/services/StorageService';

export const namespaced = true;

export const state = {
    user: {},
    role: null,
    token: null,
};

export const mutations = {
    SET_USER(state, payload) {
        state.user = payload;
    },
    UPDATE_USER(state, payload) {
        Object.keys(payload).forEach(key => {
            state.user[key] = payload[key];
        });
    },

    SET_TOKEN(state, payload) {
        state.token = payload;
    },
    SET_ROLE(state, payload) {
        state.role = payload;
    },
};

export const actions = {
    async login({ getters, commit, dispatch }, payload) {
        const response = await AuthService.login(payload);

        await dispatch("setToken", response.data?.token);
        await dispatch("getAuthUser");
        dispatch("user/getSettings", null, { root: true });
        commit("SET_ROLE", response.data?.role);

        if(!getters.isStaff && !getters.isOwner) {
            dispatch('user/getSubscriptions', null, { root: true });
        }

        if(getters.isStaff) {
            commit('staff/SET_ACTIVITY', true, { root: true });
        }

        return response.data?.role;
    },
    async register({ commit, dispatch }, payload) {
        const response = await AuthService.register(payload);

        await dispatch("setToken", response.data?.token);
        await dispatch("getAuthUser");
        dispatch("user/getSettings", null, { root: true });
        commit("SET_ROLE", null);

        return response.data?.role;
    },
    async logout({ getters, commit, dispatch }) {
        let loading = null;
        try {
            loading = await loadingController
                .create({
                    spinner: 'crescent',
                    cssClass: 'custom-loading',
                    message: i18n.global.t('loggingOut'),
                    mode: 'ios',
                });
            await loading.present();

            await AuthService.logout();
        }catch(error) {
            const toast = await toastController.create({
                duration: 1500,
                position: 'top',
                message: i18n.global.t('forceLogout'),
                cssClass: 'error-toast',
                mode: 'ios',
            });
            await toast.present();
        }finally {
            const root = document.documentElement;

            await dispatch("setToken", null);

            /* PURGING ALL OWNER DATA*/
            if(getters.isOwner) {
                commit('owner/PURGE_DATA', null, { root: true });
            }

            commit("SET_USER", null);
            commit("SET_ROLE", null);
            commit('user/SET_DARKMODE', false, { root: true });
            commit('user/SET_LOCALIZATION', { text: "SRB", value: "sr" }, { root: true });
            commit('user/PURGE_SUBSCRIPTION_DATA', null, { root: true });

            i18n.global.locale.value = 'sr';
            document.body.classList.toggle('dark', false);
            root.style.setProperty('--user-selected-color', '#207DFF');
            root.style.setProperty('--primary-button', '#1b6de0');

            await router.replace({ name: 'login' });
            await loading?.dismiss();
        }
    },

    async getAuthUser({ commit }) {
        try {
            const response = await AuthService.getAuthUser();
            commit("SET_USER", response.data);
            return true;
        }catch(error) {
            commit("SET_USER", null);
            return false;
        }
    },
    async updateAuthUser({ commit }, payload) {
        await AuthService.updateUser(payload);

        commit("UPDATE_USER", payload);
    },

    // Getting authenticated users info and saving it to store
    async getToken({ getters, commit, dispatch }) {
        const { get } = StorageService();
        try {
            const token = await get('projekata_token');

            if(token && getters.token) {
                dispatch("setToken", token);
            }

            return token;
        }catch(error) {
            commit("SET_USER", null);
            return null;
        }
    },
    async setToken({ commit }, payload) {
        const { set } = StorageService();
        try {
            await set('projekata_token', payload);

            commit("SET_TOKEN", payload);
        }catch(error) {
            commit("SET_TOKEN", null);
        }
    },
};

export const getters = {
    authUser: (state) => {
        return state.user;
    },
    loggedIn: (state) => {
        return !!state.user;
    },
    token: (state) => {
        return state.token;
    },
    displayName: (state) => {
        let displayName;
        if(state.user?.fname && state.user?.lname) {
            displayName = state.user.fname + ' ' + state.user.lname;
        }else if(state.user?.fname) {
            displayName = state.user.fname;
        }else {
            displayName = state.user?.lname || state.user?.username;
        }
        return displayName || i18n.global.t('unknown');
    },
    isStaff: (state) => {
        return state.user?.id === 1 || state.role === 2 || state.user?.role === 2;
    },
    isOwner: (state) => {
        return state.user?.id === 1 || state.role === 1 || state.user?.role === 1;
    },
};