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
        <h1 class="text-center uppercase secondary-heading">Current availability situation in your place</h1>

        <div
            :class="`
          flex ${ isOwner ? 'flex-col-reverse' : 'flex-col' } md:flex-row
          justify-start md:justify-around
          `"
        >
          <AvailabilityToggleButtons class="md:self-center md:w-1/2"/>

          <PlaceAvailabilityChart/>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
}                                    from '@ionic/vue';

import AvailabilityToggleButtons from '@/components/staff/AvailabilityToggleButtons';
import PlaceAvailabilityChart    from '@/components/staff/charts/PlaceAvailabilityChart';
import { usePlaceManipulation }  from '@/composables/usePlaceManipulation';

export default defineComponent({
  name: "Dashboard",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    PlaceAvailabilityChart,
    AvailabilityToggleButtons,
  },
  setup() {
    /* Component properties */
    const store = useStore();

    /* Composables */
    const { getPlaceAvailability } = usePlaceManipulation();


    /* Computed properties */
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);
    const isOwner = computed(() => store.getters['auth/isOwner']);

    /* Event handlers */
    const refresh = async(event) => {
      await getPlaceAvailability();

      event.target.complete();
    };

    /* Methods */


    return {
      /* Computed properties */
      availabilityRatio,
      isOwner,

      /* Event handlers */
      refresh,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>