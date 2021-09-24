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
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonContent, onIonViewWillLeave,
}                               from '@ionic/vue';

export default defineComponent({
  name: "PlaceMenu",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
    /* Component properties */
    const resetInputs = ref(false);

    /* Lifecycle hooks */
    onIonViewWillLeave(() => {
      resetInputs.value = true;
    });

    return {
      /* Component properties */
      resetInputs,

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