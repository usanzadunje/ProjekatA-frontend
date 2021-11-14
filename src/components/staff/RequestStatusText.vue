<template>
  <div>
    <span
        v-if="status === DECLINED"
        class="text-danger"
    >
            {{ $t('declined') }}
          </span>
    <span
        v-if="status === APPROVED"
        class="text-success"
    >
            {{ $t('approved') }}
          </span>
    <span
        v-if="status === PENDING"
        class="text-warning"
    >
            {{ $t('pending') }}
          </span>
  </div>
</template>

<script>
import { defineComponent }   from 'vue';
import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

export default defineComponent({
  name: 'RequestStatusText',
  components: {},
  props: {
    status: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */
    const {
      PENDING,
      DECLINED,
      APPROVED,
    } = useDaysOffRequest();

    /* Event handlers */


    return {
      /* Component properties */
      PENDING,
      DECLINED,
      APPROVED,

      /* Event handlers */

      /* Icons */
    };
  },
});

</script>
<style scoped>
</style>
