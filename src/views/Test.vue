<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex justify-center items-center h-full">
        <ion-icon
            :icon="icons['heart']"
            class="text-red-500 text-6xl"
        ></ion-icon>

        <ion-icon
            :icon="star"
            class="text-yellow-500 text-6xl"
        ></ion-icon>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>

import { onMounted, ref } from 'vue';

import {
  IonContent,
  IonPage,
  IonIcon,
} from '@ionic/vue';

import * as icons from 'ionicons/icons';

export default {
  components: {
    IonContent,
    IonPage,
    IonIcon,
  },
  setup() {
    let star = ref();

    onMounted(async() => {
      star.value = icons['heart'];
    });


    return {
      star,
      icons,
    };
  },
};
</script>
<style scoped>

</style>