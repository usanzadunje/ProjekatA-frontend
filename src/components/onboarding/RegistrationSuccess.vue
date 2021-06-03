<template>
  <div class="relative background-image-container bg">
    <div class="absolute register-success-text-position">
      <h1 class="text-4xl onboarding-headings text-white">Uspesno ste se registrovali!</h1>
      <p class="onboarding-paragraphs text-white mt-3.5">Dobrodosli u Project A. Nastavi dalje kako bi video sta vam
                                                         nasa aplikacija nudi.</p>
    </div>
    <div class="absolute left-8 bottom-8 w-5/6">
      <ion-button
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
import { defineComponent } from 'vue';

import { IonButton, IonIcon } from '@ionic/vue';

import { arrowForward } from 'ionicons/icons';

export default defineComponent({
  name: 'RegistrationSuccess',
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
  background: url('http://192.168.1.203:8200/storage/img/onboarding/successful-registration.png') no-repeat center fixed;
  background-size: cover;
}
</style>