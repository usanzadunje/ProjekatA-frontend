<template>
  <div class="flex">
    <ion-button
        fill="clear"
        @click="showNotifications($event)"
        class="reset-button-size"
    >
      <div class="relative">
        <ion-icon
            :icon="hasNotifications
            ? (unreadNotificationsCount > 0 ? notifications : notificationsOutline)
            : notificationsOffOutline"
            slot="icon-only"
            class="primary-icon-color flex"
        ></ion-icon>
        <div v-if="unreadNotificationsCount > 0" class="absolute z-40 top-0 left-10p">
          <div class="w-4 h-4 rounded-full">
            <ion-badge class="w-full rounded-full notification-badge">{{ unreadNotificationsCount }}</ion-badge>
          </div>
        </div>
      </div>
    </ion-button>
  </div>
</template>
<script>

import { defineComponent, computed } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonButton,
  IonIcon,
  IonBadge,
}                                    from '@ionic/vue';

import NotificationsPreviewPopover from '@/components/user/popovers/NotificationsPreviewPopover';

import { usePopover } from '@/composables/usePopover';

import {
  notifications,
  notificationsOutline,
  notificationsOffOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'NotificationsPreview',
  components: {
    IonButton,
    IonIcon,
    IonBadge,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const hasNotifications = computed(() => store.getters['user/hasNotifications']);
    const unreadNotificationsCount = computed(() => store.getters['user/unreadNotificationsCount']);

    /* Composables */
    const { openPopover } = usePopover();

    /* Event handlers */
    const showNotifications = async(event) => {
      await openPopover(NotificationsPreviewPopover, event, 'notifications-popover');
    };


    return {
      /* Component properties */
      hasNotifications,
      unreadNotificationsCount,

      /* Event handlers */
      showNotifications,

      /* Icons */
      notifications,
      notificationsOutline,
      notificationsOffOutline,
    };
  },
});
</script>
<style scoped>

ion-icon {
  font-size: 1.6rem !important;
}
</style>