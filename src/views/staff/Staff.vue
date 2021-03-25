<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>STAFF</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-router-outlet/>

  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonRouterOutlet } from '@ionic/vue';


export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRouterOutlet,
  },

};
</script>