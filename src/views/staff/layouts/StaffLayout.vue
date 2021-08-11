<template>
  <ion-page>
    <ion-router-outlet/>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonRouterOutlet,
}                          from '@ionic/vue';


export default defineComponent({
  name: 'StaffLayout',
  components: {
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    /* Global properties */

    /* Event handlers */


    return {
      /* Event handlers */

      /* Icons from */

    };
  },
});
</script>
<style scoped>
</style>