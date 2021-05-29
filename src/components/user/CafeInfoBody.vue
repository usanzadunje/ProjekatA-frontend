<template>
  <ion-item class="ion-item-no-padding-x">
    <ion-icon :icon="pieChart" class="mr-2 text-yellow-400"></ion-icon>
    <span class="modal-cafe-text-medium mt-0.5">{{ cafe.taken_capacity }} - slobodnih mesta</span>
  </ion-item>
  <ion-item class="ion-item-no-padding-x">
    <div class="flex justify-between">
      <ion-icon :icon="locationOutline" class="mr-2"></ion-icon>
      <p class="modal-cafe-text-regular">{{ cafe.address }} - {{ cafe.city }}</p>
    </div>
    <ion-button fill="clear" class="uppercase" slot="end">MAPA</ion-button>
  </ion-item>
  <div class="flex justify-start mt-1.5">
    <div class="ion-item-no-padding-x flex">
      <ion-icon :icon="fastFoodOutline" class="mr-2"></ion-icon>
      <p class="modal-cafe-text-regular">hrana</p>
    </div>
    <div class="ion-item-no-padding-x flex ml-3.5">
      <ion-icon :icon="leafOutline" class="mr-2"></ion-icon>
      <p class="modal-cafe-text-regular">poseduje bastu</p>
    </div>
    <div class="ion-item-no-padding-x flex ml-3.5">
      <ion-icon :icon="timeOutline" class="mr-2"></ion-icon>
      <p class="modal-cafe-text-regular">09am-01pm</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import {
  IonIcon,
  IonButton,
  IonItem,
} from '@ionic/vue';

import {
  pieChart,
  locationOutline,
  leafOutline,
  fastFoodOutline,
  timeOutline,

}
  from 'ionicons/icons';

export default defineComponent({
  name: "CafeInfoBody",
  components: {
    IonIcon,
    IonButton,
    IonItem,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  setup() {


    return {
      /* Component properties */

      /* Icons from */
      pieChart,
      locationOutline,
      fastFoodOutline,
      leafOutline,
      timeOutline,
    };
  },

});
</script>
<style scoped>
ion-item {
  --border-style: none;
}
</style>