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
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle } from '@ionic/vue';
import CafeService                                              from '../services/CafeService';


export default {
  name: "Table",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
  },
  data() {
    return {
      cafes: [],
    };
  },
  methods: {
    subscribe(cafeId) {
      console.log(cafeId);
    },
  },
  created() {
    CafeService.index().then((response) => this.cafes = response.data);
  },
};
</script>