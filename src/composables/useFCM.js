import { useRouter } from 'vue-router';
import {
    Plugins,
    // PushNotification,
    // PushNotificationToken,
    // PushNotificationActionPerformed,
    Capacitor,
}                    from '@capacitor/core';
import AuthService   from '../services/AuthService';

export function useFCM() {
    const { PushNotifications, LocalNotifications } = Plugins;
    const router = useRouter();

    const initPush = () => {
        if(Capacitor.platform !== 'web') {
            registerPush();
        }
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
        /* Registering event listeners */
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
                            title: notification.title,
                            body: notification.body,
                            id: Math.random(),
                        },
                    ],
                });
            },
        );
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification) => {
                alert('Push action performed: ' + JSON.stringify(notification));
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
        /* End event listeners */
    };

    return {
        initPush,
        registerPush,
    };
}
