<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

import { IonApp, IonRouterOutlet } from '@ionic/vue';

import store          from '@/store';
import { useStorage } from '@/services/StorageService';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    /* Global properties */

    /* Methods */
    const { get } = useStorage();

    /* Lifecycle hooks */
    onMounted(() => {
      get(`isDarkModeOn.${store.getters['auth/authUser'].id}`)
                  .then((response) => {
                    document.body.classList.toggle('dark', !!response);
                  })
                  .catch(() => {
                    document.body.classList.toggle('dark', false);
                  });
    })

    return {

    };
  },
});
</script>