<template>
  <div class="background-white cafe-card-border-radius">
    <div class="p-4 flex justify-start items-center">
      <img
          :src="`${backendStorageURL}${place.images[0]?.path ?? '/places/default_place_logo.png'}`"
          alt="Logo"
          class="cafe-card-image"
      >
      <div class="ml-3.5 flex flex-col items-start">
        <h2 class="cafe-card-name">{{ place.name }}</h2>
        <p class="cafe-card-fade-text">Kafic, hrana, basta ...</p>
      </div>
    </div>
    <hr class="card-horizontal-ruler">
    <div class="flex justify-between items-center px-3 pt-3 pb-2.5">
      <div class="flex">
        <div class="flex">
          <ion-icon :icon="pieChart" class="text-yellow-400"></ion-icon>
          <span class="cafe-card-fade-text ml-1">{{ place.availability_ratio }}</span>
        </div>
        <div class="flex ml-2">
          <ion-icon :icon="locationOutline" class="primary-icon-color"></ion-icon>
          <span class="cafe-card-fade-text ml-1">{{ distance }}m</span>
        </div>
      </div>
      <div class="primary-icon-color">
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
}                                    from '@ionic/vue';

import CafeService from '@/services/CafeService';

import {
  locationOutline,
  pieChart,
  fastFoodOutline,
  leafOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'CafeCard',
  components: {
    IonIcon,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    /* Component properties */
    const distance = computed(() => Math.round(CafeService.getDistance(props.place.latitude, props.place.longitude)));

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