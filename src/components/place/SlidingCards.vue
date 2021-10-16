<template>
  <div class="w-full">
    <PlaceCard
        v-for="place in places"
        :key="place.id"
        class="mb-5"
        :place="place"
        @click="$emit('openPlaceModal', place)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import PlaceCard from '@/components/place/PlaceCard';

export default defineComponent({
  name: "HomeSlidingPlaceCards",
  components: {
    PlaceCard,
  },
  props: {
    places: {
      type: Object,
      default: null,
    },
  },
  emits: ['openPlaceModal'],
  setup() {


    return {
      /* Component properties */

      /* Computed properties */

      /* Event handlers */


    };
  },
});
</script>