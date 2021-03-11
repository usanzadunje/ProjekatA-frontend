import { Plugins } from '@capacitor/core';

const { LocalNotifications } = Plugins;

export default {
    async registerLocalNotifications() {
        await LocalNotifications.requestPermission();
    },
    async sendNotification(cafeName) {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Table Freed',
                    body: `New table has been freed in ${cafeName}`,
                    id: Math.random(),
                    iconColor: '0000FF',
                },
            ],
        });
    },
};
