<template>
  <div class="bg-white cafe-card-border-radius">
    <div class="p-5 flex justify-start ion-align-items-center">
      <img
          src="../../assets/img/cafe/test.png"
          alt=""
          class="cafe-card-image">
      <div class="ml-3.5">
        <h2 class="cafe-card-name">{{ cafe.name }}</h2>
        <p class="cafe-card-fade-text">Kafic, hrana, basta ...</p>
      </div>
    </div>
    <hr class="card-horizontal-ruler">
    <div class="p-3 flex justify-between ion-align-items-center">
      <div class="flex align-middle">
        <div class="flex align-bottom">
          <ion-icon :icon="graphSliceYellowOutline"></ion-icon>
          <span class="cafe-card-fade-text ml-1 mt-0.5">{{ cafe.taken_capacity }}</span>
        </div>
        <div class="flex align-bottom ml-2">
          <ion-icon :icon="locationInactiveOutline"></ion-icon>
          <span class="cafe-card-fade-text ml-1 mt-0.5">600m</span>
        </div>
      </div>
      <div>
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
}                          from '@ionic/vue';
import {
  locationInactiveOutline,
  graphSliceYellowOutline,
  fastFoodOutline,
  leafOutline,
}                          from '@/assets/icons';

export default defineComponent({
  name: 'SlidingFilter',
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
    /* Properties */

    /* Event handlers */


    return {
      /* Properties */

      /* Event listeners */

      /* Icons */
      locationInactiveOutline,
      graphSliceYellowOutline,
      fastFoodOutline,
      leafOutline,
    };
  },
});
</script>
<style scoped>

</style>