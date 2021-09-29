import { Capacitor }               from "@capacitor/core";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";
import { i18n }                    from "@/i18n";

import { StorageService } from '@/services/StorageService';

export const namespaced = true;

export const state = {
    settings: {},
    notifications: [],
};

export const mutations = {
    SET_DARKMODE(state, value) {
        state.settings.darkMode = value;
    },
    SET_LOCALIZATION(state, value) {
        state.settings.localization = value;
    },
    SET_NOTIFICATIONS_PERMISSION(state, value) {
        state.settings.notifications = value;
    },
    ADD_NOTIFICATIONS(state, value) {
        state.notifications.unshift(value);
    },
    MARK_NOTIFICATION_AS_READ(state, id) {
        state.notifications.find(notification => {
            if(notification.id === id) {
                notification.read = true;
            }
        });
    },
    REMOVE_NOTIFICATION(state, id) {
        state.notifications = state.notifications.filter(notification => notification.id !== id);
    },
    CLEAR_NOTIFICATIONS(state) {
        state.notifications = [];
    },
};

export const actions = {
    async getSettings({ commit, rootGetters }) {
        const root = document.documentElement;

        const { get } = StorageService();

        const storedLocalization = await get(`localization.${rootGetters['auth/authUser']?.id}`) || {
            text: "SRB",
            value: "sr",
        };
        const storedDarkMode = await get(`isDarkModeOn.${rootGetters['auth/authUser']?.id}`) || false;
        const storedNotifications = await get(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`) || false;
        const storedColor = await get(`color.${rootGetters['auth/authUser']?.id}`);

        document.body.classList.toggle('dark', storedDarkMode);
        i18n.global.locale.value = storedLocalization?.value;

        root.style.setProperty('--user-selected-color', storedColor ?? '#207DFF');
        root.style.setProperty('--primary-button', storedColor ?? '#1b6de0');

        commit("SET_DARKMODE", storedDarkMode);
        commit("SET_LOCALIZATION", storedLocalization);
        commit("SET_NOTIFICATIONS_PERMISSION", storedNotifications);

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

        document.body.classList.toggle('dark', value);
    },
    async setNotifications({ commit, rootGetters }, value) {
        const { set } = StorageService();

        await set(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`, value);
        commit("SET_NOTIFICATIONS_PERMISSION", value);
    },
    async setLocalization({ commit, rootGetters }, value) {
        const { set } = StorageService();

        await set(`localization.${rootGetters['auth/authUser']?.id}`, value);
        commit("SET_LOCALIZATION", value);

        i18n.global.locale.value = value.value;
    },
    async setGlobalColor({ rootGetters }, value) {
        const root = document.documentElement;

        const { set } = StorageService();

        await set(`color.${rootGetters['auth/authUser']?.id}`, value);

        root.style.setProperty('--user-selected-color', value);
        root.style.setProperty('--primary-button', value);
    },
    async resetGlobalColor({ rootGetters }) {
        const root = document.documentElement;

        const { set } = StorageService();

        await set(`color.${rootGetters['auth/authUser']?.id}`, null);

        root.style.setProperty('--user-selected-color', '#207DFF');
        root.style.setProperty('--primary-button', '#1b6de0');
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
    pushNotifications: (state) => {
        return state.notifications;
    },
    hasNotifications: (state) => {
        return state.notifications.length > 0;
    },
    unreadNotificationsCount: (state, getters) => {
        let unreadNotificationCount = 0;
        getters.pushNotifications.forEach(notification => {
            if(!notification.read) {
                unreadNotificationCount++;
            }
        });

        return unreadNotificationCount;
    },
};