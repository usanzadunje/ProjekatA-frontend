<template>
  <swiper
      v-if="images?.length > 0"
      ref="swiperRef"
      :id="id"
      :zoom="true"
      :navigation="true"
      v-update-swiper
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
      class="w-full h-full flex flex-col items-center justify-center"
      :class="this.$store.getters['auth/isOwner'] ? 'pt-8' : ''"
  >
    <img
        :src="`${backendStorageURL}/screens/no_images_placeholder.svg`"
        alt="Placeholder image of images"
    >
    <div class="flex flex-col items-center mt-6 px-4 safe-pb">
      <p class="text-center placeholder-heading-big text-white">
        {{ $t('noImagesAvailableHeading1') }}
      </p>
      <p
          v-if="!this.$store.getters['auth/isOwner']"
          class="text-center placeholder-heading-small text-white break-words"
      >
        {{ $t('noImagesAvailableHeading2') }}
      </p>
      <div
          v-else
          class="text-center placeholder-heading-small text-white break-words"
      >
        <p
            class="text-center placeholder-heading-small text-white break-words"
        >
          {{ $t('owner.noImagesAvailableHeading2') }}
        </p>
        <ion-button
            class="blue-button-background mt-2"
            @click="$emit('addImages')"
        >
          {{ $t('add') }}
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUpdated, ref } from 'vue';
import { IonButton }                                  from '@ionic/vue';
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
    IonButton,
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
  emits: ['mounted', 'updated', 'addImages'],
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