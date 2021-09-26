<template>
  <div class="w-full">
    <CafeCard
        v-for="place in places"
        :key="place.id"
        class="mb-5"
        :place="place"
        @click="$emit('openCafeModal', place)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CafeCard from '@/components/place/CafeCard';

export default defineComponent({
  name: "HomeSlidingCafeCards",
  components: {
    CafeCard,
  },
  props: {
    places: {
      type: Object,
      default: null,
    },
  },
  emits: ['openCafeModal'],
  setup() {


    return {
      /* Component properties */

      /* Computed properties */

      /* Event handlers */


    };
  },
});
</script>