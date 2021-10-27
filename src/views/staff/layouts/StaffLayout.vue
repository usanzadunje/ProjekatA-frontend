<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <TheStaffHeader/>
    </ion-header>

    <TheStaffSideMenu/>

    <ion-router-outlet id="admin-outlet" class="mt-12">

    </ion-router-outlet>

  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore }        from 'vuex';
import {
  IonPage,
  IonRouterOutlet,
  IonHeader,
}                          from '@ionic/vue';

import TheStaffHeader   from '@/components/staff/TheStaffHeader';
import TheStaffSideMenu from '@/components/staff/TheStaffSideMenu';

import { useFCM }           from '@/composables/useFCM';
import { useCache }         from '@/composables/useCache';
import { useErrorHandling } from '@/composables/useErrorHandling';

import { Capacitor } from '@capacitor/core';


export default defineComponent({
  name: 'StaffLayout',
  components: {
    IonPage,
    IonRouterOutlet,
    IonHeader,
    TheStaffHeader,
    TheStaffSideMenu,
  },
  setup() {
    /* Global properties */
    const store = useStore();
    /* Component properties */

    /* Composables */
    const { registerToken } = useFCM();
    const { getCachedOrFetchPlaceInfo } = useCache();
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    (async() => {
      await tryCatch(
          async() => {
            if(store.getters['auth/isOwner']) {
              await getCachedOrFetchPlaceInfo();
              await store.dispatch('owner/getStaffInfo');
            }
            if(Capacitor.isNativePlatform()) {
              await registerToken();
            }
          },
          null,
          'dataFetchingError',
      );
    })();


    /* Event handlers */

    return {
      /* Component properties */

      /* Event handlers */

      /* Icons from */

    };
  },
});
</script>
<style scoped>

</style>