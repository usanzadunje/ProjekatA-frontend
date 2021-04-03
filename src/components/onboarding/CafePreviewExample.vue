<template>
  <div class="relative">
    <img
        src="@/assets/img/onboarding/cafe-preview-example.png"
        alt="Showing how preview of cafe looks in application"
    />
    <ion-button
        color="primary"
        @click="$emit('nextSlide')"
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