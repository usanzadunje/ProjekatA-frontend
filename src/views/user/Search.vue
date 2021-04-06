<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="!loggedIn">
        <ion-button color="primary" routerLink="/login">Login</ion-button>
        <ion-button color="primary" routerLink="/register">Register</ion-button>
      </div>
      <ion-button color="secondary" @click="logout" v-else>Logout</ion-button>
      <ion-button color="warning" routerLink="/cafes">Cafes</ion-button>
      <ion-button color="warning" routerLink="/testEmailVerification">testEmailVerification</ion-button>
      <ion-button color="warning" routerLink="/test">Test</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }      from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
}                               from '@ionic/vue';
import { mapGetters, useStore } from 'vuex';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  setup() {
    /* Global properties and methods */
    const store = useStore();

    /* Component methods */
    const logout = () => store.dispatch('auth/logout');

    return {
      logout,
    };
  },
});
</script>