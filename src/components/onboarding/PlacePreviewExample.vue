<template>
  <div class="full-size flex items-center text-center bg">
    <div class="mt-20">
      <h1 class="text-4xl onboarding-headings">
        {{ $t('onboardingFind') }}
      </h1>
      <p class="onboarding-paragraphs mt-3.5">
        {{ $t('onboardingFindT1') }}
        <ion-icon
            :icon="starOutline"
            class="text-yellow-400"
        ></ion-icon>
        {{ $t('onboardingFindT2') }}
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { IonIcon }         from '@ionic/vue';

import { starOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'PlacePreviewExample',
  components: {
    IonIcon,
  },
  setup() {
    return {
      starOutline,
    };
  },
});
</script>
<style scoped>
div.bg {
  background: url('https://resize.rs/storage/img/onboarding/cafe-preview-example.png') no-repeat center;
  background-size: cover;
}
</style>