<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events="true">
      <SwiperTest></SwiperTest>
    </ion-content>
  </ion-page>
</template>
<script>

import { onMounted, ref } from 'vue';

import { IonContent, IonPage } from '@ionic/vue';

import { useGeolocation } from '@/composables/useGeolocation';

import SwiperTest from '@/components/user/SwiperTest';


export default {
  components: {
    IonContent,
    IonPage,
    SwiperTest,
  },
  setup() {
    const result = ref(0);

    const { getCurrentPosition, watchCurrentPosition } = useGeolocation();


    onMounted(async() => {
      const { latitude, longitude } = await getCurrentPosition();
      const res = await watchCurrentPosition();

      console.log(res);

      const R = 6371e3; // metres
      const f1 = latitude * Math.PI / 180; // φ, λ in radians
      const f2 = 43.31359341007279 * Math.PI / 180;
      const df = (43.31359341007279 - latitude) * Math.PI / 180;
      const dl = (21.904751882198724 - longitude) * Math.PI / 180;

      const a = Math.sin(df / 2) * Math.sin(df / 2) +
          Math.cos(f1) * Math.cos(f2) *
          Math.sin(dl / 2) * Math.sin(dl / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      result.value = R * c;
    });


    return {
      result,
    };
  },
};
</script>
<style scoped>

</style>