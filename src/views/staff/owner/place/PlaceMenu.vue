<template>
  <ion-page>
    <ion-content :fullscreen="true" scrollY="false">
      <div class="px-4">
        <h1>PLACE menu</h1>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonContent, onIonViewWillLeave,
}                          from '@ionic/vue';

export default defineComponent({
  name: "PlaceMenu",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
    /* Component properties */

    /* Lifecycle hooks */
    onIonViewWillLeave(() => {
    });

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