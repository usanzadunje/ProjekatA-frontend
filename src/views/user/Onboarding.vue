<template>
  <ion-page>
    <ion-content>
      <ion-slides :options="slideOpts" ref="slides">
        <ion-slide>
          <RegistrationSuccess @nextSlide="slideNext"/>
        </ion-slide>
        <ion-slide>
          <SearchingExample @nextSlide="slideNext"/>
        </ion-slide>
        <ion-slide>
          <CafePreviewExample @nextSlide="slideNext"/>
        </ion-slide>
        <ion-slide>
          <ActivatingNotificationExample/>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>


<script>
import { defineComponent, ref }                     from 'vue';
import { IonPage, IonContent, IonSlides, IonSlide } from '@ionic/vue';
import RegistrationSuccess                          from '@/components/onboarding/RegistrationSuccess';
import SearchingExample                             from '@/components/onboarding/SearchingExample';
import CafePreviewExample                           from '@/components/onboarding/CafePreviewExample';
import ActivatingNotificationExample                from '@/components/onboarding/ActivatingNotificationExample';

export default defineComponent({
  components: {
    IonSlides,
    IonSlide,
    IonPage,
    IonContent,
    RegistrationSuccess,
    SearchingExample,
    CafePreviewExample,
    ActivatingNotificationExample,
  },
  setup() {
    // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
    const slides = ref(null);
    const slideOpts = {
      initialSlide: 1,
      speed: 400,
    };

    const slideNext = async() => {
      const swiper = await slides?.value?.$el.getSwiper();
      await swiper.slideNext();
    };

    return {
      slides,
      slideOpts,
      slideNext,
    };
  },
})
;
</script>