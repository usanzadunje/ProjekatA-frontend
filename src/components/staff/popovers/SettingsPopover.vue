<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        :class="{ 'text-yellow-600' : activeRouteName === 'dashboard' }"
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
         :class="{ 'text-green-600' : activeRouteName === 'place' }"
         @click="navigateTo('owner.place')">
      <ion-icon
          :icon="homeOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.place') }}</span>
    </div>

    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         :class="{ 'text-blue-600' : activeRouteName === 'staff' }"
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
        :class="{ 'text-purple-700' : activeRouteName === 'settings' }"
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('staff.settings')"
    >
      <ion-icon
          :icon="personOutline"
          class="flex-shrink-0"
      >
      </ion-icon>
      <span class="text-sm ml-3">{{ $t('profile') }}</span>
    </div>

    <StaffActivityToggle
        v-if="this.$store.getters['auth/isStaff']"
        :icon-classes="'icon-popover-size'"
        :text-classes="'text-sm ml-3'"
        class="h-12 text-black w-full px-3 bg-gray-200"
    />
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

import StaffActivityToggle from '@/components/staff/StaffActivityToggle';

import {
  statsChartOutline,
  personOutline,
  peopleOutline,
  homeOutline,
  logOutOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'SettingsPopover',
  components: {
    IonContent,
    IonIcon,
    StaffActivityToggle,
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