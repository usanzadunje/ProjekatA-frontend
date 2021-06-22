<template>
  <div class="relative background-image-container bg">
    <div class="absolute notification-example-text-position">
      <h1 class="text-4xl onboarding-headings px-6">Obavesti me kada se mesto oslobodi!</h1>
      <p class="onboarding-paragraphs mt-3.5">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
        some form, by injected humour.
      </p>
    </div>
    <div class="absolute left-8 bottom-8 w-5/6">
      <ion-button
          routerLink="/dashboard"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white"
          @click="$emit('nextSlide')"
      >
        NASTAVI DALJE
        <ion-icon slot="end" :icon="arrowForward"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent }     from 'vue';

import { IonButton, IonIcon }  from '@ionic/vue';

import { arrowForward }       from 'ionicons/icons';

export default defineComponent({
  name: 'ActivatingNotificationExample',
  components: {
    IonButton,
    IonIcon,
  },
  data() {
    return {
      /* Icons */
      arrowForward,
    };
  },
});
</script>
<style scoped>
div.bg {
  background: url('http://http://134.122.86.193/storage/img/onboarding/notification-example.png') no-repeat center fixed;
  background-size: cover;
}
</style>