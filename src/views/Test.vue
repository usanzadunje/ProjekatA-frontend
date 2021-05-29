<template>
  <ion-page>
    <ion-content :scroll-events="true" @ionScrollStart="pullAnimation" class="ion-padding">
      <div>
        <h1>Longitude : {{ coordinates.latitude }}</h1>
        <h1>Longitude : {{ coordinates.longitude }}</h1>
      </div>
      <div v-for="i in 60" :key="i">
        <h1>dsadasdsad</h1>
      </div>

    </ion-content>
  </ion-page>
</template>
<script>
// Import Swiper Vue.js components
import { useGeolocation } from '@/composables/useGeolocation';

import { reactive } from 'vue';

import { IonContent, IonPage } from '@ionic/vue';


export default {
  components: {
    IonContent,
    IonPage,
  },
  mounted() {
    let content = document.querySelector('ion-content');
    console.log(content);
  },
  setup() {
    const { getCurrentPosition } = useGeolocation();

    let coordinates = reactive({});


    getCurrentPosition()
        .then((position) => {
          coordinates.latitude = position.latitude;
          coordinates.longitude = position.longitude;
        })
        .catch(() => {
        });

    const pullAnimation = () => {
      alert('das');
    };

    return {
      coordinates,
      pullAnimation,
    };
  },
};
</script>