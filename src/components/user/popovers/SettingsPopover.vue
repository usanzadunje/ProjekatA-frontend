<template>
  <ion-content class="ion-no-padding bg-red-600" :scrollY="false">
    <div class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         @click="navigateTo('edit')">
      <ion-icon slot="start" :icon="personOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('profile') }}</span>
    </div>

    <div class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300"
         @click="navigateTo('settings')">
      <ion-icon slot="start" :icon="settingsOutline" class="text-black"></ion-icon>
      <span class="text-sm ml-3">{{ $t('settings') }}</span>
    </div>

    <div
        class="h-12 text-black w-full flex justify-start items-center px-3 bg-gray-200 hover:bg-gray-300 border-t border-black"
        @click="logout"
    >
      <span class="text-sm ml-3">Logout</span>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter }       from 'vue-router';
import { useStore }        from 'vuex';
import { useI18n }         from 'vue-i18n';
import {
  IonContent,
  IonIcon,
  loadingController,
  popoverController,
}                          from '@ionic/vue';

import { personOutline, settingsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'Popover',
  components: {
    IonContent,
    IonIcon,
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n({ useScope: 'global' });


    /* Event handlers */
    const logout = async() => {
      const loading = await loadingController
          .create({
            spinner: 'crescent',
            cssClass: 'custom-loading',
            message: t('loggingOut'),
            mode: 'ios',
          });
      await loading.present();
      await store.dispatch("auth/logout");
      await loading.dismiss();

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
      settingsOutline,
    };
  },
});
</script>
<style scoped>
ion-icon {
  font-size: 1.4em;
}
</style>