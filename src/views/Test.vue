<template>
  <div>
    <h1>Longitude : {{ coordinates.latitude }}</h1>
    <h1>Longitude : {{ coordinates.longitude }}</h1>
  </div>
</template>
<script>
// Import Swiper Vue.js components
import { useGeolocation } from '@/composables/useGeolocation';

import { reactive, ref } from 'vue';
import { getError }      from '@/utils/helpers';


export default {
  setup() {
    const { getCurrentPosition } = useGeolocation();

    let coordinates = reactive({});

    let errors = ref({});


    getCurrentPosition()
        .then((position) => {
          coordinates.latitude = position.latitude;
          coordinates.longitude = position.longitude;
        })
        .catch((error) => {
          errors.value = getError(error);
          console.log(errors.value);
        });

    return {
      coordinates,
    };
  },
};
</script>