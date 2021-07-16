import { useRouter } from 'vue-router';

import { Capacitor } from '@capacitor/core';

import { PushNotifications }  from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import AuthService from '../services/AuthService';

import { useToastNotifications } from '@/composables/useToastNotifications';

export function useFCM() {
    /* Global properties */
    const router = useRouter();

    /* Methods */
    const { showErrorToast } = useToastNotifications();

    /* Methods */
    const initPush = () => {
        if(Capacitor.getPlatform() !== 'web') {
            registerPush();
        }else {
            showErrorToast(
                null,
                {
                    pushNotificationPermission: 'You cannot register for push notifications on web.',
                });
        }
    };
    const registerPush = () => {
        /* If permission is not granted asks for permission, after granted it registers Push Notifications */
        PushNotifications.requestPermissions()
                         .then(async(permission) => {
                             if(permission.receive === 'granted') {
                                 await PushNotifications.register();
                             }else {
                                 alert('No permission for push notifications granted');
                             }
                         });

        /* Event listeners */
        PushNotifications.addListener(
            'registration',
            (token) => {
                const payload = {
                    fcm_token: token.value,
                };
                /* Saving token from FCM into user table */
                AuthService.setFcmToken(payload)
                           .then()
                           .catch((error) => {
                               alert(error);
                           });
            },
        );
        PushNotifications.addListener(
            'registrationError',
            (error) => {
                alert('Error on registration: ' + JSON.stringify(error));
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
