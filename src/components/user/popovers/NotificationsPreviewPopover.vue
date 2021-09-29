<template>
  <ion-content scrollY="false">
    <div class="px-4 py-1 flex items-center justify-between border-b border-dotted border-gray-400">
      <span>{{ $t('notifications') }}</span>
      <ion-button class="h-auto" @click="clearNotifications">
        <span class="py-0.5 lowercase">{{ $t('clear') }}</span>
      </ion-button>
    </div>
    <div
        v-for="(notification, index) in notifications"
        :key="notification.id"
        :class="{ 'border-b border-gray-300': index !== notifications.length - 1 }"
    >
      <div class="px-4 py-3 flex items-center justify-between rounded-md">
        <p
            @click="notificationRead(notification.id)"
            class="main-toolbar-fade-text"
            :class="{ 'notification-read': notification.read }"
        >{{ notification.body }}</p>
        <ion-icon
            @click="removeNotification(notification.id)"
            :icon="close"
            class="primary-icon-color flex-shrink-0"
        ></ion-icon>
      </div>
    </div>
    <div v-if="!this.$store.getters['user/hasNotifications']" class="px-4 py-3">
      <p
          class="main-toolbar-fade-text"
      >
        {{ $t('noNotifications') }}
      </p>
    </div>
  </ion-content>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonContent,
  IonIcon,
  IonButton,
}                                    from '@ionic/vue';

import { close } from 'ionicons/icons';

export default defineComponent({
  name: 'NotificationsPreviewPopover',
  components: {
    IonContent,
    IonIcon,
    IonButton,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const notifications = computed(() => store.getters['user/pushNotifications']);

    /* Event handlers */
    const removeNotification = (id) => {
      store.commit('user/REMOVE_NOTIFICATION', id);
    };
    const notificationRead = (id) => {
      store.commit('user/MARK_NOTIFICATION_AS_READ', id);
    };
    const clearNotifications = () => {
      store.commit('user/CLEAR_NOTIFICATIONS');
    };

    return {
      /* Component properties */
      notifications,

      /* Event handlers */
      removeNotification,
      notificationRead,
      clearNotifications,

      /* Icons */
      close,
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: #e5e7eb;
  --padding-top: 0.25rem;
  --padding-bottom: 0.25rem;
}

ion-icon {
  font-size: 1.25rem;
}

.notification-read {
  color: black !important;
}

ion-button {
  --background: var(--primary-button);
}
</style>