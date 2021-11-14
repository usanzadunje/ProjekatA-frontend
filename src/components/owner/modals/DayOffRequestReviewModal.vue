<template>
  <div class="p-4 staff-modal-bg">
    <RequestStatusText
        :status="requestData.status"
        class="font-bold uppercase text-center"
    />
    <h2 class="secondary-heading text-center">{{ getDisplayNameForUser(requestData.staff) }}</h2>
    <div
        class="text-center secondary-heading"
    >
      <p>{{ `${$t('start')}: ${(requestData.start_date)}` }}</p>
      <p>{{ `${$t('end')}: ${requestData.end_date}` }}</p>
    </div>
    <div
        class="text-center secondary-heading"
    >
      <p>
        {{ requestData.message }}
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import RequestStatusText from '@/components/staff/RequestStatusText';

import { getDisplayNameForUser } from '@/utils/helpers';

export default defineComponent({
  name: 'DayOffRequestReviewModal',
  components: {
    RequestStatusText,
  },
  props: {
    requestData: {
      type: Object,
      default: null,
      required: true,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Component properties */
    /* Lifecycle hooks */

    /* Event handlers */

    const dismiss = () => {
      emit('dismiss');
    };

    return {
      /* Component properties */
      getDisplayNameForUser,

      /* Event handlers */
      dismiss,

      /* Icons */
    };
  },
});
</script>

<style scoped>

</style>