// import { useRouter } from 'vue-router';
import { useI18n }   from 'vue-i18n';
import { useStore }  from 'vuex';
import { Capacitor } from '@capacitor/core';

import AuthService from '@/services/AuthService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { PushNotifications }  from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';


export function useFCM() {
    /* Global properties */
    // const router = useRouter();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */

    /* Methods */
    const { showErrorToast } = useToastNotifications();

    /* Methods */
    const initPush = async() => {
        if(Capacitor.getPlatform() !== 'web') {
            await registerPush();
        }
    };
    const registerPush = async() => {
        /* If permission is not granted asks for permission, after granted it registers Push Notifications */
        try {
            await PushNotifications.requestPermissions();
        }catch(error) {
            showErrorToast(error);
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
                if(
                    notification.title === 'Changed' &&
                    (store.getters['auth/isStaff'] || store.getters['auth/isOwner'])
                ) {
                    await store.dispatch('staff/updatePlaceAvailability');
                }
                await LocalNotifications.schedule({
                    title: notification.title,
                    body: notification.body,
                });
                alert('received');
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
                alert('Action performed');
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


    return {
        /* Component properties */

        /* Methods */
        initPush,
        registerPush,
        registerToken,
    };
}
