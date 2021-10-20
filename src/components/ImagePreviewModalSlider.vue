<template>
  <swiper
      :id="id"
      ref="swiperRef"
      :zoom="true"
      :navigation="true"
      v-update-swiper
      v-if="images?.length > 0"
  >
    <swiper-slide
        v-for="image in images"
        :key="image.id"
        :zoom="true"
    >
      <img
          :src="`${backendStorageURL + image.path}`"
          alt="Image of place"
      >
    </swiper-slide>
  </swiper>
  <div
      v-else
      class="h-full flex items-center justify-center text-white"
  >
    {{ $t('noImages') }}
  </div>
</template>

<script>
import { defineComponent, onMounted, onUpdated, ref } from 'vue';
import { Swiper, SwiperSlide }                        from 'swiper/vue';
// Installing Swiper modules
import SwiperCore, {
  Zoom, Navigation,
}                                                     from 'swiper';

SwiperCore.use([Zoom, Navigation]);

export default defineComponent({
  name: 'ImagePreviewModalSlider',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    images: {
      type: Object,
      default: null,
    },
  },
  emits: ['mounted', 'updated'],
  setup(props, { emit }) {
    /* Component properties */
    const swiperRef = ref(null);

    /* Lifecycle hooks */
    onMounted(() => {
      emit('mounted');
    });
    onUpdated(() => {
      emit('updated');
    });
    return {
      /* Component properties */
      swiperRef,

      /* Event handlers */

      /* Icons */
    };
  },
});
</script>
<style scoped>
.swiper-container {
  height: 100%;
}

.swiper-slide {
  height: 100%;
}
</style>