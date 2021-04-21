<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex justify-between">
          <ion-buttons slot="start">
            <ion-back-button
                :text="''"
                :icon="arrowBackwardOutline">
            </ion-back-button>
          </ion-buttons>
          <ion-buttons slot="start">
            <ion-button>
              <ion-icon slot="icon-only" :icon="notificationsOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <img
          src="../../assets/img/cafe/cafeshow.png"
          alt="Image of {{ cafe.name }} cafe"
          class="banner-image"
      />

      <ion-item class="mt-3">
        <div>
          <h1 class="modal-cafe-name-text">123</h1>
          <p class="modal-cafe-offers">Kafic, hrana, basta...</p>
        </div>
      </ion-item>
      <ion-item>
        <ion-icon :icon="graphSliceYellowFilled" class="mr-2"></ion-icon>
        <span class="modal-cafe-text-medium mt-0.5">{{ cafe.taken_capacity }} - slobodnih mesta</span>
      </ion-item>
      <ion-item class="ion-item-no-padding-x">
        <div class="flex justify-between">
          <ion-icon :icon="locationInactiveOutline" class="mr-2"></ion-icon>
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
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonIcon,
  IonButton,
  IonItem,
}                                  from '@ionic/vue';
import CafeService                 from '@/services/CafeService';
import { reactive, onBeforeMount } from 'vue';
import { useRoute }                from 'vue-router';
import {
  arrowBackwardOutline,
  notificationsOutline,
  graphSliceYellowFilled,
  locationInactiveOutline,
  notificationsOutlineWhite,
  notificationsReceivedOutline,
  fastFoodOutline,
  leafOutline,
  timeOutline,
}                                  from '@/assets/icons';

export default {
  name: "Cafe",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonIcon,
    IonButton,
    IonItem,
  },
  setup() {
    const route = useRoute();

    let state = reactive({ cafe: null });


    /* Fetching all cafes from backend */
    onBeforeMount(() => {
      CafeService.show(route.params.id)
                 .then((response) => state.cafe = response.data)
                 .catch((error) => alert(error));
    });

    return {
      /* Properties */
      cafe: state.cafe,

      /* Icons */
      arrowBackwardOutline,
      notificationsOutline,
      graphSliceYellowFilled,
      locationInactiveOutline,
      notificationsOutlineWhite,
      notificationsReceivedOutline,
      fastFoodOutline,
      leafOutline,
      timeOutline,
    };
  },

};
</script>
<style scoped>
ion-toolbar {
  --border-style: none;
  --background: transparent;
}
</style>