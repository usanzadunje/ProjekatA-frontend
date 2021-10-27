<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent }         from 'vue';
import { useStore }                from 'vuex';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

import { useFCM }           from '@/composables/useFCM';
import { useCache }         from '@/composables/useCache';
import { useErrorHandling } from '@/composables/useErrorHandling';

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
    const { getCachedOrFetchAuthUser } = useCache();
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    (async() => {
      await tryCatch(
          async() => {
            await getCachedOrFetchAuthUser();
            await store.dispatch("user/getSettings");
            await initPush();
          },
          null,
          'dataFetchingError',
      );
    })();


    return {};
  },
});
</script>