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

    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         :class="{ 'user-selected-color' : activeRouteName === 'place' }"
         @click="navigateTo('owner.place.info')">
      <ion-icon
          :icon="homeOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.place') }}</span>
    </div>

    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         :class="{ 'user-selected-color' : activeRouteName === 'staff' }"
         @click="navigateTo('owner.staff')"
    >
      <ion-icon
          :icon="peopleOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.staff') }}</span>
    </div>

    <div
        :class="{ 'user-selected-color' : activeRouteName === 'profile' }"
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('staff.profile')"
    >
      <ion-icon
          :icon="personOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('profile') }}</span>
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
  popoverController,
}                                    from '@ionic/vue';

import {
  statsChartOutline,
  personOutline,
  peopleOutline,
  homeOutline,
  settingsOutline,
  logOutOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'SettingsPopover',
  components: {
    IonContent,
    IonIcon,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    /* Component properties */
    const activeRouteName = computed(() => route.name.split('.')[1]);

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

      /* Icons */
      statsChartOutline,
      personOutline,
      peopleOutline,
      homeOutline,
      settingsOutline,
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