<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
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
import { mapGetters, useStore } from 'vuex';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
}                               from '@ionic/vue';

export default defineComponent({
  name: 'Home',
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