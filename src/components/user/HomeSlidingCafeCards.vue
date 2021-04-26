<template>
  <div>
    <CafeCard
        v-for="cafe in cafes"
        :key="cafe.id"
        class="mb-5"
        :cafe="cafe"
        disabled
        @click="$emit('openCafeModal', cafe)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import CafeCard            from '@/components/user/CafeCard';

export default defineComponent({
  components: {
    CafeCard,
  },
  props: {
    cafes: {
      type: Object,
      default: null,
    },
  },
  setup() {


    return {
      /* Properties */

      /* Computed properties */

      /* Event handlers */


    };
  },
});
</script>