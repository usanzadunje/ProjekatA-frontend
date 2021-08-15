<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events="true">
      <h1>TEST</h1>
      <!--      <SwiperTest></SwiperTest>-->
    </ion-content>
  </ion-page>
</template>
<script>

import { onMounted, ref } from 'vue';

import { IonContent, IonPage } from '@ionic/vue';

// import SwiperTest from '@/components/user/SwiperTest';


export default {
  components: {
    IonContent,
    IonPage,
    // SwiperTest,
  },
  setup() {
    const result = ref(0);


    onMounted(async() => {

    });

    return {
      result,
    };
  },
};
</script>
<style scoped>

</style>