<template>
  <ion-content class="ion-padding">
    <ion-item>
      <ion-thumbnail slot="start">
        <img
            src="../../assets/img/cafe/test.png"
            alt="Logo of {{ cafe.name }}"
            class="modal-thumbnail"
        >
      </ion-thumbnail>
      <div>
        <h1>{{ cafe.name }}</h1>
        <p>Kafic, hrana, basta...</p>
      </div>
    </ion-item>
    <ion-item>
      <ion-icon :icon="graphSliceYellowFilled" class="mr-2"></ion-icon>
      {{ cafe.taken_capacity }} - slobodnih mesta
    </ion-item>
    <ion-item>
      <ion-item class="ion-item-no-padding-x">
        <ion-icon :icon="locationInactiveOutline" class="mr-2"></ion-icon>
        <p>{{ cafe.address }} - {{ cafe.city }}</p>
      </ion-item>
      <ion-button fill="clear" class="uppercase" slot="end">MAPA</ion-button>
    </ion-item>
    <ion-item>
      <ion-item class="ion-item-no-padding-x">
        <ion-icon :icon="locationInactiveOutline" class="mr-2"></ion-icon>
        <p class="text-xs">poseduje bastu</p>
      </ion-item>
      <ion-item class="ion-item-no-padding-x">
        <ion-icon :icon="locationInactiveOutline" class="mr-2"></ion-icon>
        <p>poseduje bastu</p>
      </ion-item>
      <ion-item class="ion-item-no-padding-x">
        <ion-icon :icon="locationInactiveOutline" class="mr-2"></ion-icon>
        <p>09am-01pm</p>
      </ion-item>
    </ion-item>
    <ion-item class="mt-2">
      <img src="../../assets/img/cafe/test.png" alt="" class="img-border-15 img-modal-gallery mr-2.5">
      <img src="../../assets/img/cafe/test.png" alt="" class="img-border-15 img-modal-gallery mr-2.5">
      <img src="../../assets/img/cafe/test.png" alt="" class="img-border-15 img-modal-gallery mr-2.5">
      <img src="../../assets/img/cafe/test.png" alt="" class="img-border-15 img-modal-gallery mr-2.5">
      <img src="../../assets/img/cafe/test.png" alt="" class="img-border-15 img-modal-gallery mr-2.5">
    </ion-item>
    <div class="mt-3 mb-5 flex justify-around">
      <ion-button class="uppercase button-see-more modal-button-border"> Pogledaj vise</ion-button>
      <ion-button class="uppercase button-subscribe modal-button-border">
        <ion-icon slot="start" :icon="notificationsOutlineWhite"></ion-icon>
        Pretplati se
      </ion-button>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonThumbnail,
  IonItem,
  IonIcon,
  IonButton,
}                          from '@ionic/vue';
import {
  graphSliceYellowFilled,
  locationInactiveOutline,
  notificationsOutlineWhite,
}                          from '@/assets/icons';

export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonContent,
    IonThumbnail,
    IonItem,
    IonIcon,
    IonButton,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissModal'],
  setup() {


    return {
      /* Icons */
      graphSliceYellowFilled,
      locationInactiveOutline,
      notificationsOutlineWhite,
    };
  },
});
</script>
<style scoped>
ion-item {
  --border-style: none;
}
</style>