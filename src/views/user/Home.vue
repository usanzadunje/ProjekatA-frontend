<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Projekat A</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="!loggedIn">
        <ion-button color="primary" href="/login">Login</ion-button>
        <ion-button color="primary" routerLink="/register">Register</ion-button>
      </div>
      <ion-button color="secondary" @click="logout" v-else>Logout</ion-button>
      <ion-button color="warning" routerLink="/dashboard">Dashboard</ion-button>
      <ion-button color="warning" routerLink="/cafes">Cafes</ion-button>
      <ion-button color="warning" routerLink="/testEmailVerification">testEmailVerification</ion-button>
      <ion-button color="warning" routerLink="/user/edit">Edit Profile</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButton } from '@ionic/vue';
import { mapGetters }                                                      from 'vuex';

export default {
  name: "Home",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButton,
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>