<template>
  <div class="mt-1">
    <p v-if="hasTitle" class="sliding-filter-title uppercase ml-1">{{ $t('filter', 5) }}</p>
    <swiper
        id="slidingFilterSwiper"
        ref="swiper"
        :slides-per-view="deviceWidth <= 335 ? 2.1 : 2.6"
    >
      <swiper-slide>
        <ion-button
            data-sliding-filter="distance"
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'distance' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            @click="sortButtonActivated"
        >
          <ion-icon slot="start"
                    :icon="activeSlidingButton === 'distance' ? locationSharp : locationOutline"></ion-icon>
          {{ $t('closest') }}
        </ion-button>
      </swiper-slide>
      <swiper-slide v-if="this.$store.getters['auth/loggedIn']">
        <ion-button
            data-sliding-filter="favorites"
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'favorites' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            @click="sortButtonActivated"
        >
          <ion-icon slot="start" :icon="activeSlidingButton === 'favorites' ? starSharp : starOutline"></ion-icon>
          {{ $t('favorite', 2) }}
        </ion-button>
      </swiper-slide>
      <swiper-slide>
        <ion-button
            data-sliding-filter="availability"
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'availability' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            @click="sortButtonActivated"
        >
          <ion-icon slot="start"
                    :icon="activeSlidingButton === 'availability' ? ellipseSharp : ellipseOutline"></ion-icon>
          {{ $t('available') }}
        </ion-button>
      </swiper-slide>
      <swiper-slide>
        <ion-button
            data-sliding-filter="food"
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'food' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            @click="sortButtonActivated"
        >
          <ion-icon slot="start" :icon="activeSlidingButton === 'food' ? pizzaSharp : pizzaOutline"></ion-icon>
          {{ $t('food') }}
        </ion-button>
      </swiper-slide>
      <swiper-slide>
        <ion-button
            data-sliding-filter="random"
            class="sliding-filter-button sliding-filter-button-text uppercase"
            :class="activeSlidingButton === 'random' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
            @click="sortButtonActivated"
        >
          <ion-icon slot="start" :icon="shuffle" style="font-size:1.1rem"></ion-icon>
          {{ $t('random') }}
        </ion-button>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import {
  IonIcon,
  IonButton,
}                                          from '@ionic/vue';
import { Swiper, SwiperSlide }             from 'swiper/vue';

import { deviceWidth } from '@/composables/useDevice';

import {
  locationOutline,
  locationSharp,
  starOutline,
  starSharp,
  pizzaOutline,
  pizzaSharp,
  ellipseOutline,
  ellipseSharp,
  shuffle,
} from 'ionicons/icons';

export default defineComponent({
  name: 'SlidingFilter',
  components: {
    IonIcon,
    IonButton,
    Swiper,
    SwiperSlide,
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
    const swiper = ref();

    /* Lifecycle hooks */
    onMounted(() => {
      setTimeout(() => {
        swiper.value?.$el?.swiper?.update();
      }, 301);
    });

    /* Event handlers */
    const sortButtonActivated = (event) => {
      activeSlidingButton.value = event.target.dataset.slidingFilter;
      emit('sortHasChanged', activeSlidingButton.value);
    };

    return {
      /* Component properties */
      activeSlidingButton,
      swiper,
      deviceWidth,

      /* Event listeners */
      sortButtonActivated,

      /* Icons */
      locationOutline,
      locationSharp,
      starSharp,
      starOutline,
      pizzaSharp,
      pizzaOutline,
      ellipseSharp,
      ellipseOutline,
      shuffle,
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