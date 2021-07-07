import { useRouter } from 'vue-router';

import { Capacitor } from '@capacitor/core';

import { PushNotifications }  from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import AuthService from '../services/AuthService';

import { useStorage }            from '@/services/StorageService';
import { useToastNotifications } from '@/composables/useToastNotifications';

export function useFCM(userId) {
    /* Global properties */
    const router = useRouter();

    //Initializing storage and destructuring getter
    const { get } = useStorage();

    /* Methods */
    const { showErrorToast } = useToastNotifications();

    /* Methods */
    const initPush = async(isTryingToUnsubscribe = null) => {
        //isTryingToUnsubscribe => letting user unsubscribe even though notifications arent turned ON
        let permission = false;

        try {
            permission = await get(`areNotificationsOn.${userId}`);
        }catch(error) {
            await showErrorToast(null, { clientStoragePermission: 'Error : Cannot read storage.' });
            return false;
        }

        if(Capacitor.getPlatform() !== 'web' && !!permission) {
            registerPush();
        }else {
            if(!isTryingToUnsubscribe) {
                await showErrorToast(
                    null,
                    {
                        pushNotificationPermission: 'Permission for notifications not granted. Check your settings.',
                    },
                );
            }
            permission = false;
        }
        return permission || isTryingToUnsubscribe;
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
