<template>
  <div class="px-4 py-3">
    <p v-if="hasTitle" class="sliding-filter-title uppercase">FILTERI</p>
    <ion-slides :options="slideOpts">
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text h-9 w-32 uppercase"
            :class="activeSlidingButton === '' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter=""
            @click="sortButtonActivated"
        >
          Najblizi vama
          <ion-icon slot="start"
                    :icon="activeSlidingButton === '' ? locationOutline : locationInactiveOutline"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text h-9 w-28 uppercase"
            :class="activeSlidingButton === 'free' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="free"
            @click="sortButtonActivated"
        >
          SLOBODNI
          <ion-icon slot="start"
                    :icon="activeSlidingButton === 'free' ? graphSliceOutline : graphSliceInactiveOutline"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text h-9 w-20 uppercase"
            :class="activeSlidingButton === 'food' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="food"
            @click="sortButtonActivated"
        >
          HRANA
          <ion-icon slot="start"
                    :icon="activeSlidingButton === 'food' ? graphSliceOutline : graphSliceInactiveOutline"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text h-9 w-28 uppercase"
            :class="activeSlidingButton === 'popular' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="popular"
            @click="sortButtonActivated"
        >
          POPULARNO
          <ion-icon slot="start"
                    :icon="activeSlidingButton === 'popular' ? graphSliceOutline : graphSliceInactiveOutline"></ion-icon>
        </ion-button>
      </ion-slide>
    </ion-slides>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import {
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
}                                                    from '@ionic/vue';
import {
  locationOutline,
  locationInactiveOutline,
  graphSliceOutline,
  graphSliceInactiveOutline,
}                                                    from '@/assets/icons';

export default defineComponent({
  name: 'SlidingFilter',
  components: {
    IonIcon,
    IonButton,
    IonSlides,
    IonSlide,
  },
  props: {
    hasTitle: Boolean,
  },
  setup(props, { emit }) {
    /* Properties */
    let activeSlidingButton = ref('');
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      centeredSlides: false,
      spaceBetween: 10,
      slidesPerView: 2.3,
      freeMode: true,
    };

    /* Lifecycle hook */
    // Without this on android options are not passed to swiper
    onMounted(() => {
      const slides = document.querySelector("ion-slides");
      nextTick(() => {
        slides.options = slideOpts;
      });
    });

    /* Event handlers */
    const sortButtonActivated = (event) => {
      activeSlidingButton.value = event.target.dataset.slidingFilter;
      emit('sortHasChanged', 'id');
    };

    return {
      /* Properties */
      activeSlidingButton,
      slideOpts,

      /* Event listeners */
      sortButtonActivated,

      /* Icons */
      locationOutline,
      locationInactiveOutline,
      graphSliceOutline,
      graphSliceInactiveOutline,
    };
  },
});
</script>
<style scoped>
ion-button {
  --background-activated: #207DFF;
}

ion-slide {
  overflow-x: auto !important;
}
</style>