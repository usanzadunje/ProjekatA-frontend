<template>
  <ion-page>
    <ion-tabs id="tabs" @ionTabsDidChange="clearRedirectQuery">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon
              :icon="carSportOutline"
          ></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon
              :icon="carSportOutline"
          ></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="dashboard" href="/dashboard">
          <ion-icon
              :icon="carSportOutline"
          ></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings">
          <ion-icon
              :icon="carSportOutline"
          ></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent }     from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonIcon,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
}                              from '@ionic/vue';

import { carSportOutline, homeOutline, personOutline, searchOutline, settingsOutline } from 'ionicons/icons';


export default defineComponent({
  name: 'StaffLayout',
  components: {
    IonIcon,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();

    /* Event handlers */
    const clearRedirectQuery = () => {
      if(route.query.redirect) {
        router.replace();
      }
    };

    return {
      /* Event handlers */
      clearRedirectQuery,

      /* Icons from */
      homeOutline,
      searchOutline,
      personOutline,
      settingsOutline,
      carSportOutline,
    };
  },
});
</script>
<style scoped>
</style>