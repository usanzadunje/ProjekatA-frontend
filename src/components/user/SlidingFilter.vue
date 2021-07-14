<template>
  <div class="mt-1">
    <p v-if="hasTitle" class="sliding-filter-title uppercase">FILTERI</p>
    <ion-slides class="filterSlider">
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'distance' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="distance"
            @click="sortButtonActivated"
        >
          Najblizi vama
          <ion-icon slot="start"
                    :icon="locationOutline"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'availability' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="availability"
            @click="sortButtonActivated"
        >
          SLOBODNI
          <ion-icon slot="start"
                    :icon="pieChart"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'food' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="food"
            @click="sortButtonActivated"
        >
          HRANA
          <ion-icon slot="start"
                    :icon="pieChart"></ion-icon>
        </ion-button>
      </ion-slide>
      <ion-slide>
        <ion-button
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'popular' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            data-sliding-filter="popular"
            @click="sortButtonActivated"
        >
          POPULARNO
          <ion-icon slot="start"
                    :icon="pieChart"></ion-icon>
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
    hasTitle: Boolean,
  },
  emits: ['sortHasChanged'],
  setup(props, { emit }) {
    /* Component properties */
    let activeSlidingButton = ref('distance');

    /* Event handlers */
    const sortButtonActivated = (event) => {
      activeSlidingButton.value = event.target.dataset.slidingFilter;
      emit('sortHasChanged', activeSlidingButton.value);
    };

    return {
      /* Component properties */
      activeSlidingButton,

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
}

ion-slide {
  margin-left: -4px !important;
}
</style>