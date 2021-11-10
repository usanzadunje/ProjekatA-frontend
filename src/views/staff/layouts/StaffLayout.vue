<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="ion-no-padding">
        <TheStaffHeader/>
      </ion-toolbar>
    </ion-header>

    <ion-menu
        id="admin-menu"
        content-id="admin-outlet"
        :swipe-gesture="this.$route.name !== 'owner.place.tables'"
    >
      <TheStaffSideMenu class="pb-2 pl-2 pr-4 mt-4"/>
    </ion-menu>

    <ion-content>
      <ion-router-outlet id="admin-outlet">
      </ion-router-outlet>
    </ion-content>

  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore }        from 'vuex';
import {
  IonPage,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonMenu,
  IonContent,
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
    IonToolbar,
    IonMenu,
    IonContent,
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
            await store.dispatch('owner/getTables');

            if(store.getters['auth/isOwner']) {
              await getCachedOrFetchPlaceInfo();
              await store.dispatch('owner/getActiveStaffInfo');
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
ion-menu::part(container) {
  --max-width: 14rem !important;
  background: #F3F4F6 !important;
  border-bottom-right-radius: 0.875rem !important;
  border-top-right-radius: 0.875rem !important;
  box-shadow: none;
}

ion-header {
  background-color: var(--show-paint) !important;
}

ion-toolbar {
  background: #F3F4F6 !important;
  --background: #F3F4F6 !important;
  /*border-bottom-left-radius: unset !important;*/
  /*border-bottom-right-radius: unset !important;*/
}
</style>