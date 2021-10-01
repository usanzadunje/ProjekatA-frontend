<template>
  <ion-page>
    <ion-content>
      <h1 class="secondary-heading text-center">Pick a table and drag</h1>

      <div class="flex items-center justify-center mt-5 ml-5">
        <Table :absolute="false"/>
        <span class="ml-2 secondary-heading">-drop me where you want</span>
      </div>

      <div class="px-4 h-3/4 flex flex-col justify-center">
        <div id="dropzone" class="relative border-2 border-black h-44">
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonContent,
}                          from '@ionic/vue';

import Table from '@/components/staff/Table';

export default defineComponent({
  name: "PlaceTables",
  components: {
    IonPage,
    IonContent,
    Table,
  },
  setup() {
    // Listen for table component event and add new tables to array
    // send this array to backend and save values in DB
    // Position saved to DB needs to be +2 because of border
    // +2 is border width. Depending how it will be shown correct value needs to be added
    /* Component properties */

    /* Lifecycle hooks */


    return {
      /* Component properties */

      /* Event handlers */
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>