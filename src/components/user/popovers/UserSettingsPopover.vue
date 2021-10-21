<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('edit')">
      <ion-icon slot="start" :icon="personOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('profile') }}</span>
    </div>

    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
        @click="navigateTo('settings')">
      <ion-icon slot="start" :icon="settingsOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('settings') }}</span>
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
import { defineComponent } from 'vue';
import { useRouter }       from 'vue-router';
import { useStore }        from 'vuex';
import {
  IonContent,
  IonIcon,
  popoverController,
}                          from '@ionic/vue';

import { personOutline, settingsOutline, logOutOutline } from 'ionicons/icons';

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
      await popoverController.dismiss();

      await store.dispatch("auth/logout");
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