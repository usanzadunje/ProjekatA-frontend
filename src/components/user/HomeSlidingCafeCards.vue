<template>
  <div class="w-full">
    <CafeCard
        v-for="cafe in cafes"
        :key="cafe.id"
        class="mb-5"
        :cafe="cafe"
        @click="$emit('openCafeModal', cafe)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CafeCard from '@/components/user/CafeCard';

export default defineComponent({
  name: "HomeSlidingCafeCards",
  components: {
    CafeCard,
  },
  props: {
    cafes: {
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