<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <h1 class="main-heading">{{ timer }}</h1>
    </ion-content>
  </ion-page>
</template>
<script>

import { onMounted, ref, watch } from 'vue';

import { IonContent, IonPage } from '@ionic/vue';

export default {
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    let timer = ref(5);

    watch(timer, () => {
      if(timer.value > 0) {
        setTimeout(() => {
          timer.value--;
        }, 1000);
      }
      console.log('asd');
    }, {
      immediate: true,
    });

    onMounted(async() => {

    });

    return {
      timer,
    };
  },
};
</script>
<style scoped>

</style>