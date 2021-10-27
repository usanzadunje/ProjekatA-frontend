<template>
  <ion-page>
    <ion-tabs id="tabs" @ionTabsDidChange="clearRedirectQuery">
      <ion-router-outlet></ion-router-outlet>
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
import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter }        from 'vue-router';
import { mapGetters, useStore }       from 'vuex';
import {
  IonIcon,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonRouterOutlet,
}                                     from '@ionic/vue';

import { useGeolocation } from '@/composables/useGeolocation';

import {
  homeOutline,
  searchOutline,
  personOutline,
  settingsOutline,
}                           from 'ionicons/icons';
import { useErrorHandling } from '@/composables/useErrorHandling';

export default defineComponent({
  name: 'UserLayout',
  components: {
    IonIcon,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonRouterOutlet,
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    /* Composables */
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    onMounted(async() => {
      if(store.getters['permission/location'] === null) {
        await checkForLocationPermission();
        await tryGettingLocation();
      }

      await tryCatch(
          async() => {
            if(store.getters['auth/loggedIn']) {
              store.dispatch("user/getSubscriptions");
            }
          },
          null,
          'dataFetchingError',
      );
    });

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
    };
  },
});
</script>
<style scoped>
</style>