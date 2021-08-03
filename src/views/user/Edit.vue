<!--test template-->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Edit</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!--      <ion-item-->
      <!--          lines="none"-->
      <!--          class="border rounded-2xl h-12 auth-input-background"-->
      <!--          :class="{ 'error-border' : errorNames.hasOwnProperty('fname') }"-->
      <!--      >-->
      <!--        <ion-icon :icon="personOutline" class="mr-2 text-black"></ion-icon>-->
      <!--        <ion-input-->
      <!--            v-model.lazy="newUser.fname"-->
      <!--            autocomplete="given-name"-->
      <!--            type="text"-->
      <!--            inputmode="text"-->
      <!--            debounce="600"-->
      <!--            placeholder="Ime"-->
      <!--            autofocus required-->
      <!--        ></ion-input>-->
      <!--      </ion-item>-->
      <!--      <ion-item-->
      <!--          lines="none"-->
      <!--          class="border rounded-2xl h-12 mt-3.5 auth-input-background"-->
      <!--          :class="{ 'error-border' : errorNames.hasOwnProperty('lname') }"-->
      <!--      >-->
      <!--        <ion-icon :icon="personOutline" class="mr-2 text-black"></ion-icon>-->
      <!--        <ion-input-->
      <!--            v-model.lazy="newUser.lname"-->
      <!--            autocomplete="family-name"-->
      <!--            type="text"-->
      <!--            inputmode="text"-->
      <!--            debounce="600"-->
      <!--            placeholder="Prezime"-->
      <!--            required-->
      <!--        ></ion-input>-->
      <!--      </ion-item>-->
    </ion-content>
  </ion-page>
</template>

<script>
// import EditForm                                             from "@/components/EditForm";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue';

export default {
  name: "Edit",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    // EditForm
  },
  setup() {
    onIonViewWillEnter(() => {
      document.getElementById('tab-button-settings').style.color = '#207DFF';
    });

    onIonViewWillLeave(() => {
      document.getElementById('tab-button-settings').style.color = '';
    });
  },
};
</script>