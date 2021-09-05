<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import store                          from '@/store';
import { IonApp, IonRouterOutlet }    from '@ionic/vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    /* Global properties */
    /* Methods */


    /* Lifecycle hooks */
    onMounted(async() => {
      await store.dispatch("auth/getAuthUser");
      await store.dispatch("auth/getToken");
      await store.dispatch("user/getSettings");
    });

    return {};
  },
});
</script>