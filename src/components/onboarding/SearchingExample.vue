<template>
  <div class="relative">
    <img
        src="@/assets/img/onboarding/searching-example.png"
        alt="Showing searching feature of application"
    />
    <div class="absolute searching-example-text-position">
      <h1 class="text-4xl onboarding-headings">Pretrazi sve slobodne kafice!</h1>
      <p class="onboarding-paragraphs mt-3.5">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
        some form, by injected humour.
      </p>
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