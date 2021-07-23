<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

import { IonApp, IonRouterOutlet } from '@ionic/vue';

import store              from '@/store';
import { useStorage }     from '@/services/StorageService';
import { useI18n }        from 'vue-i18n';
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
    const { locale } = useI18n({ useScope: 'global' });
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();


    /* Lifecycle hooks */
    onMounted(async() => {
      await store.dispatch("auth/getAuthUser");

      await checkForLocationPermission();
      await tryGettingLocation();

      get(`isDarkModeOn.${store.getters['auth/authUser'].id}`)
          .then((response) => {
            document.body.classList.toggle('dark', !!response);
          })
          .catch(() => {
            document.body.classList.toggle('dark', false);
          });
      get(`localization.${store.getters['auth/authUser'].id}`)
          .then((response) => {
            locale.value = response.value ?? 'sr';
          })
          .catch(() => {
            locale.value = 'sr';
          });
    });

    return {};
  },
});
</script>