<template>
  <ion-page>
    <ion-tabs id="tabs" @ionTabsDidChange="clearRedirectQuery">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon
              :icon="homeOutline"
          ></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon
              :icon="searchOutline"
          ></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="dashboard" href="/dashboard" v-if="loggedIn">
          <ion-icon
              :icon="personOutline"
          ></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings" v-if="loggedIn">
          <ion-icon
              :icon="settingsOutline"
          ></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { mapGetters } from 'vuex';

import {
  IonIcon,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';

import {
  homeOutline,
  searchOutline,
  personOutline,
  settingsOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'UserLayout',
  components: {
    IonIcon,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();

    /* Event handlers */
    const clearRedirectQuery = () => {
      if(route.query.redirect){
        router.replace();
      }
    };

    return {
      clearRedirectQuery,

      /* Icons from */
      homeOutline,
      searchOutline,
      personOutline,
      settingsOutline,
    };
  },
});
</script>
<style scoped>
</style>