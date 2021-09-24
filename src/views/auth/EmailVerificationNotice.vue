<!--TEST TEMPLATE-->
<!-- View shown when users has not verified their email address or want to resend it-->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Verify Your Email Address</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <form @submit.prevent="sendVerificationEmail">
        <button type="submit" class="text-red-300">
          click here to request another one.
        </button>
        .
      </form>
      <ion-button color="warning" routerLink="/">Home</ion-button>
    </ion-content>
  </ion-page>
</template>


<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import AuthService                                                         from '@/services/AuthService';

export default {
  name: 'EmailVerificationNotice',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
  },
  data() {
    return {
      message: null,
      error: null,
    };
  },
  methods: {
    sendVerificationEmail() {
      this.error = null;
      this.message = null;

      AuthService.resendVerificationEmail()
                 .then(() => (console.log("A fresh verification link has been sent to your email address.")))
                 .catch((error) => console.log(error));
    },
  },
};
</script>
