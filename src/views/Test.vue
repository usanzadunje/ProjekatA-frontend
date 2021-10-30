<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PlaceAvailabilityChart/>
    </ion-content>
  </ion-page>
</template>
<script>

import { onMounted } from 'vue';

import {
  IonContent,
  IonPage,
} from '@ionic/vue';

import PlaceAvailabilityChart from '@/components/staff/charts/PlaceAvailabilityChart';

export default {
  components: {
    IonContent,
    IonPage,
    PlaceAvailabilityChart,
  },
  setup() {

    onMounted(async() => {
    });


    return {};
  },
};
</script>
<style scoped>

</style>