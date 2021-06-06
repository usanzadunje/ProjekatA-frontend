<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events="true" @ionScroll="pullAnimation($event)">
      <div class="relative">
        <h1>Longitude : {{ coordinates.latitude }}</h1>
        <h1>Longitude : {{ coordinates.longitude }}</h1>
        <button @click="get" class="bg-red-400 border text-xl mt-6 absolute right-1/2">click me</button>
      </div>

      <div v-for="i in 60" :key="i">
        <h1>dsadasdsad</h1>
      </div>
      <div>
        sad
      </div>

    </ion-content>
  </ion-page>
</template>
<script>
// Import Swiper Vue.js components
import { useGeolocation }        from '@/composables/useGeolocation';
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


    const get = () => {
      getCurrentPosition()
          .then((position) => {
            coordinates.latitude = position.latitude;
            coordinates.longitude = position.longitude;
          })
          .catch((e) => {
            alert(e);
          });
    };


    const pullAnimation = (e) => {
      console.log(e.detail.currentY);
      if(e.detail.currentY === 0) {
        alert('You current to head');
      }else {
        alert('You current to not head');
      }
    };

    return {
      coordinates,
      pullAnimation,
      get,
    };
  },
};
</script>