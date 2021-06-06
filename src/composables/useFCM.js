import { useRouter } from 'vue-router';

import { Capacitor } from '@capacitor/core';

import { PushNotifications }  from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import AuthService from '../services/AuthService';

import { useStorage } from '@/services/StorageService';

export function useFCM(userId) {
    /* Global properties */
    const router = useRouter();

    //Initializing storage and destructuring getter
    const { get } = useStorage();

    /* Methods */
    const initPush = () => {
        get(`areNotificationsOn.${userId}`)
            .then((response) => {
                if(Capacitor.getPlatform() !== 'web' && !!response) {
                    registerPush();
                }
            })
            .catch((error) => {
                alert(error);
            });

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
                await LocalNotifications.schedule({
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
