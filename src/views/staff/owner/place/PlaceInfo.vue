<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="px-4">
        <EditPlaceForm :reset-inputs="resetInputs"/>
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

import EditPlaceForm from '@/components/owner/forms/EditPlaceForm';

export default defineComponent({
  name: "PlaceInfo",
  components: {
    IonPage,
    IonContent,
    EditPlaceForm,
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