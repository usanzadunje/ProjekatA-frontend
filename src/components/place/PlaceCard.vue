<template>
  <div class="background-white cafe-card-border-radius">
    <div class="p-4 flex justify-start items-center">
      <img
          :src="`${backendStorageURL + logoPath}`"
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
import { defineComponent, computed, toRefs } from 'vue';
import {
  IonIcon,
}                                            from '@ionic/vue';

import PlaceService from '@/services/PlaceService';

import {
  locationOutline,
  pieChart,
  fastFoodOutline,
  leafOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'PlaceCard',
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
    const { place } = toRefs(props);
    const distance = computed(() => Math.round(PlaceService.getDistance(place.latitude, place.longitude)));
    const logoPath = computed(() => {
      if(place.value.images?.length > 0) {
        return place.value.images.find(image => image.is_logo)?.path ??
            place.value.images[0]?.path;
      }else {
        return '/places/default_place_logo.png';
      }
    });
    /* Event handlers */

    return {
      /* Component Properties */
      distance,
      logoPath,

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