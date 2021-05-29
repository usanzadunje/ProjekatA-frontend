import { useRouter } from 'vue-router';

import {
    Plugins,
    Capacitor,
} from '@capacitor/core';

import AuthService    from '../services/AuthService';
import { useStorage } from '@/services/StorageService';

export function useFCM(userId) {
    /* Global properties */
    const { PushNotifications, LocalNotifications } = Plugins;
    const router = useRouter();

    //Initializing storage and destructuring getter
    const { get } = useStorage();

    /* Methods */
    const initPush = () => {
        get(`areNotificationsOn.${userId}`)
            .then((response) => {
                if(Capacitor.platform !== 'web' && !!response) {
                    registerPush();
                }
            })
            .catch((error) => {
                alert(error);
            });

    };
    const registerPush = () => {
        /* If permission is not granted asks for permission, after granted it registers Push Notifications */
        PushNotifications.requestPermission()
                         .then((permission) => {
                             if(permission.granted) {
                                 PushNotifications.register();
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
                AuthService.setFcmToken(payload).then().catch((error) => {
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
            (notification) => {
                LocalNotifications.schedule({
                    notifications: [
                        {
                            id: notification.data.cafeId,
                            title: notification.title,
                            body: notification.body,
                            autoCancel: true,
                        },
                    ],
                });
            },
        );
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            () => {
                router.push({
                    name: 'cafes',
                });
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
