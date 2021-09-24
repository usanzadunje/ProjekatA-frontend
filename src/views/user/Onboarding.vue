<template>
  <ion-page>
    <ion-content>
      <ion-slides :options="slideOpts" ref="slides">
        <ion-slide>
          <div class="relative">
            <RegistrationSuccess/>
            <OnboardingButton @next-slide="slideNext"/>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="relative">
            <SearchingExample/>
            <OnboardingButton @next-slide="slideNext"/>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="relative">
            <CafePreviewExample/>
            <OnboardingButton @next-slide="slideNext"/>
          </div>
        </ion-slide>
        <ion-slide>
          <div class="relative">
            <ActivatingNotificationExample/>
            <OnboardingButton @next-slide="$router.replace({ name: 'home' })"/>
          </div>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>


<script>
import { defineComponent, ref } from 'vue';

import {
  IonPage,
  IonContent,
  IonSlides,
  IonSlide,
} from '@ionic/vue';

import OnboardingButton              from '@/components/onboarding/OnboardingButton';
import RegistrationSuccess           from '@/components/onboarding/RegistrationSuccess';
import SearchingExample              from '@/components/onboarding/SearchingExample';
import CafePreviewExample            from '@/components/onboarding/CafePreviewExample';
import ActivatingNotificationExample from '@/components/onboarding/ActivatingNotificationExample';

export default defineComponent({
  name: 'Onboarding',
  components: {
    IonSlides,
    IonSlide,
    IonPage,
    IonContent,
    OnboardingButton,
    RegistrationSuccess,
    SearchingExample,
    CafePreviewExample,
    ActivatingNotificationExample,
  },
  setup() {
    /* Component references */
    const slides = ref(null);

    /* Component properties */
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
    };

    /* Event handlers */
    const slideNext = async() => {
      const swiper = await slides?.value?.$el.getSwiper();
      await swiper.slideNext();
    };

    return {
      /* Component references */
      slides,

      /* Component properties */
      slideOpts,

      /* Event handlers */
      slideNext,
    };
  },
})
;
</script>