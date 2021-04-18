<template>
  <ion-content class="ion-padding">
    <ion-item>
      <h1 class="modal-cafe-name-text">{{ cafeName }}</h1>
    </ion-item>
    <ion-item>
      <p class="modal-cafe-offers">Kafic, hrana, basta...</p>
    </ion-item>
    <ion-item class="ion-item-no-padding-x">
      { check box }
    </ion-item>
    <ion-item class="ion-item-no-padding-x">
      { slider }
    </ion-item>
    <div class="mt-5 mb-5 flex justify-between">
      <ion-button
          class="uppercase button-see-more modal-button-border"
          @click="$emit('dismissSubscriptionModal')"
      >Otkazi</ion-button>
      <ion-button class="uppercase button-subscribe modal-button-border">
        <ion-icon slot="start" :icon="notificationsOutlineWhite"></ion-icon>
        Potvrdi
      </ion-button>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
}                          from '@ionic/vue';
import {
  notificationsOutlineWhite,
  notificationsReceivedOutline,
}                          from '@/assets/icons';

export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
  },
  props: {
    cafeName: {
      type: String,
      default: '',
    },
  },
  emits: ['dismissSubscriptionModal'],
  setup() {

    /* Event Handlers */


    return {
      /* Component properties */

      /* Icons */
      notificationsOutlineWhite,
      notificationsReceivedOutline,

    };
  },
});
</script>
<style scoped>
ion-item {
  --border-style: none;
}
</style>