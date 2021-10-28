<template>
  <swiper
      v-if="!showSkeleton"
      :slides-per-view="1.1"
      :space-between="12"
  >
    <swiper-slide v-for="(i, index) in numberOfSlides" :key="i">
      <div class="w-full">
        <PlaceCard
            v-for="place in places.slice(index * 2, i * 2)"
            :key="place.id"
            :place="place"
            class="mb-5"
            @click="$emit('openPlaceModal', place)"
        />
      </div>
    </swiper-slide>
  </swiper>

  <div v-show="showSkeleton" class="mb-4">
    <PlaceCardSkeleton class="mb-2"></PlaceCardSkeleton>
    <PlaceCardSkeleton></PlaceCardSkeleton>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

import PlaceCard from '@/components/place/PlaceCard';

import PlaceCardSkeleton from '@/components/place/PlaceCardSkeleton';

import { Swiper, SwiperSlide } from 'swiper/vue';

export default defineComponent({
  name: "PlaceCardSlider",
  components: {
    Swiper,
    SwiperSlide,
    PlaceCard,
    PlaceCardSkeleton,
  },
  props: {
    places: {
      type: Object,
      default: null,
    },
    showSkeleton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['openPlaceModal'],
  setup(props) {
    /* Component properties */
    const numberOfSlides = computed(() => Math.ceil(props.places.length / 2));

    return {
      /* Component properties */
      numberOfSlides,

      /* Computed properties */

      /* Event handlers */


    };
  },
});
</script>