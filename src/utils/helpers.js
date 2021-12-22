import router from "@/router";

import { i18n } from '@/i18n';
import store    from '@/store';

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

export const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export const shortDays = [
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
];

export const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
];

export const shortMonths = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
];

export function getDaysInCurrentMonth() {
    const dt = new Date();

    return new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
}

export function getDaysInAMonth(month, year = null) {
    const dt = new Date();

    if(!year) {
        year = dt.getFullYear();
    }

    return new Date(year, month + 1, 0).getDate();
}

export function getDayFromDateString(date) {
    return Number(date.split('-')[0]);
}

export function dateAlreadyPassed(day, month, year) {
    const dt = new Date();

    const dayPassedThisMonth = day < dt.getDate() && month === dt.getMonth() && year === dt.getFullYear();
    const dayIsInPastMonthsOrYears = month < dt.getMonth() && year <= dt.getFullYear();

    return dayPassedThisMonth || dayIsInPastMonthsOrYears;
}

export function dateIsCurrentDate(day, month, year) {
    const dt = new Date();

    return day === dt.getDate() && month === dt.getMonth() && year === dt.getFullYear();
}

export function getWeekDayNumbers(day, month, year) {
    const days = [day];
    let zeroIndex = 0;

    for(let i = 1; i <= 6; i++) {
        if(getDaysInAMonth(month, year) === day) {
            days.push(1 + zeroIndex++);
        }else {
            days.push(++day);
        }
    }

    return days;
}

export function parseDateToString(date, currentSeparator = '-', newSeparator = '.', order = 'forward') {
    const dateParts = date?.split(currentSeparator);

    if(!dateParts) {
        return '';
    }

    return order === 'forward' ?
        `${dateParts[0]}${newSeparator}${dateParts[1]}${newSeparator}${dateParts[2]}` :
        `${dateParts[2]}${newSeparator}${dateParts[1]}${newSeparator}${dateParts[0]}`;
}

export function getDisplayNameForUser(user = {}) {
    if(user.fname || user.lname) {
        return `${user.fname || ''}${user.fname && user.lname ? ' ' : ''}${user.lname || ''}`;
    }else if(user.username) {
        return user.username;
    }else {
        return i18n.global.t('unknown');
    }
}
