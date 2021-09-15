<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrap">
        <h1 class="secondary-heading text-center uppercase">{{ $t('owner.place') }}</h1>

        <EditPlaceForm class="mt-10" :reset-inputs="resetInputs"/>
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
  name: "Dashboard",
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