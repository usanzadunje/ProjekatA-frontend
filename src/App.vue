<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent }         from 'vue';
import { useStore }                from 'vuex';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

import { useFCM }            from '@/composables/useFCM';
import { useFetchCondition } from '@/composables/useFetchCondition';

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
    const { getAuthUser } = useFetchCondition();

    /* Lifecycle hooks */
    (async() => {
      await getAuthUser();
      await store.dispatch("user/getSettings");
      await initPush();

      store.commit("global/SET_WIDTH", window.innerWidth);
    })();


    return {};
  },
});
</script>