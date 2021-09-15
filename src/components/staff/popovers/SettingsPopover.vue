<template>
  <ion-content class="ion-no-padding bg-red-600" :scrollY="false">
    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         @click="navigateTo('owner.place')">
      <ion-icon slot="start" :icon="homeOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.place') }}</span>
    </div>

    <div v-if="this.$store.getters['auth/isOwner']"
         class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         @click="navigateTo('owner.staff')">
      <ion-icon slot="start" :icon="peopleOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('owner.staff') }}</span>
    </div>

    <div class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         @click="navigateTo('staff.settings')">
      <ion-icon slot="start" :icon="personOutline" class="text-black"></ion-icon>
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
import { useRouter }                 from 'vue-router';
import { useStore }                  from 'vuex';
import {
  IonContent,
  IonIcon,
  popoverController,
}                                    from '@ionic/vue';

import {
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
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    const store = useStore();

    /* Component properties */
    const isStaffActive = computed(() => store.getters['staff/active']);

    /* Event handlers */
    const logout = async() => {
      await store.dispatch("auth/logout");

      await popoverController.dismiss();
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

      /* Event handlers */
      logout,
      navigateTo,
      toggleActivity,

      /* Icons */
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