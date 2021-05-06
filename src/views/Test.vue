<template>
  <swiper
      :slides-per-view="1"
      @slideChange="onSlideChange"
  >
    <swiper-slide v-for="i in slides" :key="i">{{ i }}</swiper-slide>
  </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/swiper.min.css';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      slides: [0, 1, 2],
    };
  },
  methods: {
    onSlideChange() {
      this.slides.push(2);
      console.log('slide change');
    },
  },
};
</script>