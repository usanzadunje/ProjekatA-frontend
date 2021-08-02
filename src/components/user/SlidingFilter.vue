<template>
  <div class="mt-1">
    <p v-if="hasTitle" class="sliding-filter-title uppercase ml-1">{{ $t('filter', 5) }}</p>
    <ion-slides :options="slideOpts">
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'distance' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="distance"
            @click="sortButtonActivated"
        >
          {{ $t('closest') }}
          <ion-icon slot="start" :icon="locationOutline"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'availability' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="availability"
            @click="sortButtonActivated"
        >
          {{ $t('available') }}
          <ion-icon slot="start" :icon="pieChart"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'food' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="food"
            @click="sortButtonActivated"
        >
          {{ $t('food') }}
          <ion-icon slot="start" :icon="pieChart"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'popular' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="popular"
            @click="sortButtonActivated"
        >
          {{ $t('popular') }}
          <ion-icon slot="start" :icon="pieChart"></ion-icon>
        </ion-button>
      </ion-slide>
    </ion-slides>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

import {
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
} from '@ionic/vue';

import {
  locationOutline,
  pieChart,
} from 'ionicons/icons';

export default defineComponent({
  name: 'SlidingFilter',
  components: {
    IonIcon,
    IonButton,
    IonSlides,
    IonSlide,
  },
  props: {
    hasTitle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['sortHasChanged'],
  setup(props, { emit }) {
    /* Component properties */
    let activeSlidingButton = ref('distance');
    const slideOpts = {
      freeMode: true,
      slidesPerView: 2.7,
    };

    /* Event handlers */
    const sortButtonActivated = (event) => {
      activeSlidingButton.value = event.target.dataset.slidingFilter;
      emit('sortHasChanged', activeSlidingButton.value);
    };

    return {
      /* Component properties */
      activeSlidingButton,
      slideOpts,

      /* Event listeners */
      sortButtonActivated,

      /* Icons */
      locationOutline,
      pieChart,
    };
  },
});
</script>
<style scoped>
ion-button {
  height: 30px;
  width: 113px;
}
</style>