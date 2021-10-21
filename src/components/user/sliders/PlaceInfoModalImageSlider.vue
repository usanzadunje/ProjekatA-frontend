<template>
  <div v-if="!showSkeleton">
    <swiper
        v-if="images?.length !== 0"
        :slides-per-view="2.5"
        :space-between="10"
    >
      <swiper-slide
          v-for="image in images"
          :key="image?.id"
      >
        <img
            :src="`${backendStorageURL + image?.path}`"
            alt="Image of place"
            class="object-cover slider-images"
            @click="openPreview(images)"
        >
      </swiper-slide>
    </swiper>
  </div>
  <div
      v-if="showSkeleton !== null"
      v-show="showSkeleton"
      class="flex"
  >
    <ion-skeleton-text
        animated
        class="slider-images h-20"
    ></ion-skeleton-text>
    <ion-skeleton-text
        animated
        class="slider-images h-20 ml-2"
    ></ion-skeleton-text>
    <ion-skeleton-text
        animated
        class="half-skeleton h-20 w-1/2 ml-2"
    ></ion-skeleton-text>
  </div>
</template>

<script>
import { defineComponent }     from 'vue';
import {

  IonSkeletonText,
  modalController,
}                              from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';

import ImagePreviewModal from '@/components/user/modals/ImagePreviewModal';

export default defineComponent({
  name: 'PlaceInfoModalImageSlider',
  components: {
    Swiper,
    SwiperSlide,
    IonSkeletonText,
  },
  props: {
    images: {
      type: Object,
      default: null,
    },
    showSkeleton: {
      type: Boolean,
      default: null,
    },
  },
  setup() {
    /* Component properties */
    /* Event handlers */
    const openPreview = async(images) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-image-preview-modal',
            componentProps: {
              images,
            },
          });
      return modal.present();
    };

    return {
      /* Component properties */
      /* Event listeners */
      openPreview,

      /* Icons */
    };
  },
});
</script>
<style scoped>
.slider-images {
  max-height: 75px !important;
  border-radius: 14px;
}

.half-skeleton {
  max-height: 75px !important;
  border-radius: 14px 0 0 14px;
}
</style>