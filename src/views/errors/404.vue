<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="max-w-lg m-auto vcenter">
        <article class="p-5 text-center">
          <h1
              class="mb-2 text-6xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-blue-500 to-green-500"
          >
            4O4
          </h1>
          <p class="font-bold">
            The page you're looking for is not here.
          </p>
          <ion-button fill="clear" routerLink="/" class="m-auto">
            <p class="main-toolbar-fade-text uppercase">HOME</p>
          </ion-button>
        </article>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';

import { IonButton, IonPage, IonContent } from '@ionic/vue';

export default defineComponent({
  name: "404",
  components: {
    IonButton,
    IonPage,
    IonContent,
  },
});
</script>