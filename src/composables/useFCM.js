import { useRoute, useRouter } from 'vue-router';
import { useI18n }             from 'vue-i18n';
import { useStore }            from 'vuex';
import { Capacitor }           from '@capacitor/core';

import AuthService from '@/services/AuthService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useNotifications }      from '@/composables/useNotificataions';

import { PushNotifications }  from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import { Haptics }               from '@capacitor/haptics';
import { getDisplayNameForUser } from '@/utils/helpers';

export function useFCM() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    /* Composables */
    const { readAllNotifications } = useNotifications();

    /* Methods */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Methods */
    const initPush = async() => {
        if(Capacitor.isNativePlatform()) {
            await registerListeners();
        }
    };
    const registerListeners = async() => {
        /* Event listeners */
        PushNotifications.addListener(
            'registration',
            async(token) => {
                if(store.getters['auth/loggedIn']) {
                    const payload = {
                        fcm_token: token.value,
                    };
                    /* Saving token from FCM into users table */
                    try {
                        await AuthService.setFcmToken(payload);
                    }catch(error) {
                        showErrorToast(error);
                    }
                }
            },
        );
        PushNotifications.addListener(
            'registrationError',
            () => {
                showErrorToast(
                    null,
                    {
                        pushNotificationPermission: t('generalAlertError'),
                    });
            },
        );
        PushNotifications.addListener(
            'pushNotificationReceived',
            async(notification) => {
                if(notification.data) {
                    await handleNotification(notification);
                }
            },
        );
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification) => {
                if(notification.data) {
                    handleNotificationActionPerformed(notification.data);
                }
            },
        );
        LocalNotifications.addListener(
            'localNotificationActionPerformed',
            (notification) => {
                if(notification.notification.extra) {
                    handleNotificationActionPerformed(notification.notification.extra);
                }
            },
        );
    };
    const registerToken = async() => {
        if(Capacitor.getPlatform() === 'web') {
            showErrorToast(
                null,
                {
                    pushNotificationPermission: t('warningWebNotification'),
                });
            return true;
        }
        try {
            const permission = await PushNotifications.requestPermissions();

            if(permission.receive === 'granted') {
                await LocalNotifications.requestPermissions();

                await PushNotifications.register();
            }else {
                showErrorToast(
                    null,
                    {
                        pushNotificationPermission: t('warningNoNotificationPermission'),
                    });
            }
        }catch(error) {
            showErrorToast(error);
        }
    };
    const handleNotification = async(notification) => {
        switch(notification.data.type) {
            case 'availabilityChanged':
                updateStaffAvailability(notification.data);
                break;
            case 'tableFreed':
                await notifyUserTableFreed(notification.data);
                break;
            case 'dayOffStatusChanged':
                await notifyStaffDayOffRequestStatusChanged(notification.data);
                break;
            case 'staffRequestedDayOff':
                await notifyOwnerStaffRequestedDayOff(notification.data);
                break;
            case 'scheduleAdded':
                await notifyStaffScheduleAdded(notification.data);
                break;
            case 'scheduleUpdated':
                await notifyStaffScheduleUpdated(notification.data);
                break;
        }
    };
    const handleNotificationActionPerformed = (notification) => {
        switch(notification.type) {
            case 'tableFreed':
                router.push({
                    name: 'dashboard',
                    query: {
                        id: notification.id,
                    },
                });
                break;
            case 'dayOffStatusChanged':
                router.push({
                    name: 'staff.schedule.daysOff',
                    query: {
                        month: notification.month,
                        year: notification.year,
                    },
                });
                break;
            case 'staffRequestedDayOff':
                router.push({
                    name: 'staff.schedule.daysOff',
                    query: {
                        id: notification.id,
                        month: notification.month,
                        year: notification.year,
                    },
                });
                break;
            case 'scheduleAdded':
                router.push({
                    name: 'staff.schedule',
                    query: {
                        day: notification.day,
                        month: notification.month,
                        year: notification.year,
                    },
                });
                break;
            case 'scheduleUpdated':
                router.push({
                    name: 'staff.schedule',
                    query: {
                        day: notification.day,
                        month: notification.month,
                        year: notification.year,
                    },
                });
                break;
        }
    };

    /* Notification handlers */
    const updateStaffAvailability = (notification) => {
        if(store.getters['auth/isStaff'] || store.getters['auth/isOwner']) {
            store.commit('staff/SET_AVAILABILITY_RATIO', notification.availability_ratio);
            store.commit('owner/TOGGLE_TABLE_AVAILABILITY', {
                tableId: notification.table_id,
                value: notification.empty === 'true',
            });
        }
    };
    const notifyUserTableFreed = async(notification) => {
        if(!store.getters['auth/isStaff'] && !store.getters['auth/isOwner']) {
            const notificationId = Number(notification.id);
            const id = Number(notification.place_id);
            const notificationBody = t(
                'freeSpotBody',
                {
                    place: notification.place_name,
                    seats: notification.seats,
                },
            );
            const dateReceived = new Date();

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: notificationId,
                        title: t('freeSpot'),
                        body: notificationBody,
                        largeIcon: 'ic_table_icon',
                        schedule: {
                            allowWhileIdle: true,
                        },
                        extra: {
                            type: 'tableFreed',
                            id,
                        },
                    },
                ],
            });

            await Haptics.vibrate({ duration: 250 });

            showSuccessToast(notificationBody, () => {
                router.push({
                    name: 'dashboard',
                    query: {
                        id,
                    },
                });
                store.commit("global/NOTIFICATION_DATA_RECEIVED", {
                    id,
                });
            });

            store.commit("user/ADD_NOTIFICATION", {
                id: notificationId,
                read: false,
                body: notificationBody,
                received: `${dateReceived.getDate()}.${dateReceived.getMonth() + 1}.${dateReceived.getFullYear()}`,
            });

            store.dispatch("user/persistPushNotifications");
        }
    };
    const notifyStaffDayOffRequestStatusChanged = async(notification) => {
        if(store.getters['auth/isStaff']) {
            const id = Number(notification.id);
            const status = Number(notification.status);
            const numberOfDaysOffAsked = Number(notification.number_of_days);
            const title = t(
                'offDayStatusChanged',
                {
                    status: status === 2 ?
                        t('approved1').toLocaleLowerCase() :
                        t('declined1').toLocaleLowerCase(),
                },
                numberOfDaysOffAsked,
            );
            const body = t(
                'offDayStatusChangedBody',
                {
                    status: status === 2 ?
                        t('ownerApproved').toLocaleLowerCase() :
                        t('ownerDeclined').toLocaleLowerCase(),
                    startDate: `${notification.day}.${notification.month}.${notification.year}`,
                },
                numberOfDaysOffAsked,
            );
            const day = Number(notification.day);
            const month = Number(notification.month) - 1;
            const year = Number(notification.year);
            const dateReceived = new Date();

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id,
                        title,
                        body,
                        largeIcon: 'ic_calendar_icon',
                        schedule: {
                            allowWhileIdle: true,
                        },
                        extra: {
                            type: notification.type,
                            month,
                            year,
                        },
                    },
                ],
            });

            await Haptics.vibrate({ duration: 250 });
            status === 2 ?
                showSuccessToast(body, () => {
                    router.push({
                        name: 'staff.schedule.daysOff',
                        query: {
                            month,
                            year,
                        },
                    });
                    store.commit("global/NOTIFICATION_DATA_RECEIVED", {
                        month,
                        year,
                    });
                }) :
                showErrorToast(null, { declined: body }, () => {
                    router.push({
                        name: 'staff.schedule.daysOff',
                        query: {
                            month,
                            year,
                        },
                    });
                    store.commit("global/NOTIFICATION_DATA_RECEIVED", {
                        month,
                        year,
                    });
                });

            store.commit("staff/UPDATE_DAY_OFF_REQUEST_STATUS", {
                day,
                month,
                year,
                numberOfDays: numberOfDaysOffAsked,
                status,
            });

            store.commit("user/ADD_NOTIFICATION", {
                id,
                read: false,
                body,
                received: `${dateReceived.getDate()}.${dateReceived.getMonth() + 1}.${dateReceived.getFullYear()}`,
            });

            if(route.name === 'staff.notifications') {
                readAllNotifications();
            }

            store.dispatch("user/persistPushNotifications");
        }
    };
    const notifyOwnerStaffRequestedDayOff = async(notification) => {
        if(store.getters['auth/isOwner']) {
            const notificationId = Number(notification.id);
            const id = Number(notification.request_id);
            const numberOfDaysOffAsked = Number(notification.number_of_days);
            const staff = JSON.parse(notification.staff);
            const startDateParts = notification.start_date.split('-');
            const day = Number(startDateParts[0]);
            const month = Number(startDateParts[1]) - 1;
            const year = Number(startDateParts[2]);
            const title = t('staffRequestedDayOff', numberOfDaysOffAsked);
            const body = t(
                'staffRequestedDayOffBody',
                {
                    staff: getDisplayNameForUser(staff),
                    startDate: `${day}.${month + 1}.${year}`,
                    numberOfDays: numberOfDaysOffAsked,
                },
                numberOfDaysOffAsked,
            );

            const dateReceived = new Date();

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: notificationId,
                        title,
                        body,
                        largeIcon: 'ic_calendar_icon',
                        schedule: {
                            allowWhileIdle: true,
                        },
                        extra: {
                            type: notification.type,
                            id,
                            month,
                            year,
                        },
                    },
                ],
            });

            await Haptics.vibrate({ duration: 250 });
            showSuccessToast(body, () => {
                router.push({
                    name: 'staff.schedule.daysOff',
                    query: {
                        id,
                        month,
                        year,
                    },
                });
                store.commit("global/NOTIFICATION_DATA_RECEIVED", {
                    id,
                    month,
                    year,
                });
            });

            store.commit("owner/ADD_DAY_OFF_REQUEST", {
                id,
                start_date: notification.start_date,
                end_date: notification.end_date,
                number_of_days: numberOfDaysOffAsked,
                staff,
                message: notification.message,
                status: 0,
            });

            store.commit("user/ADD_NOTIFICATION", {
                id, notificationId,
                read: false,
                body,
                received: `${dateReceived.getDate()}.${dateReceived.getMonth() + 1}.${dateReceived.getFullYear()}`,
            });

            if(route.name === 'staff.notifications') {
                readAllNotifications();
            }else {
                store.dispatch("user/persistPushNotifications");
            }
        }
    };
    const notifyStaffScheduleAdded = async(notification) => {
        if(store.getters['auth/isStaff']) {
            const notificationId = Number(notification.id);
            const id = Number(notification.schedule_id);
            const numberOfHours = Number(notification.number_of_hours);
            const day = Number(notification.day);
            const month = Number(notification.month) - 1;
            const year = Number(notification.year);
            const dateReceived = new Date();
            const title = t('ownerAddedSchedule');
            const body = t(
                'ownerAddedScheduleBody',
                {
                    start_date: `${notification.day}.${notification.month}.${notification.year}`,
                },
            );

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: notificationId,
                        title,
                        body,
                        largeIcon: 'ic_clock_icon',
                        schedule: {
                            allowWhileIdle: true,
                        },
                        extra: {
                            type: notification.type,
                            day,
                            month,
                            year,
                        },
                    },
                ],
            });

            await Haptics.vibrate({ duration: 250 });

            showSuccessToast(body, () => {
                router.push({
                    name: 'staff.schedule',
                    query: {
                        day,
                        month,
                        year,
                    },
                });
                store.commit("global/NOTIFICATION_DATA_RECEIVED", {
                    day,
                    month,
                    year,
                });
            });

            store.commit("staff/ADD_SCHEDULE", {
                id,
                day,
                month,
                year,
                start_date: notification.start_date,
                start_time: notification.start_time,
                number_of_hours: numberOfHours,
            });

            store.commit("user/ADD_NOTIFICATION", {
                id: notificationId,
                read: false,
                body,
                received: `${dateReceived.getDate()}.${dateReceived.getMonth() + 1}.${dateReceived.getFullYear()}`,
            });

            if(route.name === 'staff.notifications') {
                readAllNotifications();
            }

            store.dispatch("user/persistPushNotifications");
        }
    };
    const notifyStaffScheduleUpdated = async(notification) => {
        if(store.getters['auth/isStaff']) {
            const notificationId = Number(notification.id);
            const id = Number(notification.schedule_id);
            const numberOfHours = Number(notification.number_of_hours);
            const day = Number(notification.day);
            const month = Number(notification.month) - 1;
            const year = Number(notification.year);
            const dateReceived = new Date();
            const title = t('ownerUpdatedSchedule');
            const body = t(
                'ownerUpdatedScheduleBody',
                {
                    start_date: `${notification.day}.${notification.month}.${notification.year}`,
                },
            );

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: notificationId,
                        title,
                        body,
                        largeIcon: 'ic_clock_icon',
                        schedule: {
                            allowWhileIdle: true,
                        },
                        extra: {
                            type: notification.type,
                            day,
                            month,
                            year,
                        },
                    },
                ],
            });

            await Haptics.vibrate({ duration: 250 });

            showSuccessToast(body, () => {
                router.push({
                    name: 'staff.schedule',
                    query: {
                        day,
                        month,
                        year,
                    },
                });
                store.commit("global/NOTIFICATION_DATA_RECEIVED", {
                    day,
                    month,
                    year,
                });
            });

            store.commit("staff/UPDATE_SCHEDULE", {
                id,
                payload: {
                    start_time: notification.start_time,
                    number_of_hours: numberOfHours,
                },
            });

            store.commit("user/ADD_NOTIFICATION", {
                id: notificationId,
                read: false,
                body,
                received: `${dateReceived.getDate()}.${dateReceived.getMonth() + 1}.${dateReceived.getFullYear()}`,
            });

            if(route.name === 'staff.notifications') {
                readAllNotifications();
            }

            store.dispatch("user/persistPushNotifications");
        }
    };

    return {
        /* Component properties */

        /* Methods */
        initPush,
        registerToken,
    };
}
