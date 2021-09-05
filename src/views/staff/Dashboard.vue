<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <h1 class="text-center uppercase main-heading mt-10">{{ availabilityRatio }}</h1>

      <AvailabilityToggleButtons/>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonPage,
  IonContent,
}                                    from '@ionic/vue';

import AvailabilityToggleButtons from '@/components/staff/AvailabilityToggleButtons';

export default defineComponent({
  name: "Dashboard",
  components: {
    IonPage,
    IonContent,
    AvailabilityToggleButtons,
  },
  setup() {
    /* Component properties */
    const store = useStore();

    /* Composables */

    /* Computed properties */
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);


    return {
      /* Computed properties */
      availabilityRatio,

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