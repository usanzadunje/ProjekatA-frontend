import { useRouter } from 'vue-router';
import {
    Plugins,
    // PushNotification,
    // PushNotificationToken,
    // PushNotificationActionPerformed,
    Capacitor,
}                    from '@capacitor/core';

export function useFCM() {
    const { PushNotifications } = Plugins;
    const router = useRouter();

    const initPush = () => {
        if(Capacitor.platform !== 'web') {
            registerPush();
        }
    };

    const registerPush = () => {
        /* If permission is not granted asks for permission, after granted it registers Push Notifications*/
        PushNotifications.requestPermission()
                         .then((permission) => {
                             if(permission.granted) {
                                 PushNotifications.register();
                             }else {
                                 alert('No permission for push granted');
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
                alert('Push received: ' + JSON.stringify(notification));
            },
        );
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification) => {
                alert('Push action performed: ' + JSON.stringify(notification));
                router.push({
                    name: 'notFound',
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
