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

import CafeService  from '@/services/CafeService';
import OwnerService from '@/services/OwnerService';

import { useToastNotifications } from '@/composables/useToastNotifications';


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

    /* Lifecycle hooks */
    (async() => {
      try {
        const cafeResponse = await CafeService.show(store.getters['auth/authUser'].cafe);

        store.commit('staff/SET_PLACE_INFO', cafeResponse.data);
        store.commit('staff/SET_AVAILABILITY_RATIO', cafeResponse.data?.availability_ratio ?? '0/0');

        if(store.getters['auth/isOwner']) {
          const staffResponse = await OwnerService.allStaff();

          store.commit('owner/SET_STAFF_MEMBERS', staffResponse.data);
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