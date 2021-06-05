<template>
  <ion-page>
    <ion-content :scroll-events="true" @ionScrollStart="pullAnimation($event)" class="ion-padding">
      <div>
        <h1>Longitude : {{ coordinates.latitude }}</h1>
        <h1>Longitude : {{ coordinates.longitude }}</h1>
      </div>
<!--      <div v-for="i in 60" :key="i">-->
<!--        <h1>dsadasdsad</h1>-->
<!--      </div>-->
<!--      <div>-->
<!--          sad-->
<!--      </div>-->

    </ion-content>
  </ion-page>
</template>
<script>
// Import Swiper Vue.js components
import { useGeolocation } from '@/composables/useGeolocation';
import { useToastNotifications } from '@/composables/useToastNotifications';

import { reactive } from 'vue';

import { IonContent, IonPage } from '@ionic/vue';


export default {
  components: {
    IonContent,
    IonPage,
  },
  // mounted() {
  //   let content = document.querySelector('ion-content');
  //   console.log(content);
  // },
  setup() {
    const { getCurrentPosition } = useGeolocation();

    const { showSuccessToast } = useToastNotifications();

    showSuccessToast('You settings su sacuvane sada!');

    let coordinates = reactive({});


    getCurrentPosition()
        .then((position) => {
          coordinates.latitude = position.latitude;
          coordinates.longitude = position.longitude;
        })
        .catch(() => {
        });

    const pullAnimation = (e) => {
      // if(e) {
      //   alert('You current scroll from Y: ', e)
      // }
      console.log(e.target.scrollTop)
    };

    return {
      coordinates,
      pullAnimation,
    };
  },
};
</script>