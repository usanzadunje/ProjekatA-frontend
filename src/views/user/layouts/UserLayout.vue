<template>
  <ion-page>
    <ion-tabs ref="tabs">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home" @click="selectHome">
          <ion-icon :icon="homeSelected ? homeOutlineSelected : homeOutline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search" @click="selectSearch">
          <ion-icon :icon="searchSelected ? searchOutlineSelected : searchOutline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="dashboard" href="/dashboard" @click="selectDashboard">
          <ion-icon :icon="dashboardSelected ? dashboardOutlineSelected : dashboardOutline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings" @click="selectSettings">
          <ion-icon :icon="settingsSelected ? settingsOutlineSelected : settingsOutline"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
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
  setup() {
    /* Component properties */
    let homeSelected = ref(true);
    let searchSelected = ref(false);
    let dashboardSelected = ref(false);
    let settingsSelected = ref(false);

    /* Component event listener methods */
    const selectHome = () => {
      homeSelected.value = true;
      searchSelected.value = false;
      dashboardSelected.value = false;
      settingsSelected.value = false;
    }
    const selectSearch = () => {
      searchSelected.value = true;
      homeSelected.value = false;
      dashboardSelected.value = false;
      settingsSelected.value = false;
    }
    const selectDashboard = () => {
      dashboardSelected.value = true;
      homeSelected.value = false;
      searchSelected.value = false;
      settingsSelected.value = false;
    }
    const selectSettings = () => {
      settingsSelected.value = true;
      homeSelected.value = false;
      searchSelected.value = false;
      dashboardSelected.value = false;
    }


    return {
      /* Properties */
      homeSelected,
      searchSelected,
      dashboardSelected,
      settingsSelected,

      /* Event listener methods */
      selectHome,
      selectSearch,
      selectDashboard,
      selectSettings,

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