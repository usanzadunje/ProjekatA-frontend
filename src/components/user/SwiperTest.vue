<!--Swiper test template-->
<template>
  <!--  <swiper-->
  <!--      :slides-per-view="3"-->
  <!--      :space-between="50"-->
  <!--      @swiper="onSwiper"-->
  <!--      @slideChange="onSlideChange"-->
  <!--  >-->
  <!--    <swiper-slide>Slide 1</swiper-slide>-->
  <!--    <swiper-slide>Slide 2</swiper-slide>-->
  <!--    <swiper-slide>Slide 3</swiper-slide>-->
  <!--  </swiper>-->

  <div>
    <ion-slides :options="opts">
      <ion-slide v-for="i in [1,2,3,4]" :key="i">
        <ion-button fill="clear">Slide{{ i }}</ion-button>
      </ion-slide>
    </ion-slides>
  </div>
</template>
<script>
// Import Swiper Vue.js components
// import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
// import 'swiper/swiper-bundle.min.css';


import {
  IonSlides,
  IonSlide,
  IonButton,
} from '@ionic/vue';

export default {
  components: {
    IonSlides,
    IonSlide,
    IonButton,
    // Swiper,
    // SwiperSlide,
  },
  data() {
    return {
      opts: {
        freeMode: true,
        slidesPerView: 2.8,
        spaceBetween: 10,
      },
    };
  },
  methods: {
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log('slide change');
    },
  },
};
</script>