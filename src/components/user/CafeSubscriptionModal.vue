<template>
  <ion-content class="ion-padding">
    <ion-item class="mt-3">
      <h1 class="submodal-heading">Notifikacije</h1>
    </ion-item>
    <ion-item>
      <p class="submodal-paragraph">
        Obavesti me ukoliko se oslobodi sto u objektu
        <span class="submodal-paragraph-meidum">{{ cafeName }}</span>
        u narednih :
      </p>
    </ion-item>
    <ion-item class="ion-no-padding mt-4">
      <ion-toggle
          class="pl-4"
          checked
      ></ion-toggle>
      <ion-label class="margin-left-1 submodal-fade-text">Neodredjeno</ion-label>
    </ion-item>
    <ion-item class="ion-no-padding">
      <ion-range
          min="5"
          max="60"
          step="5"
          color="primary"
          v-model="alertTime"
      ></ion-range>
      <ion-label class="ml-1 margin-left-1 submodal-alert-time">{{ alertTime }}min</ion-label>
    </ion-item>
    <div class="mt-2 mb-3 flex justify-between">
      <ion-button
          class="uppercase button-cancel modal-button-border"
          @click="$emit('dismissSubscriptionModal')"
      >
        Otkazi
      </ion-button>
      <ion-button class="uppercase button-confirm modal-button-border">
        <ion-icon slot="start" :icon="notificationsOutlineWhite"></ion-icon>
        Potvrdi
      </ion-button>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
}                               from '@ionic/vue';
import {
  notificationsOutlineWhite,
  notificationsReceivedOutline,
}                               from '@/assets/icons';

export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
    IonToggle,
    IonRange,
  },
  props: {
    cafeName: {
      type: String,
      default: '',
    },
  },
  emits: ['dismissSubscriptionModal'],
  setup() {
    /* Properties */
    let alertTime = ref(15);

    /* Event Handlers */


    return {
      /* Properties */
      alertTime,

      /* Event handlers */

      /* Icons */
      notificationsOutlineWhite,
      notificationsReceivedOutline,

    };
  },
});
</script>
<style scoped>
ion-toggle {
  --background: #C1C9D2;
  --background-checked: #1B6DE0;
  --handle-height: 13px;
  --handle-width: 13px;
  --handle-spacing: 3px;
  --handle-background-checked: #FFF;
  height: 19px;
}

ion-range {
  --bar-background: #F6F7FB;
  --bar-background-active: #1B6DE0;
  --knob-background: #1B6DE0;
  --bar-height: 6px;
  --knob-size: 21px;
}
</style>