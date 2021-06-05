<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent } from 'vue';

import { IonApp, IonRouterOutlet } from '@ionic/vue';

import store                       from '@/store';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  mounted() {
    store.dispatch("auth/getAuthUser");
  },
});
</script>