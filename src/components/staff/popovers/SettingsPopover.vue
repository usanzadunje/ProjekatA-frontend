<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        :class="{ 'user-selected-color' : activeRouteName === 'dashboard' }"
        @click="navigateTo('staff.dashboard')"
    >
      <ion-icon
          :icon="statsChartOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('staff.dashboard') }}</span>
    </div>

    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        :class="{ 'user-selected-color' : activeRouteName === 'schedule' }"
        @click="navigateTo('staff.schedule')"
    >
      <ion-icon
          :icon="calendarOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('schedule') }}</span>
    </div>

    <div
        :class="{ 'user-selected-color' : activeRouteName === 'settings' }"
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('staff.settings')"
    >
      <ion-icon
          :icon="settingsOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('settings') }}</span>
    </div>
    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('staff.notifications');readAllNotifications()"
    >
      <div
          class="relative"
          :class="{
            'user-selected-color' :
              activeRouteName === 'notifications' &&
              (!this.$store.getters['user/unreadNotificationsCount'] || !this.$store.getters['user/hasNotifications'])
          }"
      >
        <ion-icon
            :icon="this.$store.getters['user/hasNotifications']
            ? (this.$store.getters['user/unreadNotificationsCount'] > 0 ? notifications : notificationsOutline)
            : notificationsOffOutline"
            class="flex-shrink-0"
        >
        </ion-icon>
        <div v-if="this.$store.getters['user/unreadNotificationsCount'] > 0"
             class="absolute z-40 -top-1 left-10p">
          <div class="w-4 h-4 rounded-full">
            <ion-badge class="w-full rounded-full notification-badge">
              {{ this.$store.getters['user/unreadNotificationsCount'] }}
            </ion-badge>
          </div>
        </div>
      </div>
      <span
          class="text-sm ml-3"
          :class="{ 'user-selected-color' : activeRouteName === 'notifications' }"
      >
        {{ $t('notification', 2) }}
      </span>
    </div>

    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300 border-t border-gray-300"
        @click="logout"
    >
      <ion-icon
          :icon="logOutOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('logout') }}</span>
    </div>
  </ion-content>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useRoute, useRouter }       from 'vue-router';
import { useStore }                  from 'vuex';
import {
  IonContent,
  IonIcon,
    IonBadge,
  popoverController,
}                                    from '@ionic/vue';

import {
  statsChartOutline,
  calendarOutline,
  settingsOutline,
  notifications,
  notificationsOffOutline,
  notificationsOutline,
  logOutOutline,
}                           from 'ionicons/icons';
import { useNotifications } from '@/composables/useNotificataions';

export default defineComponent({
  name: 'SettingsPopover',
  components: {
    IonContent,
    IonIcon,
    IonBadge,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    /* Component properties */
    const activeRouteName = computed(() => route.name.split('.')[1]);

    /* Composables */
    const { readAllNotifications } = useNotifications();

    /* Event handlers */
    const logout = async() => {
      await popoverController.dismiss();

      await store.dispatch("auth/logout");
    };
    const navigateTo = async(pageName) => {
      await router.push({ name: pageName });

      await popoverController.dismiss();
    };

    return {
      /* Component properties */
      activeRouteName,

      /* Event handlers */
      logout,
      navigateTo,
      readAllNotifications,

      /* Icons */
      statsChartOutline,
      calendarOutline,
      settingsOutline,
      notifications,
      notificationsOffOutline,
      notificationsOutline,
      logOutOutline,
    };
  },
});
</script>
<style scoped>
ion-icon {
  font-size: 1.4em;
}
</style>