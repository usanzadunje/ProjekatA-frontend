import router from "@/router";

import { i18n } from '@/i18n';

// Returning array of errors from backend
export function getError(error) {
    const errorMessage = { apiError: [i18n.global.t('generalAlertError')] };

    if(error.response?.status === 404) {
        if(router.currentRoute.name !== "notFound")
            router.push({ path: "/404" });
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