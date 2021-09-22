<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <StaffHeader/>
    </ion-header>

    <AdminMenu/>

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

import StaffHeader from '@/components/staff/StaffHeader';
import AdminMenu   from '@/components/staff/AdminMenu';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useFCM }                from '@/composables/useFCM';

import { Capacitor }             from '@capacitor/core';


export default defineComponent({
  name: 'StaffLayout',
  components: {
    IonPage,
    IonRouterOutlet,
    IonHeader,
    StaffHeader,
    AdminMenu,
  },
  setup() {
    /* Global properties */
    const store = useStore();
    /* Component properties */

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { registerToken } = useFCM();

    /* Lifecycle hooks */
    (async() => {
      try {
        await store.dispatch('staff/getPlaceInfo');

        if(store.getters['auth/isOwner']) {
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