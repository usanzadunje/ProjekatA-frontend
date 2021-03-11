<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Cafes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-for="cafe in cafes" :key="cafe.id">
        {{ cafe.name }}
        <ion-button size="small" type="button" @click="subscribe(cafe.id)">Subscribe
        </ion-button>
        <ion-button size="small" type="button" color="secondary" @click="unsubscribe(cafe.id)">Unsubscribe
        </ion-button>
      </div>
      <ion-button color="warning" routerLink="/">Home</ion-button>
      <ion-button color="warning" @click="not">Not</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButton } from '@ionic/vue';
import CafeService                                                         from '../services/CafeService';
import LocalNotificationService                                            from '@/services/LocalNotificationService';

export default {
  name: "Table",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButton,
  },
  data() {
    return {
      cafes: [],
    };
  },
  methods: {
    subscribe(cafeId) {
      //Extracting only cafe that user subscribed to
      let cafe = this.cafes.find(cafe => cafe.id === cafeId);
      /* Subscribing to cafe(channel) and listening for table changes */
      this.$Echo.private(`cafes.${cafeId}`)
          .listen('.CafeTableFreed', () => {
            //Push notification about subscribed cafes table becoming empty again
            LocalNotificationService.sendNotification(cafe.name);
            this.$Echo.leave(`cafes.${cafeId}`);
          });
    },
    unsubscribe(cafeId) {
      /* Unsubscribing cafe(channel) - regardless what happens with cafes tables user will not be notified */
      this.$Echo.leaveChannel(`private-cafes.${cafeId}`);
    },
    not(){
      LocalNotificationService.sendNotification('dsa');
    }
  },
  created() {
    CafeService.index().then((response) => this.cafes = response.data);
  },
};
</script>