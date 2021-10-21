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
import { useI18n }         from 'vue-i18n';
import {
  IonPage,
  IonRouterOutlet,
  IonHeader,
}                          from '@ionic/vue';

import TheStaffHeader from '@/components/staff/TheStaffHeader';
import TheStaffSideMenu   from '@/components/staff/TheStaffSideMenu';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useFCM }                from '@/composables/useFCM';
import { useCache }     from '@/composables/useCache';

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
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { registerToken } = useFCM();
    const { getCachedOrFetchPlaceInfo } = useCache();

    /* Lifecycle hooks */
    (async() => {
      try {
        if(store.getters['auth/isOwner']) {
          await getCachedOrFetchPlaceInfo();
          await store.dispatch('owner/getStaffInfo');
        }
        if(Capacitor.isNativePlatform()) {
          await registerToken();
        }
      }catch(e) {
        showErrorToast(
            null,
            {
              toggleAvailabilityError: t('dataFetchingError'),
            });
      }
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