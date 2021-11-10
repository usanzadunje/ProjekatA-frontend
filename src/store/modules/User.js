import { i18n } from "@/i18n";

import { StorageService } from '@/services/StorageService';

import { setKeyboardStyle } from '@/composables/useDevice';
import PlaceService         from '@/services/PlaceService';

export const namespaced = true;

export const state = {
    settings: {},
    notifications: [],
    placesAdditionalInfo: [],
    subscriptions: [],
    favoritePlaces: [],
};

export const mutations = {
    SET_DARKMODE(state, payload) {
        state.settings.darkMode = payload;
    },

    SET_LOCALIZATION(state, payload) {
        state.settings.localization = payload;
    },

    /* NOTIFICATIONS */
    SET_NOTIFICATIONS_PERMISSION(state, payload) {
        state.settings.notifications = payload;
    },
    SET_NOTIFICATIONS(state, payload) {
        state.notifications = payload;
    },
    ADD_NOTIFICATION(state, payload) {
        state.notifications.unshift(payload);
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

    /* PLACES */
    SET_PLACE_ADDITIONAL_INFO(state, payload) {
        state.placesAdditionalInfo.push(payload);
    },
    PURGE_PLACE_ADDITIONAL_INFO(state) {
        state.placesAdditionalInfo = [];
    },

    /* SUBSCRIPTIONS */
    SET_SUBSCRIPTIONS(state, payload) {
        state.subscriptions = payload;
    },
    ADD_SUBSCRIPTION(state, payload) {
        state.subscriptions.push(payload);
    },
    REMOVE_SUBSCRIPTION(state, id) {
        state.subscriptions = state.subscriptions.filter(placeId => placeId !== id);
    },
    PURGE_SUBSCRIPTION_DATA(state) {
        state.subscriptions = [];
    },

    /* FAVOURITE PLACES */
    SET_FAVORITE_PLACES(state, payload) {
        state.favoritePlaces = payload;
    },
    ADD_FAVORITE_PLACE(state, payload) {
        state.favoritePlaces.push(payload);
    },
    REMOVE_FAVORITE_PLACE(state, id) {
        state.favoritePlaces = state.favoritePlaces.filter(placeId => placeId !== id);
    },
    PURGE_FAVORITE_PLACE_DATA(state) {
        state.favoritePlaces = [];
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
        const storedUserNotifications = await get(`notifications.${rootGetters['auth/authUser']?.id}`) || [];
        const storedColor = await get(`color.${rootGetters['auth/authUser']?.id}`);

        document.body.classList.toggle('dark', storedDarkMode);
        i18n.global.locale.value = storedLocalization?.value;

        root.style.setProperty('--user-selected-color', storedColor ?? '#207DFF');
        root.style.setProperty('--primary-button', storedColor ?? '#1b6de0');

        commit("SET_DARKMODE", storedDarkMode);
        commit("SET_LOCALIZATION", storedLocalization);
        commit("SET_NOTIFICATIONS", storedUserNotifications);
        commit("SET_NOTIFICATIONS_PERMISSION", storedNotifications);

        await setKeyboardStyle(storedDarkMode);
    },

    async setDarkMode({ commit, rootGetters }, payload) {
        const { set } = StorageService();

        await set(`isDarkModeOn.${rootGetters['auth/authUser']?.id}`, payload);
        commit("SET_DARKMODE", payload);

        document.body.classList.toggle('dark', payload);

        await setKeyboardStyle(payload);
    },

    async setLocalization({ commit, rootGetters }, payload) {
        const { set } = StorageService();

        await set(`localization.${rootGetters['auth/authUser']?.id}`, payload);
        commit("SET_LOCALIZATION", payload);

        i18n.global.locale.value = payload.value;
    },

    async setNotifications({ commit, rootGetters }, payload) {
        const { set } = StorageService();

        await set(`areNotificationsOn.${rootGetters['auth/authUser']?.id}`, payload);
        commit("SET_NOTIFICATIONS_PERMISSION", payload);
    },
    async persistPushNotifications({ state, rootGetters }) {
        const { set } = StorageService();

        await set(`notifications.${rootGetters['auth/authUser']?.id}`, state.notifications);
    },

    async setGlobalColor({ rootGetters }, payload) {
        const root = document.documentElement;

        const { set } = StorageService();

        await set(`color.${rootGetters['auth/authUser']?.id}`, payload);

        root.style.setProperty('--user-selected-color', payload);
        root.style.setProperty('--primary-button', payload);
    },
    async resetGlobalColor({ rootGetters }) {
        const root = document.documentElement;

        const { set } = StorageService();

        await set(`color.${rootGetters['auth/authUser']?.id}`, null);

        root.style.setProperty('--user-selected-color', '#207DFF');
        root.style.setProperty('--primary-button', '#1b6de0');
    },

    async getSubscriptions({ commit }) {
        const response = await PlaceService.userSubscriptionIds();

        commit("SET_SUBSCRIPTIONS", response.data.subscriptions);
    },

    async getFavoritePlaces({ commit }) {
        const response = await PlaceService.userFavoritePlaceIds();

        commit("SET_FAVORITE_PLACES", response.data.favorite_places);
    },
    async addFavoritePlace({ commit }, payload) {
        PlaceService.favorite(payload.id);

        commit("ADD_FAVORITE_PLACE", payload.id);
    },
    async removeFavoritePlace({ commit }, payload) {
        PlaceService.unfavorite(payload.id);

        commit("REMOVE_FAVORITE_PLACE", payload.id);
    },
};

export const getters = {
    areSettingsPresent: (state) => {
        return state.settings;
    },

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
        return state.notifications?.length > 0;
    },
    unreadNotificationsCount: (state, getters) => {
        let unreadNotificationCount = 0;
        getters.pushNotifications?.forEach(notification => {
            if(!notification.read) {
                unreadNotificationCount++;
            }
        });

        return unreadNotificationCount;
    },

    hasMoreThanPlacesInfo: (state) => (amount) => {
        return state.placesAdditionalInfo?.length >= amount;
    },
    getPlaceAdditionInfo: (state) => (id) => {
        return state.placesAdditionalInfo?.find(place => place.id === id);
    },

    isSubscribedTo: (state) => (id) => {
        return !!state.subscriptions?.find(placeId => placeId === id);
    },
    hasSubscriptions: (state) => {
        return state.subscriptions?.length > 0;
    },

    hasInFavorites: (state) => (id) => {
        return !!state.favoritePlaces?.find(placeId => placeId === id);
    },
};