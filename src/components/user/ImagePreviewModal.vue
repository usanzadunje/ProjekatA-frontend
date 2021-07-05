<template>
  <ion-content :fullscreen="true">
    <ion-item class="close-fake text-center" lines="none">
      <ion-button @click="dismiss" fill="clear" color="light">
        <ion-icon :icon="close" slot="start"></ion-icon>
        Back
      </ion-button>

      <ion-button @click="zoom(true)" fill="clear" color="light">
        <ion-icon :icon="add" slot="start"></ion-icon>
        in
      </ion-button>

      <ion-button @click="zoom(false)" fill="clear" color="light">
        <ion-icon :icon="remove" slot="start"></ion-icon>
        out
      </ion-button>
    </ion-item>

    <ion-slides id="imagePreviewSlider" ref="slides">
      <ion-slide>
        <div class="swiper-zoom-container">
          <img
              :src="`${backendStorageURL}/cafe/cafeshow.png`"
              alt=""
          >
        </div>
      </ion-slide>
    </ion-slides>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  modalController,
} from '@ionic/vue';

import {
  close,
  add,
  remove,
}                         from 'ionicons/icons';
import { onMounted, ref } from 'vue';

export default {
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
    img: {
      type: String,
      default: null,
    },
  },
  setup() {
    /* Component properties */
    const slides = ref(null);
    const slideOpts = {
      zoom: {
        maxRatio: 2,
      },
    };

    /* Lifecycle hooks */
    onMounted(() => {
      const slides = document.getElementById("imagePreviewSlider");
      setTimeout(() => {
        slides.options = slideOpts;
        slides.update();
      }, 150);
    });

    /* Event handlers */
    const zoom = async(zoomIn) => {
      let swiper = await slides?.value?.$el.getSwiper();
      if(zoomIn){
        swiper.zoom.in();
      }else {
        swiper.zoom.out();
      }
    };
    const dismiss = () => {
      modalController.dismiss();
    };

    return {
      /* Component properties */
      slides,
      slideOpts,

      /* Event handlers */
      zoom,
      dismiss,

      /* Icons */
      close,
      add,
      remove,
    };
  },
};
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
  margin-top: 40px;
}

</style>