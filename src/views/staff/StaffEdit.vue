<template>
  <ion-page>
    <ion-content>
      <div class="wrap h-full">
        <EditForm :clear-inputs="clearInputs"/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonContent,
  onIonViewWillEnter,
  onIonViewWillLeave,
}                               from '@ionic/vue';

import EditForm from '@/components/auth/EditForm';

export default defineComponent({
  name: "StaffEdit",
  components: {
    IonPage,
    IonContent,
    EditForm,
  },
  setup() {
    /* Component properties */
    const clearInputs = ref(false);

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      clearInputs.value = false;

    });
    onIonViewWillLeave(() => {
      clearInputs.value = true;
    });

    return {
      /* Component properties */
      clearInputs,

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