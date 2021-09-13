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
    async getSettings({ commit, rootGetters }) {
        const { get } = StorageService();

        const storedLocalization = await get(`localization.${rootGetters['auth/authUser']?.id}`);
        const storedDarkMode = await get(`isDarkModeOn.${rootGetters['auth/authUser']?.id}`) || false;
        const storedNotifications = await get(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`) || false;

        document.body.classList.toggle('dark', storedDarkMode);
        i18n.global.locale.value = storedLocalization?.value || 'sr';

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


    },
    async setDarkMode({ commit, rootGetters }, value) {
        const { set } = StorageService();

        await set(`isDarkModeOn.${rootGetters['auth/authUser']?.id}`, value);
        commit("SET_DARKMODE", value);
    },
    async setNotifications({ commit, rootGetters }, value) {
        const { set } = StorageService();

        await set(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`, value);
        commit("SET_NOTIFICATIONS", value);
    },
    async setLocalization({ commit, rootGetters }, value) {
        const { set } = StorageService();

        await set(`localization.${rootGetters['auth/authUser']?.id}`, value);
        commit("SET_LOCALIZATION", value);
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