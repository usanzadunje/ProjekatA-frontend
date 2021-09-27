<template>
  <ion-page>
    <ion-content :fullscreen="true" scrollY="false">
      <div class="px-4">
        <h1>PLACE TABLES</h1>
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

export default defineComponent({
  name: "PlaceTables",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
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