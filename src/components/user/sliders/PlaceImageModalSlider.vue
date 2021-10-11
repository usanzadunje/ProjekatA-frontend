<template>
  <div>
    <ion-slides v-if="!showSkeleton" v-update-swiper :options="slideOpts">
      <ion-slide
          v-for="image in images"
          :key="image?.id"
      >
        <img
            :src="`${backendStorageURL + image?.path}`"
            alt="Image of place"
            @click="openPreview(images)"
            class="object-cover slider-images"
        >
      </ion-slide>
    </ion-slides>
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
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonSlides,
  IonSlide,
  IonSkeletonText,
  modalController,
}                          from '@ionic/vue';

import ImagePreviewModal from '@/components/user/modals/ImagePreviewModal';

export default defineComponent({
  name: 'PlaceImageModalSlider',
  components: {
    IonSlides,
    IonSlide,
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
    const slideOpts = {
      slidesPerView: 2.5,
      spaceBetween: 10,
    };

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
      slideOpts,

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