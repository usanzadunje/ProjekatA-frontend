<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ion-refresher pull-min="60" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            :pulling-text="$t('refresherPulling')"
            refreshing-spinner="crescent"
            :refreshing-text="$t('refresherText')"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="staff-container">
        <h1 class="text-center uppercase secondary-heading">{{ $t('currently') }} {{ $t('in') }} {{ place?.name }}</h1>

        <h1 class="text-center uppercase main-heading mt-10">{{ availabilityRatio }}</h1>

        <AvailabilityToggleButtons/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
}                   from '@ionic/vue';

import AvailabilityToggleButtons from '@/components/staff/AvailabilityToggleButtons';

import { usePlaceManipulation }  from '@/composables/usePlaceManipulation';


export default {
  name: "Availability",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    AvailabilityToggleButtons,
  },
  setup() {
    /* Component properties */
    const store = useStore();

    /* Computed properties */
    const place = computed(() => store.getters['staff/place']);
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);

    /* Composables */
    const { getPlaceAvailability } = usePlaceManipulation();

    /* Event handlers */
    const refresh = async(event) => {
      await getPlaceAvailability();

      event.target.complete();
    };

    /* Methods */

    /* Lifecycle hooks */


    return {
      /* Component properties */
      place,
      availabilityRatio,

      /* Event handlers */
      getPlaceAvailability,
      refresh,

      /* Icons */
    };
  },

};
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>