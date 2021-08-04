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
        <div class="w-full flex flex-row justify-between">
          <div class="mt-1">{{ $t('continue') }}</div>
          <ion-icon :icon="arrowForward"></ion-icon>
        </div>
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
  setup() {
    return {
      /* Icons */

      arrowForward,
    };
  },
});
</script>
<style scoped>
div.bg {
  background: url('https://resize.rs/storage/img/onboarding/successful-registration.png') no-repeat center fixed;
  background-size: cover;
}

ion-icon {
  font-size: 1.375rem;
}
</style>