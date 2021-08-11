<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      STAFF PAGE
      <button @click="$router.push({ name : 'staff.tables' })">CLICK ME TO GO</button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from '@ionic/vue';

export default {
  name: "Home",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
    return {};
  },

};
</script>