<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <LoginForm @loginError="displayErrors"/>
      <FlashMessage :error="error"/>
    </ion-content>
  </ion-page>
</template>

<script>
import LoginForm                                                from "@/components/LoginForm";
import FlashMessage                                             from "@/components/FlashMessage";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default {
  name: "Login",
  components: {
    LoginForm,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FlashMessage,
  },
  data() {
    return {
      error: null,
    };
  },
  methods: {
    displayErrors(payload) {
      this.error = payload.error;
    },
  },
};
</script>