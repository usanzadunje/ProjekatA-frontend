<template>
  <ion-app class="relative">
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent } from 'vue';

import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>