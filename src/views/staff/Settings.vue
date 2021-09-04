<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <p class="secondary-heading">
        Informacije o sopstvenom profilu
      </p>
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
  name: "Settings",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
    /* Composables */


    return {
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