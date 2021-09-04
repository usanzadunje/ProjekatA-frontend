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
import {
  IonPage,
  IonRouterOutlet,
  IonHeader,
}                          from '@ionic/vue';

import StaffHeader from '@/components/staff/StaffHeader';
import AdminMenu   from '@/components/staff/AdminMenu';

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

    /* Component properties */

    /* Composables */

    /* Lifecycle hooks */


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