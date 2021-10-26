<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { defineComponent }         from 'vue';
import { useStore }                from 'vuex';
import { useI18n }                 from 'vue-i18n';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

import { useFCM }                from '@/composables/useFCM';
import { useCache }              from '@/composables/useCache';
import { useToastNotifications } from '@/composables/useToastNotifications';

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
    const { t } = useI18n();
    const { showErrorToast } = useToastNotifications();

    /* Lifecycle hooks */
    (async() => {
      try {
        await getCachedOrFetchAuthUser();
        await store.dispatch("user/getSettings");
        await initPush();

        store.commit("global/SET_WIDTH", window.innerWidth);
        store.commit("global/SET_HEIGHT", window.innerHeight);
      }catch(e) {
        showErrorToast(
            null,
            {
              dataFetchingError: t('dataFetchingError'),
            });
      }
    })();


    return {};
  },
});
</script>