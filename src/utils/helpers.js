import router from "@/router";

import { i18n }                    from '@/i18n';
import store                       from '@/store';
import { Capacitor }               from '@capacitor/core';
import { Keyboard, KeyboardStyle } from '@capacitor/keyboard';

// Returning array of errors from backend
export function getError(error) {
    const errorMessage = { apiError: [i18n.global.t('generalAlertError')] };

    if(error.response?.status === 404) {
        if(router.currentRoute.name !== "notFound")
            router.push({ path: "/404" });
    }

    if(error.response?.status === 401 || error.response?.status === 403) {
        return { unauthorized: [i18n.global.t('unauthorized')] };
    }

    if(error.response?.status === 429) {
        return { tooManyRequests: [i18n.global.t('tooManyRequests')] };
    }

    if(error.response?.data && error.response.data.errors) {
        return error.response.data.errors;
    }

    return errorMessage;
}

// Timer
export function sleep(milliseconds) {
    return new Promise((resolve, reject) => {
        if(milliseconds < 1) {
            reject('Invalid time in milliseconds passed.');
        }
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}

// Gettings localized string
export function loadLocaleMessages(locales) {
    let messages = {};
    locales.keys().forEach(key => {
        if(key === './index.js') {
            return;
        }

        Object.assign(messages, messages, locales(key).default);
    });
    return messages;
}

// Calculating width in px from % of child element
export function calculatePxFromPercent(percent, parentWidth) {
    return Math.round((percent * (parentWidth - 24)) / 100);
}

// Since vuex is getting populated with tables that are stored in DB
// these cloned ones will still stay and be duplicated with ones returned
// to avoid this we remove cloned tables and keep only fresh ones from real DB
export function removeClonedTableElements() {
    document.querySelectorAll('[data-cloned="true"]').forEach(clonedTable => {
        document.querySelector("#dropzone").removeChild(clonedTable);
    });
}

// Since vuex is getting populated with tables that are stored in DB
// these cloned ones will still stay and be duplicated with ones returned
// to avoid this we remove cloned tables and keep only fresh ones from real DB
export function increaseAccordionMaxHeight(id, additionalHeight) {
    const accordionPanel = document.getElementById(id);
    const panelCurrentMaxHeight = parseInt(getComputedStyle(accordionPanel).getPropertyValue('max-height'));
    accordionPanel.style.setProperty('max-height', `${panelCurrentMaxHeight + additionalHeight}px`);
}

export async function setKeyboardStyle(dark = false) {
    try {
        if(Capacitor.isNativePlatform()) {
            if(dark) {
                await Keyboard?.setStyle({
                    style: KeyboardStyle.Dark,
                });
            }else {
                await Keyboard?.setStyle({
                    style: KeyboardStyle.Light,
                });
            }
        }
    }catch(e) {
        return;
    }
}

export async function hideNativeKeyboard() {
    if(Capacitor.isNativePlatform()) {
        try {
            await Keyboard?.hide();
        }catch(e) {
            return;
        }
    }
}

export function getExpirationDate(intervalType = 'd', intervalLength = 1) {
    if(intervalLength > 0) {
        switch(intervalType) {
            case 's' :
                return Date.now() + 1000 * intervalLength;
            case 'm' :
                return Date.now() + 1000 * 60 * intervalLength;
            case 'h' :
                return Date.now() + 1000 * 60 * 60 * intervalLength;
            case 'd' :
                return Date.now() + 1000 * 60 * 60 * 24 * intervalLength;
            default:
                throw new Error('Unknown time type. Choose from seconds(s), minutes(m), hours(h) or days(d).');
        }
    }else {
        throw new Error('You cannot provide 0 or negative values as time amount.');
    }
}

export function didCacheExpire(getter) {
    const expirationTime = store.getters[`global/${getter}`] || Date.now();

    return Date.now() >= expirationTime;
}