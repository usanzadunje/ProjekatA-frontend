<template>
  <div class="relative">
    <img
        src="@/assets/img/onboarding/notification-example.png"
        alt="Showing how to turn notifications on"
    />
    <ion-button
        color="primary"
        routerLink="/dashboard"
        size="large"
        class="auth-button-border-radius uppercase absolute left-8 bottom-8 w-5/6"
    >
      NASTAVI DALJE
      <ion-icon slot="end" :icon="arrowForward"></ion-icon>
    </ion-button>
  </div>
</template>

<script>
import { IonButton, IonIcon } from '@ionic/vue';
import { arrowForward }       from 'ionicons/icons';

export default {
  components: {
    IonButton,
    IonIcon,
  },
  data() {
    return {
      arrowForward,
    };
  },
};
</script>