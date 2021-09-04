import router                from "@/router";
import { i18n }              from "@/i18n";
import { loadingController } from '@ionic/vue';

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
    async logout({ commit }) {
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
            alert(i18n.global.t('forceLogout'));
        }finally {
            commit("SET_USER", null);
            commit("SET_ROLE", null);
            commit("SET_TOKEN", null);
            commit('user/SET_DARKMODE', null, { root: true });
            commit('user/SET_LOCALIZATION', null, { root: true });
            commit('user/SET_NOTIFICATIONS', null, { root: true });
            await router.replace({ name: 'login' });
            await loading?.dismiss();
            i18n.global.locale.value = 'sr';
            document.body.classList.toggle('dark', false);
        }
    },
    // Getting authenticated user info and saving it to store
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
    async getToken({ commit }) {
        const { get } = StorageService();
        try {
            const token = await get('projekata_token');
            commit("SET_TOKEN", token);
            return token;
        }catch(error) {
            commit("SET_TOKEN", null);
            return null;
        }
    },
    async setToken({ commit }, token) {
        const { set } = StorageService();
        try {
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