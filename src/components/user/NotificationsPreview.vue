<template>
  <div>
    <ion-button fill="clear" @click="showNotifications($event)" class="h-auto">
      <div class="relative">
        <ion-icon
            :icon="hasNotifications
            ? (unreadNotificationsCount > 0 ? notifications : notificationsOutline)
            : notificationsOffOutline"
            class="primary-icon-color"
            slot="icon-only"
        ></ion-icon>
        <div v-if="unreadNotificationsCount > 0" class="absolute z-200 top-0 left-4">
          <ion-badge>{{ unreadNotificationsCount }}</ion-badge>
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
ion-button {
  --padding-start: 0 !important;
  --padding-end: 5px !important;
}

ion-icon {
  font-size: 1.75rem !important;
}

ion-badge {
  font-size: 11px !important;
  padding: 3px !important;
  --background: var(--user-selected-color);
}
</style>