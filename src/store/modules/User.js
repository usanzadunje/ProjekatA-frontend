import { Capacitor }               from "@capacitor/core";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";
import { i18n }                    from "@/i18n";

import { StorageService } from '@/services/StorageService';

export const namespaced = true;

export const state = {
    settings: {},
};

export const mutations = {
    SET_DARKMODE(state, value) {
        state.settings.darkMode = value;
    },
    SET_LOCALIZATION(state, value) {
        state.settings.localization = value;
    },
    SET_NOTIFICATIONS(state, value) {
        state.settings.notifications = value;
    },
};

export const actions = {
    async getSettings({ state, commit, dispatch, rootGetters }) {
        if(!rootGetters['auth/loggedIn']) {
            return;
        }
        const { get } = StorageService();
        try {
            const storedLocalization = await get(`localization.${rootGetters['auth/authUser'].id}`);
            const storedDarkMode = await get(`isDarkModeOn.${rootGetters['auth/authUser'].id}`);
            const storedNotifications = await get(`areNotificationsOn.${rootGetters['auth/authUser'].id}`);

            document.body.classList.toggle('dark', storedDarkMode);
            i18n.global.locale.value = storedLocalization.value || 'sr';

            commit("SET_DARKMODE", storedDarkMode);
            commit("SET_LOCALIZATION", storedLocalization);
            commit("SET_NOTIFICATIONS", storedNotifications);

            if(Capacitor.isNativePlatform()) {
                if(storedDarkMode) {
                    Keyboard.setStyle({
                        style: KeyboardStyle.Dark,
                    });
                }else {
                    Keyboard.setStyle({
                        style: KeyboardStyle.Light,
                    });
                }
            }

        }catch(error) {
            const localization = state.settings?.localization || {
                text: 'SRB',
                value: 'sr',
            };
            const darkMode = state.settings?.darkMode || false;
            const notifications = state.settings?.notifications || false;

            document.body.classList.toggle('dark', false);
            i18n.global.locale.value = 'sr';

            dispatch('setDarkMode', darkMode)
            dispatch('setNotifications', notifications)
            dispatch('setLocalization', localization)
        }
    },
    async setDarkMode({ commit, rootGetters }, value) {
        const { set } = StorageService();

        try {
            await set(`isDarkModeOn.${rootGetters['auth/authUser']?.id}`, value);
            commit("SET_DARKMODE", value);
        }catch(error) {
            commit("SET_DARKMODE", false);
            await set(`isDarkModeOn.${rootGetters['auth/authUser']?.id}`, false);
        }
    },
    async setNotifications({ commit, rootGetters }, value) {
        const { set } = StorageService();

        try {
            await set(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`, value);
            commit("SET_NOTIFICATIONS", value);
        }catch(error) {
            commit("SET_NOTIFICATIONS", false);
            await set(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`, false);
        }
    },
    async setLocalization({ commit, rootGetters }, value) {
        const { set } = StorageService();

        try {
            await set(`localization.${rootGetters['auth/authUser']?.id}`, value);
            commit("SET_LOCALIZATION", value);
        }catch(error) {
            const defaultLocalization = {
                text: 'SRB',
                value: 'sr',
            };

            commit("SET_LOCALIZATION", defaultLocalization);
            await set(`localization.${rootGetters['auth/authUser']?.id}`, defaultLocalization);
        }
    },
};

export const getters = {
    darkMode: (state) => {
        return !!state.settings?.darkMode;
    },
    localization: (state) => {
        return state.settings?.localization || {
            text: 'SRB',
            value: 'sr',
        };
    },
    notifications: (state) => {
        return !!state.settings?.notifications;
    },
};