<template>
  <ion-content :fullscreen="true">
    <ion-item class="close-fake text-center" lines="none">
      <ion-button @click="dismiss" fill="clear" color="light" slot="end">
        <ion-icon :icon="close" slot="start"></ion-icon>
      </ion-button>
    </ion-item>

    <ion-slides v-update-swiper :options="slideOpts">
      <ion-slide v-for="i in imgCount" :key="i">
        <div v-if="imgCount !== 1" class="swiper-zoom-container">
          <img
              :src="`${backendStorageURL}/cafe/2_${i}cafe.png`"
              alt=""
              @dblclick="zoom(userClickedToZoom)"
          >
        </div>
        <div v-else class="swiper-zoom-container">
          <img
              :src="id"
              alt=""
              @dblclick="zoom(userClickedToZoom)"
          >
        </div>
      </ion-slide>
    </ion-slides>
  </ion-content>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  modalController,
}                         from '@ionic/vue';

import {
  close,
  add,
  remove,
} from 'ionicons/icons';

export default defineComponent({
  name: 'ImagePreviewModal',
  components: {
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
    IonSlides,
    IonSlide,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    imgCount: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    /* Component properties */
    const imagePreviewSlider = ref(null);
    const slideOpts = {
      zoom: {
        maxRatio: 2,
      },
    };
    const userClickedToZoom = ref(true);

    /* Lifecycle hooks */

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
    const dismiss = () => {
      modalController.dismiss();
    };

    return {
      /* Component properties */
      imagePreviewSlider,
      slideOpts,
      userClickedToZoom,

      /* Event handlers */
      zoom,
      dismiss,

      /* Icons */
      close,
      add,
      remove,
    };
  },
});
</script>

<style scoped>
ion-content {
  --background: rgba(44, 39, 45, 0.84);
}

ion-icon {
  font-size: 2rem;
}

ion-slides {
  height: 80%;
}

.close-fake {
  --background: transparent;
  margin-top: 10px;
  margin-bottom: 30px;
}

</style>