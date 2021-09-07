<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="staff-container">
        <h1 class="secondary-heading text-center uppercase">{{ $t('owner.place') }}</h1>

        <EditPlaceForm class="mt-10"/>
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

import EditPlaceForm from '@/components/owner/EditPlaceForm';

export default defineComponent({
  name: "Dashboard",
  components: {
    IonPage,
    IonContent,
    EditPlaceForm,
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