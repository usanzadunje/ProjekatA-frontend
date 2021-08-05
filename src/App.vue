<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import store                          from '@/store';
import { IonApp, IonRouterOutlet }    from '@ionic/vue';
import { useI18n }                    from 'vue-i18n';

import { useStorage } from '@/services/StorageService';

import { useGeolocation } from '@/composables/useGeolocation';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    /* Global properties */
    /* Methods */
    const { get } = useStorage();

    /* Composables */
    const { locale } = useI18n({ useScope: 'global' });
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();

    /* Lifecycle hooks */
    onMounted(async() => {
      await store.dispatch("auth/getAuthUser");

      await checkForLocationPermission();
      await tryGettingLocation();

      try {
        const storedDarkMode = await get(`isDarkModeOn.${store.getters['auth/authUser'].id}`);
        document.body.classList.toggle('dark', !!storedDarkMode);

        const storedLocale = await get(`localization.${store.getters['auth/authUser'].id}`);
        locale.value = storedLocale.value ?? 'sr';

      }catch(error) {
        document.body.classList.toggle('dark', false);
        locale.value = 'sr';

      }
    });

    return {};
  },
});
</script>