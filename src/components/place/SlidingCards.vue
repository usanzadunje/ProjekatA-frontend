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
            class="mb-5"
            :place="place"
            @click="$emit('openPlaceModal', place)"
        />
      </div>
    </swiper-slide>
  </swiper>

  <div v-show="showSkeleton" class="mb-4">
    <SkeletonPlaceCard class="mb-2"></SkeletonPlaceCard>
    <SkeletonPlaceCard></SkeletonPlaceCard>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

import PlaceCard from '@/components/place/PlaceCard';

import SkeletonPlaceCard from '@/components/place/SkeletonPlaceCard';

import { Swiper, SwiperSlide } from 'swiper/vue';

export default defineComponent({
  name: "HomeSlidingPlaceCards",
  components: {
    Swiper,
    SwiperSlide,
    PlaceCard,
    SkeletonPlaceCard,
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
    const numberOfSlides = computed(() => Math.floor(props.places.length / 2));

    return {
      /* Component properties */
      numberOfSlides,

      /* Computed properties */

      /* Event handlers */


    };
  },
});
</script>