<template>
  <ion-page>
    <ion-content>
      <swiper
          ref="slides"
          v-update-swiper
      >
        <swiper-slide>
          <div class="relative">
            <RegistrationSuccess/>
            <OnboardingButton @next-slide="slideNext"/>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="relative">
            <SearchingExample/>
            <OnboardingButton @next-slide="slideNext"/>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="relative">
            <PlacePreviewExample/>
            <OnboardingButton @next-slide="slideNext"/>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="relative">
            <ActivatingNotificationExample/>
            <OnboardingButton @next-slide="$router.replace({ name: 'home' })"/>
          </div>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>


<script>
import { defineComponent, ref } from 'vue';

import {
  IonPage,
  IonContent,
} from '@ionic/vue';

import OnboardingButton              from '@/components/onboarding/OnboardingButton';
import RegistrationSuccess           from '@/components/onboarding/RegistrationSuccess';
import SearchingExample              from '@/components/onboarding/SearchingExample';
import PlacePreviewExample           from '@/components/onboarding/PlacePreviewExample';
import ActivatingNotificationExample from '@/components/onboarding/ActivatingNotificationExample';
import { Swiper, SwiperSlide }       from 'swiper/vue';


export default defineComponent({
  name: 'Onboarding',
  components: {
    Swiper,
    SwiperSlide,
    IonPage,
    IonContent,
    OnboardingButton,
    RegistrationSuccess,
    SearchingExample,
    PlacePreviewExample,
    ActivatingNotificationExample,
  },
  setup() {
    /* Component references */
    const slides = ref(null);

    /* Component properties */
    /* Event handlers */
    const slideNext = async() => {
      const swiper = await slides?.value?.$el.swiper;
      await swiper.slideNext();
    };

    return {
      /* Component references */
      slides,

      /* Component properties */

      /* Event handlers */
      slideNext,
    };
  },
})
;
</script>