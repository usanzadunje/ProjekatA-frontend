<template>
  <div>
    <h1>Longitude : {{ coordinates.latitude }}</h1>
    <h1>Longitude : {{ coordinates.longitude }}</h1>
  </div>
</template>
<script>
// Import Swiper Vue.js components
import { useGeolocation } from '@/composables/useGeolocation';

import { reactive } from 'vue';


export default {
  setup() {
    const { getCurrentPosition } = useGeolocation();

    let coordinates = reactive({});

    getCurrentPosition()
        .then((position) => {
          coordinates.latitude = position.latitude;
          coordinates.longitude = position.longitude;
        })
        .catch((error) => {
          alert(error);
        });

    return {
      coordinates,
    };
  },
};
</script>