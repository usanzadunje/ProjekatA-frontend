import router                      from "@/router";
import { Capacitor }               from "@capacitor/core";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";
import { i18n }                    from "@/i18n";

import AuthService    from "@/services/AuthService";
import { useStorage } from '@/services/StorageService';

export const namespaced = true;

export const state = {
    user: null,
};

export const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },

};

export const actions = {
    //Logging out user and redirecting to login page
    async logout({ commit }) {
        const { set } = useStorage();
        try {
            await AuthService.logout();
        }catch(error) {
            alert(i18n.global.t('forceLogout'));
        }finally {
            commit("SET_USER", null);
            await set('projekata_token', null);
            i18n.global.locale.value = 'sr';
            await router.replace({ name: 'login' });
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
    async setSettings({ state }) {
        const { get } = useStorage();
        try {
            const storedLocale = await get(`localization.${state.user.id}`);
            const storedDarkMode = await get(`isDarkModeOn.${state.user.id}`);

            document.body.classList.toggle('dark', !!storedDarkMode);
            i18n.global.locale.value = storedLocale.value ?? 'sr';

            if(Capacitor.isNativePlatform()) {
                if(storedDarkMode === true) {
                    await Keyboard.setStyle({
                        style: KeyboardStyle.Dark,
                    });
                }else {
                    await Keyboard.setStyle({
                        style: KeyboardStyle.Light,
                    });
                }
            }

        }catch(error) {
            document.body.classList.toggle('dark', false);
            i18n.global.locale.value = 'sr';
        }
    },
};

export const getters = {
    // Auth user info
    authUser: (state) => {
        return state.user ?? {};
    },
    displayName: (state) => {
        let displayName;
        if(state.user?.fname && state.user?.lname) {
            displayName = state.user.fname + ' ' + state.user.lname;
        }else if(state.user?.fname) {
            displayName = state.user.fname;
        }else {
            displayName = state.user?.lname ?? state.user?.username;
        }
        return displayName || i18n.global.t('unknown');
    },
    // Property true when something is loading
    // loading: (state) => {
    //     return state.loading;
    // },
    // Auth user state logged in or not
    loggedIn: (state) => {
        return !!state.user;
    },
    // Auth user is email verified
    // emailVerified: (state) => {
    //     return !!state.user.email_verified;
    // },
    // Checking if auth user is staff member
    isStaff: (state) => {
        return !!state.user?.cafe_id;
    },
};