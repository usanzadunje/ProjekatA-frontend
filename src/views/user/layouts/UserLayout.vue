<template>
  <ion-page>
    <ion-tabs @ionTabsDidChange="tabChanged">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="selectedTab === 'home' ? homeOutlineSelected : homeOutline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon :icon="selectedTab === 'search' ? searchOutlineSelected : searchOutline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="dashboard" href="/dashboard" v-if="loggedIn">
          <ion-icon :icon="selectedTab === 'dashboard' ? dashboardOutlineSelected : dashboardOutline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings" v-if="loggedIn">
          <ion-icon :icon="selectedTab === 'settings' ? settingsOutlineSelected : settingsOutline"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { mapGetters } from 'vuex';

import {
  IonIcon,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
}                               from '@ionic/vue';
import {
  homeOutline,
  searchOutline,
  dashboardOutline,
  settingsOutline,
  homeOutlineSelected,
  searchOutlineSelected,
  dashboardOutlineSelected,
  settingsOutlineSelected,
}                               from '@/assets/icons';

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
    /* Component properties */
    let selectedTab = ref('home');

    /* Component event listener methods */
    const tabChanged = (event) => selectedTab.value = event.tab;


    return {
      /* Properties */
      selectedTab,

      /* Event listener methods */
      tabChanged,

      /* Icons */
      homeOutline,
      searchOutline,
      dashboardOutline,
      settingsOutline,
      homeOutlineSelected,
      searchOutlineSelected,
      dashboardOutlineSelected,
      settingsOutlineSelected,
    };
  },
});
</script>
<style scoped>
</style>