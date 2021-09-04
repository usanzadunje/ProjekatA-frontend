import { useRouter } from 'vue-router';
import { Capacitor } from '@capacitor/core';
import { useI18n }   from 'vue-i18n';

import AuthService from '@/services/AuthService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { PushNotifications }  from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';


export function useFCM() {
    /* Global properties */
    const router = useRouter();
    const { t } = useI18n();

    /* Methods */
    const { showErrorToast } = useToastNotifications();

    /* Methods */
    const initPush = async() => {
        if(Capacitor.getPlatform() !== 'web') {
            await registerPush();
        }else {
            showErrorToast(
                null,
                {
                    pushNotificationPermission: t('warningWebNotification'),
                });
            return true;
        }
    };
    const registerPush = async() => {
        /* If permission is not granted asks for permission, after granted it registers Push Notifications */
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
            showErrorToast(
                null,
                {
                    pushNotificationPermission: t('generalAlertError'),
                });
        }


        /* Event listeners */
        PushNotifications.addListener(
            'registration',
            async(token) => {
                const payload = {
                    fcm_token: token.value,
                };
                /* Saving token from FCM into user table */
                try {
                    await AuthService.setFcmToken(payload);
                }catch(e) {
                    showErrorToast(
                        null,
                        {
                            pushNotificationPermission: t('generalAlertError'),
                        });
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
                alert(JSON.stringify(notification));
            },
        );
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification) => {
                alert(notification);
                // let data = notification.notification.data;
                // router.push({
                //     name: 'cafe',
                //     params: {
                //         id: data.cafe_id
                //     }
                // });
            },
        );
        LocalNotifications.addListener(
            'localNotificationActionPerformed',
            () => {
                router.push({
                    name: 'cafes',
                });
            },
        );
    };

    return {
        /* Methods */
        initPush,
        registerPush,
    };
}
