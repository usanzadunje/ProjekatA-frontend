<template>
  <div class="background-white cafe-card-border-radius">
    <div class="p-4 flex ion-align-items-center">
      <img
          :src="`${backendStorageURL}/cafe/1_2cafe.png`"
          alt=""
          class="cafe-card-image"
      >
      <div class="ml-3.5">
        <h2 class="cafe-card-name">{{ cafe.name }}</h2>
        <p class="cafe-card-fade-text">Kafic, hrana, basta ...</p>
      </div>
    </div>
    <hr class="card-horizontal-ruler">
    <div class="px-3 pt-3 pb-2.5 flex justify-between">
      <div class="flex">
        <div class="flex">
          <ion-icon :icon="pieChart" class="text-yellow-400"></ion-icon>
          <span class="cafe-card-fade-text ml-1">{{ cafe.taken_capacity }}</span>
        </div>
        <div class="flex ml-2">
          <ion-icon :icon="locationOutline" class="primary-icon-color"></ion-icon>
          <span class="cafe-card-fade-text ml-1">{{ distance }}m</span>
        </div>
      </div>
      <div class="flex primary-icon-color">
        <ion-icon :icon="fastFoodOutline"></ion-icon>
        <ion-icon :icon="leafOutline" class="ml-1"></ion-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

import {
  IonIcon,
} from '@ionic/vue';

import {
  locationOutline,
  pieChart,
  fastFoodOutline,
  leafOutline,
}                  from 'ionicons/icons';
import CafeService from '@/services/CafeService';

export default defineComponent({
  name: 'CafeCard',
  components: {
    IonIcon,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    /* Component properties */
    const distance = computed(() => Math.round(CafeService.getDistance(props.cafe.latitude, props.cafe.longitude)));

    /* Event handlers */


    return {
      /* Component Properties */
      distance,

      /* Event listeners */

      /* Icons from */
      locationOutline,
      pieChart,
      fastFoodOutline,
      leafOutline,
    };
  },
});
</script>
<style scoped>
ion-icon {
  font-size: 17px !important;
}
</style>