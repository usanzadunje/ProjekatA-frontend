<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script>
import { defineComponent } from 'vue';

import { IonApp, IonRouterOutlet } from '@ionic/vue';

// import store          from '@/store';
// import { useStorage } from '@/services/StorageService';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    /* Global properties */
    // let state = reactive({ loggedInUserId: store.dispatch("auth/getAuthUser") });

    /* Methods */
    // const { get } = useStorage();


    // document.body.classList.remove('dark');
    /* Lifecycle hooks */
    // watch(
    //     () => state.loggedInUserId,
    //     (currentValue) => {
    //       console.log('loggininid: ' + state.loggedInUserId);
    //       console.log('current: ' + currentValue);
    //       if(currentValue) {
    //         get(`isDarkModeOn.${currentValue}`)
    //             .then((response) => {
    //               document.body.classList.toggle('dark', !!response);
    //             })
    //             .catch((error) => {
    //               alert(error);
    //             });
    //       }
    //     },
    // );

    return {

    };
  },
});
</script>