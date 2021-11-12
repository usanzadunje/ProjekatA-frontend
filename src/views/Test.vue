<template>
  <ion-page>
    <ion-content>
      <button @click="this.$router.push({name:'settings'})">BACK</button>
      <NotFoundImage/>
    </ion-content>
  </ion-page>
</template>
<script>

import {
  IonContent,
  IonPage,
}                    from '@ionic/vue';
import NotFoundImage from '@/components/images/NotFoundImage';

export default {
  components: {
    IonContent,
    IonPage,
    NotFoundImage,
  },
  setup() {


    return {};
  },
};
</script>
<style scoped>

</style>