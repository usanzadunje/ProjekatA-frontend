import { useRouter } from 'vue-router';
import {
    Plugins,
    // PushNotification,
    // PushNotificationToken,
    // PushNotificationActionPerformed,
    Capacitor,
}                    from '@capacitor/core';

export function useFCM() {
    const { PushNotifications, LocalNotifications } = Plugins;
    const router = useRouter();

    const initPush = () => {
        console.log('Initializing push notifications...');
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
                alert('Push registration success, token: ' + token.value);
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
                            iconColor: '#0000ff',
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
