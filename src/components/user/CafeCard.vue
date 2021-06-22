<template>
  <div class="bg-white cafe-card-border-radius">
    <div class="p-4 flex ion-align-items-center">
      <img
          :src="`${backendStorageURL}/cafe/test.png`"
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
          <ion-icon :icon="locationOutline" class="text-gray-400"></ion-icon>
          <span class="cafe-card-fade-text ml-1">600m</span>
        </div>
      </div>
      <div class="flex">
        <ion-icon :icon="fastFoodOutline"></ion-icon>
        <ion-icon :icon="leafOutline" class="ml-1"></ion-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import {
  IonIcon,
} from '@ionic/vue';

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
    cafe: {
      type: Object,
      default: null,
    },
  },
  setup() {
    /* Component properties */

    /* Event handlers */


    return {
      /* Properties */

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