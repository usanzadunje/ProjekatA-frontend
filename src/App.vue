<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import store                          from '@/store';
import { IonApp, IonRouterOutlet }    from '@ionic/vue';

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

    /* Composables */
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();

    /* Lifecycle hooks */
    onMounted(async() => {
      await store.dispatch("auth/getAuthUser");

      await store.dispatch("auth/setSettings");

      await checkForLocationPermission();
      await tryGettingLocation();

    });

    return {};
  },
});
</script>