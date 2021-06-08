<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events="true">
      <GoogleMap
          :disableUI="false"
          :zoom="12"
          mapType="roadmap"
          :center="{ lat: 38.8977859, lng: -77.0057621 }">
      </GoogleMap>
<!--      <div class="relative">-->
<!--        <h1>Longitude : {{ coordinates.latitude }}</h1>-->
<!--        <h1>Longitude : {{ coordinates.longitude }}</h1>-->
<!--        <button @click="get" class="bg-red-400 border text-xl mt-6 absolute right-1/2">click me</button>-->
<!--      </div>-->

<!--      <div v-for="i in 60" :key="i">-->
<!--        <h1>dsadasdsad</h1>-->
<!--      </div>-->
<!--      <div>-->
<!--        sad-->
<!--      </div>-->

    </ion-content>
  </ion-page>
</template>
<script>
// Import Swiper Vue.js components
// import { useGeolocation }        from '@/composables/useGeolocation';
// import { useToastNotifications } from '@/composables/useToastNotifications';

// import { reactive } from 'vue';

import { IonContent, IonPage } from '@ionic/vue';

import GoogleMap from '@/components/user/GoogleMap';

// import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native'


export default {
  components: {
    IonContent,
    IonPage,
    GoogleMap,
  },
  // mounted() {
  //   let content = document.querySelector('ion-content');
  //   console.log(content);
  // },
  setup() {
    const initializeGoogleMap = {
      streetViewControl: true,
      scaleControl: true,
      center: { lat: 34.04924594193164, lng: 34.04924594193164 },
      zoom: 2,
    };
    // const { getCurrentPosition } = useGeolocation();
    //
    // const { showSuccessToast } = useToastNotifications();
    //
    // showSuccessToast('You settings su sacuvane sada!');
    //
    // let coordinates = reactive({});
    //
    //
    // const get = () => {
    //   getCurrentPosition()
    //       .then((position) => {
    //         coordinates.latitude = position.latitude;
    //         coordinates.longitude = position.longitude;
    //       })
    //       .catch((e) => {
    //         alert(e);
    //       });
    // };
    //

    const pullAnimation = (e) => {
      console.log(e.detail.currentY);
      if(e.detail.currentY === 0) {
        alert('You current to head');
      }else {
        alert('You current to not head');
      }
    };

    return {
      initializeGoogleMap,
      // coordinates,
      pullAnimation,
      // get,
    };
  },
};
</script>
<style scoped>
#map {
  margin: 2em 1em;
  height: 250px;
  border: 1px solid black;
}
</style>