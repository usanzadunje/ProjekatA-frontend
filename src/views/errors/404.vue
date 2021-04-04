<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Error 4O4</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="max-w-lg p-5 m-auto">
        <article class="p-5">
          <h1
              class="mb-2 text-6xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-blue-500 to-green-500"
          >
            4O4
          </h1>
          <p class="font-bold">
            The page you're looking for is not here.
            <ion-button href="/">Back home</ion-button>
            .
          </p>
        </article>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }                                                 from 'vue';
import { IonButton, IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';

export default defineComponent({
  name: "404",
  components: {
    IonButton,
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
  },
});
</script>