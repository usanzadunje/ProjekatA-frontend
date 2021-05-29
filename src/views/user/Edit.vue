<!--test template-->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Edit</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <EditForm />
    </ion-content>
  </ion-page>
</template>

<script>
import EditForm                                             from "@/components/EditForm";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default {
  name: "Edit",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    EditForm
  },
};
</script>