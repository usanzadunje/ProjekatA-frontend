<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Cafes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-for="cafe in state.cafes" :key="cafe.id">
        {{ cafe.name }}
        <ion-button size="small" color="primary" @click="subscribe(cafe.id)">Subscribe</ion-button>
      </div>
      <ion-button color="warning" routerLink="/">Home</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButton } from '@ionic/vue';
import CafeService                                                         from '../services/CafeService';
import { reactive }                                                        from 'vue';
import { useFCM }                                                          from '@/composables/useFCM';

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButton,
  },
  setup() {
    const state = reactive({ cafes: [] });

    /* Method for initializing push notifications for mobile devices */
    const { initPush } = useFCM();
    initPush();

    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const subscribe = (cafeId) => {
      let cafeName = state.cafes.filter(cafe => cafe.id === cafeId)[0].name;
      CafeService.subscribe(cafeId).then(() => alert(`Successfully subscribed to ${cafeName}!`)).catch((error) => alert(error));
    };

    /* Fetching all cafes from backend */
    CafeService.index().then((response) => state.cafes = response.data);

    return {
      state,
      initPush,
      subscribe,
    };
  },

};
</script>