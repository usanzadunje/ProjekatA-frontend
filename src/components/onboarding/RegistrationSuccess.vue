<template>
  <div class="relative background-image-container bg">
    <div class="absolute register-success-text-position">
      <h1 class="text-4xl onboarding-headings text-white">Uspesno ste se registrovali!</h1>
      <p class="onboarding-paragraphs text-white mt-3.5">Dobrodosli u Project A. Nastavi dalje kako bi video sta vam
                                                         nasa aplikacija nudi.</p>
    </div>
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
  background: url('../../assets/img/onboarding/successful-registration.png') no-repeat center fixed;
  background-size: cover;
}
</style>