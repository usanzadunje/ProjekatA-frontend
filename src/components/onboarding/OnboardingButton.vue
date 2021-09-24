<template>
  <div class="absolute left-8 bottom-8 w-5/6">
    <ion-button
        size="large"
        expand="block"
        class="auth-button-size auth-button-border-radius uppercase button-text-white"
        @click="$emit('nextSlide');"
    >
      <div class="w-full flex flex-row justify-between">
        <div class="mt-1">{{ $t('continue') }}</div>
        <ion-icon :icon="arrowForward"></ion-icon>
      </div>
    </ion-button>
  </div>
</template>

<script>
import { defineComponent }    from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';

import { arrowForward } from 'ionicons/icons';

export default defineComponent({
  name: 'OnboardingButton',
  components: {
    IonButton,
    IonIcon,
  },
  emits: ['nextSlide'],
  setup() {

    return {
      /* Icons */
      arrowForward,
    };
  },
});
</script>
<style scoped>
ion-icon {
  font-size: 1.375rem;
}
</style>