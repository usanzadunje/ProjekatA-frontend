<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useStore }                   from 'vuex';
import { IonApp, IonRouterOutlet }    from '@ionic/vue';

import { useFCM } from '@/composables/useFCM';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    /* Global properties */
    const store = useStore();
    /* Methods */

    /* Composables */
    const { initPush } = useFCM();

    /* Lifecycle hooks */
    onMounted(async() => {
      await store.dispatch("auth/getAuthUser");
      await store.dispatch("auth/getToken");
      await store.dispatch("user/getSettings");
      await initPush();
    });

    return {};
  },
});
</script>