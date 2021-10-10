<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        :class="{ 'text-yellow-600' : activeRouteName === 'dashboard' }"
        @click="navigateTo('staff.dashboard')"
    >
      <ion-icon slot="start" :icon="statsChartOutline"></ion-icon>
      <span class="text-sm ml-3">{{ $t('staff.dashboard') }}</span>
    </div>

    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         :class="{ 'text-green-600' : activeRouteName === 'place' }"
         @click="navigateTo('owner.place')">
      <ion-icon slot="start" :icon="homeOutline"></ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.place') }}</span>
    </div>

    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         :class="{ 'text-blue-600' : activeRouteName === 'staff' }"
         @click="navigateTo('owner.staff')"
    >
      <ion-icon slot="start" :icon="peopleOutline"></ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.staff') }}</span>
    </div>

    <div
        :class="{ 'text-purple-700' : activeRouteName === 'settings' }"
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('staff.settings')"
    >
      <ion-icon slot="start" :icon="personOutline"></ion-icon>
      <span class="text-sm ml-3">{{ $t('profile') }}</span>
    </div>

    <div
        class="flex justify-between items-center h-12 text-black w-full px-3 bg-gray-200"
        v-if="this.$store.getters['auth/isStaff']"
    >
      <div class="flex items-center">
        <ion-icon slot="start" :icon="isStaffActive ? checkmarkOutline : closeOutline" class="text-black"></ion-icon>
        <span class="text-sm ml-3">{{ isStaffActive ? $t('active') : $t('inactive') }}</span>
      </div>
      <ion-toggle
          class="pl-0"
          :checked="isStaffActive"
          @click="toggleActivity($event)"
          mode="md"
      ></ion-toggle>
    </div>

    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300 border-t border-gray-300"
        @click="logout"
    >
      <ion-icon slot="start" :icon="logOutOutline" class="text-black"></ion-icon>
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
  IonToggle,
  popoverController,
}                                    from '@ionic/vue';

import {
  statsChartOutline,
  personOutline,
  peopleOutline,
  homeOutline,
  checkmarkOutline,
  closeOutline,
  logOutOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'SettingsPopover',
  components: {
    IonContent,
    IonIcon,
    IonToggle,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    /* Component properties */
    const isStaffActive = computed(() => store.getters['staff/active']);
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
    const toggleActivity = async(e) => {
      if(e.target.checked) {
        await store.dispatch('staff/toggleActivity', false);
      }else {
        await store.dispatch('staff/toggleActivity', true);
      }
    };

    return {
      /* Component properties */
      isStaffActive,
      activeRouteName,

      /* Event handlers */
      logout,
      navigateTo,
      toggleActivity,

      /* Icons */
      statsChartOutline,
      personOutline,
      peopleOutline,
      homeOutline,
      checkmarkOutline,
      closeOutline,
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