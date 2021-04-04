<template>
  <ion-page>
    <ion-tabs @ionTabsWillChange="beforeTabChange" @ionTabsDidChange="afterTabChange">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="homeOutline"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search">
          <ion-icon :icon="searchOutline"></ion-icon>
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="dashboard" href="/dashboard">
          <ion-icon :icon="personOutline"></ion-icon>
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings">
          <ion-icon :icon="settingsOutline"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent }                                            from 'vue';
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
}                                                                     from '@ionic/vue';
import { homeOutline, searchOutline, personOutline, settingsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'UserLayout',
  components: {
    IonIcon,
    IonLabel,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
  },
  setup() {
    const beforeTabChange = () => {
      // do something before tab change
    };
    const afterTabChange = () => {
      // do something after tab change
    };
    return {
      homeOutline,
      searchOutline,
      personOutline,
      settingsOutline,
      beforeTabChange,
      afterTabChange,
    };
  },
});
</script>