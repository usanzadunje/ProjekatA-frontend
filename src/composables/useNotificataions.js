import { useStore }      from 'vuex';
import { computed, ref } from 'vue';

export function useNotifications() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const notifications = computed(() => store.getters['user/pushNotifications']);
    const newestNotificationPayload = ref({ name: 'dsad' });

    /* Methods */
    const removeNotification = (id) => {
        store.commit('user/REMOVE_NOTIFICATION', id);
        store.dispatch("user/persistPushNotifications");
    };
    const readNotification = (id) => {
        store.commit('user/MARK_NOTIFICATION_AS_READ', id);
        store.dispatch("user/persistPushNotifications");
    };
    const readAllNotifications = () => {
        store.commit('user/MARK_ALL_NOTIFICATIONS_AS_READ');
        store.dispatch("user/persistPushNotifications");
    };
    const clearNotifications = () => {
        store.commit('user/CLEAR_NOTIFICATIONS');
        store.dispatch("user/persistPushNotifications");
    };

    /* Watchers */
    store.subscribe((mutation) => {
        if(mutation.type === 'global/NOTIFICATION_DATA_RECEIVED') {
            newestNotificationPayload.value = mutation.payload;
        }
    });

    return {
        /* Component properties */
        notifications,
        newestNotificationPayload,

        /* Methods */
        removeNotification,
        readNotification,
        readAllNotifications,
        clearNotifications,
    };
}