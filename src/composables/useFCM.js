import { useRouter } from 'vue-router';
import { useI18n }   from 'vue-i18n';
import { useStore }  from 'vuex';
import { Capacitor } from '@capacitor/core';

import AuthService from '@/services/AuthService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { PushNotifications } from '@capacitor/push-notifications';

import { Haptics } from '@capacitor/haptics';

export function useFCM() {
    /* Global properties */
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */

    /* Methods */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Methods */
    const initPush = async() => {
        if(Capacitor.getPlatform() !== 'web') {
            await registerListeners();
        }
    };
    const registerListeners = async() => {
        /* Event listeners */
        PushNotifications.addListener(
            'registration',
            async(token) => {
                const payload = {
                    fcm_token: token.value,
                };
                /* Saving token from FCM into users table */
                try {
                    await AuthService.setFcmToken(payload);
                }catch(error) {
                    showErrorToast(error);
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
                if(Object.keys(notification.data).length === 0 || notification.data.type === 'notification') {
                    await handleNotification(notification);
                }else {
                    await handleDataNotification(notification);
                }
            },
        );
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            () => {
                router.push({
                    name: 'dashboard',
                });
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
        if(!store.getters['auth/isStaff'] && !store.getters['auth/isOwner']) {
            await Haptics.vibrate({ duration: 250 });
            showSuccessToast(t('freeSpotNotification', { place: notification.data?.place_name }));
        }
    };
    const handleDataNotification = async(notification) => {
        if(
            notification.data.type === 'availabilityChanged' &&
            (store.getters['auth/isStaff'] || store.getters['auth/isOwner'])
        ) {
            store.commit('staff/SET_AVAILABILITY_RATIO', notification.data.availability_ratio);
        }
    };

    return {
        /* Component properties */

        /* Methods */
        initPush,
        registerToken,
    };
}
