<template>
  <ion-slides
      ref="imagePreviewSlider"
      :id="id"
      v-update-swiper
      :options="slideOpts"
      v-if="images.length > 0"
  >
    <ion-slide v-for="image in images" :key="image.id">
      <img
          :src="`${backendStorageURL + image.path}`"
          alt="Image of place"
          @dblclick="zoom(userClickedToZoom)"
      >
    </ion-slide>
  </ion-slides>
  <div
      v-else
      class="h-4/5 flex items-center justify-center text-white"
  >
    {{ $t('noImages') }}
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import {
  IonSlides,
  IonSlide,
}                                          from '@ionic/vue';

export default defineComponent({
  name: 'ImagePreviewModalSlider',
  components: {
    IonSlides,
    IonSlide,
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
  emits: ['mounted'],
  setup(props, { emit }) {
    /* Component properties */
    const imagePreviewSlider = ref(null);
    const slideOpts = {
      zoom: {
        maxRatio: 2,
      },
    };
    const userClickedToZoom = ref(true);

    /* Event handlers */
    const zoom = async(zoomIn) => {
      let swiper = await imagePreviewSlider?.value?.$el.getSwiper();
      if(zoomIn) {
        swiper.zoom.in();
      }else {
        swiper.zoom.out();
      }
      userClickedToZoom.value = !userClickedToZoom.value;
    };

    /* Lifecycle hooks */
    onMounted(() => {
      emit('mounted');
    });

    return {
      /* Component properties */
      imagePreviewSlider,
      slideOpts,
      userClickedToZoom,

      /* Event handlers */
      zoom,

      /* Icons */
    };
  },
});
</script>
<style scoped>
ion-slides {
  height: 80%;
}
</style>