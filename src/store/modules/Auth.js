import router                                 from "@/router";
import { i18n }                               from "@/i18n";
import { loadingController, toastController } from '@ionic/vue';

import AuthService        from "@/services/AuthService";
import { StorageService } from '@/services/StorageService';

export const namespaced = true;

export const state = {
    user: null,
    role: null,
    token: null,
};

export const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    SET_ROLE(state, role) {
        state.role = role;
    },
};

export const actions = {
    async login({ getters, commit, dispatch }, user) {
        const response = await AuthService.login(user);

        await dispatch("setToken", response.data?.token);
        await dispatch("getAuthUser");
        dispatch("user/getSettings", null, { root: true });
        commit("SET_ROLE", response.data?.role);

        if(getters.isStaff) {
            commit('staff/SET_ACTIVITY', true, { root: true });
        }

        return response.data?.role;
    },
    async register({ commit, dispatch }, user) {
        const response = await AuthService.register(user);

        await dispatch("setToken", response.data?.token);
        await dispatch("getAuthUser");
        dispatch("user/getSettings", null, { root: true });
        commit("SET_ROLE", null);

        return response.data?.role;
    },
    async updateAuthUser({ dispatch }, user) {
        await AuthService.updateUser(user);

        dispatch("getAuthUser");
    },
    async logout({ commit, dispatch }) {
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
            await dispatch("setToken", null);
            commit("SET_USER", null);
            commit("SET_ROLE", null);
            commit('user/SET_DARKMODE', null, { root: true });
            commit('user/SET_LOCALIZATION', null, { root: true });
            commit('user/SET_NOTIFICATIONS', null, { root: true });
            await router.replace({ name: 'login' });
            await loading?.dismiss();
            i18n.global.locale.value = 'sr';
            document.body.classList.toggle('dark', false);
        }
    },
    // Getting authenticated users info and saving it to store
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
    async getToken() {
        const { get } = StorageService();
        try {
            return await get('projekata_token');

        }catch(error) {
            return null;
        }
    },
    async setToken({ commit, dispatch }, value) {
        const { set } = StorageService();
        try {
            const token = value ?? await dispatch('getToken');
            await set('projekata_token', token);
            commit("SET_TOKEN", token);
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
        return state.user?.id === 1 || state.role === 2;
    },
    isOwner: (state) => {
        return state.user?.id === 1 || state.role === 1;
    },
};