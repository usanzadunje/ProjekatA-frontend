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
        <ion-button size="small" type="button" color="secondary" @click="unsubscribe(cafe.id)">Subscribe
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButton } from '@ionic/vue';
import CafeService                                                         from '../services/CafeService';


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
      this.$Echo.private(`cafes.${ cafeId }`)
          .listen('.CafeTableFreed', () => {
            console.log('SUCCESS');
            this.$Echo.leave(`cafes.${ cafeId }`);
          });
    },
    unsubscribe(cafeId){
      this.$Echo.leave(`cafes.${ cafeId }`);
      console.log('UNSUB');
    }
  },
  created() {
    CafeService.index().then((response) => this.cafes = response.data);
  },
};
</script>