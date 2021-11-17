<template>
  <ion-page>
    <ion-content>
      <div
          v-if="this.$store.getters['user/hasNotifications']"
          class="px-3"
      >
        <ion-header class="ion-no-border mt-1 mb-4">
          <ion-toolbar class="ion-no-padding">
            <div class="flex justify-between items-center">
              <h1 class="primary-text-color font-bold text-2xl">{{ $t('notification', 2) }}</h1>
              <ion-button class="h-auto" @click="clearNotifications">
                <span class="py-2 uppercase">{{ `${$t('clear')} ${$t('all')}` }}</span>
              </ion-button>
            </div>
          </ion-toolbar>
        </ion-header>
        <div
            v-for="notification in notifications"
            :key="notification.id"
        >
          <div class="pr-3 flex justify-end opacity-60 primary-text-color">
            {{ notification.received }}
          </div>
          <div class="mb-1 rounded-xl bg-gray-200 px-3 py-2 flex items-center justify-between">
            <p
                class="text-black text-base"
            >
              {{ notification.body }}
            </p>
            <ion-icon
                :icon="close"
                class="ml-2 text-black flex-shrink-0 text-lg"
                @click="removeNotification(notification.id)"
            ></ion-icon>
          </div>
        </div>
      </div>
      <div
          v-else
          class="h-full flex flex-col justify-center items-center"
      >
        <NoNotificationsPlaceholderImage
            :width="'80%'"
        />

        <div class="w-full mt-6 px-2">
          <h2 class="placeholder-heading-big primary-text-color break-words text-center">
            {{ $t('noNotificationsHeading1') }}
          </h2>
          <h3 class="placeholder-heading-small primary-text-color break-words text-center">
            {{ $t('noNotificationsHeading2') }}
          </h3>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
}                          from '@ionic/vue';

import NoNotificationsPlaceholderImage from '@/components/images/NoNotificationsPlaceholderImage';

import { useNotifications } from '@/composables/useNotificataions';

import { close } from 'ionicons/icons';

export default defineComponent({
  name: 'StaffSchedule',
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    NoNotificationsPlaceholderImage,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    /* Composables */
    const { notifications, removeNotification, clearNotifications } = useNotifications();

    /* Lifecycle hooks */

    /* Generating new date in case of stale data */

    /* Methods */

    /* Event handlers */

    return {
      /* Component properties */
      notifications,

      /* Event handlers */
      removeNotification,
      clearNotifications,

      /* Icons */
      close,
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}
</style>