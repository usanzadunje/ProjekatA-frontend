<template>
  <ion-page>
    <ion-content>
      <div class="h-full">
        <EditPlaceForm :reset-inputs="resetInputs"/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonContent,
  onIonViewWillLeave,
  onIonViewWillEnter,
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
    onIonViewWillEnter(() => {
      resetInputs.value = false;

    });
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