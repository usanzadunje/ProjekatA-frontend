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
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300 border-t border-black"
        @click="logout"
    >
      <ion-icon slot="start" :icon="logOutOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('logout') }}</span>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter }       from 'vue-router';
import { useStore }        from 'vuex';
import {
  IonContent,
  IonIcon,
  popoverController,
}                          from '@ionic/vue';

import {
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
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    const store = useStore();


    /* Event handlers */
    const logout = async() => {
      await store.dispatch("auth/logout");

      await popoverController.dismiss();
    };

    const navigateTo = async(pageName) => {
      await router.push({ name: pageName });

      await popoverController.dismiss();
    };

    return {
      /* Event handlers */
      logout,
      navigateTo,

      /* Icons */
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